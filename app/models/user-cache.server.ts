/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Ian Lucas. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CS_BaseInventoryItem } from "@ianlucas/cs2-lib";
import { json } from "@remix-run/node";
import { z } from "zod";
import { prisma } from "~/db.server";
import { res } from "~/response.server";
import { parseInventory } from "~/utils/inventory";
import { getUserInventory, getUserSyncedAt } from "./user.server";

export async function handleUserCachedResponse({
  args,
  domainHostname,
  generate,
  mimeType,
  throwBody,
  url,
  userId
}: {
  args: string | null;
  domainHostname: string;
  generate:
    | ((inventory: CS_BaseInventoryItem[], userId: string) => any)
    | ((inventory: CS_BaseInventoryItem[], userId: string) => Promise<any>);
  throwBody: any;
  mimeType: string;
  url: string;
  userId: string;
}) {
  const user = await prisma.user.findFirst({
    select: { id: true },
    where: { id: userId }
  });
  if (user === null) {
    throw mimeType === "application/json"
      ? json(throwBody)
      : res(throwBody, mimeType);
  }
  const timestamp = await getUserSyncedAt(domainHostname, userId);
  const cache = await prisma.userCache.findFirst({
    select: { body: true },
    where: {
      args,
      url,
      userId,
      timestamp
    }
  });
  if (cache !== null) {
    return res(cache.body, mimeType);
  }
  const inventory = await getUserInventory(domainHostname, userId);
  if (!inventory) {
    throw mimeType === "application/json"
      ? json(throwBody)
      : res(throwBody, mimeType);
  }
  const generated = await generate(parseInventory(inventory), userId);
  const body =
    mimeType === "application/json"
      ? JSON.stringify(generated)
      : z.string().parse(generated);
  await prisma.userCache.upsert({
    create: {
      args,
      body,
      timestamp,
      url,
      userId
    },
    update: {
      args,
      body,
      timestamp
    },
    where: {
      url_userId: {
        url,
        userId
      }
    }
  });
  return res(body, mimeType);
}
