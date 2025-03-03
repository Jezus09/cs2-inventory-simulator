/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Ian Lucas. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ActionFunctionArgs, json } from "@remix-run/node";
import { z } from "zod";
import { api } from "~/api.server";
import { middleware } from "~/http.server";
import { methodNotAllowed, badRequest } from "~/responses.server";
import { prisma } from "~/db.server";
import { manipulateUserInventory } from "~/models/user.server";

export const action = api(async ({ request }: ActionFunctionArgs) => {
  await middleware(request);
  
  if (request.method !== "POST") {
    throw methodNotAllowed;
  }
  
  const { userId, itemId } = z
    .object({
      userId: z.string(),
      itemId: z.string()
    })
    .parse(await request.json());
  
  // Tranzakció indítása, hogy az adatbázis konzisztens maradjon
  const result = await prisma.$transaction(async (tx) => {
    // Ellenőrizzük, hogy létezik-e és elérhető-e az elem
    const marketplaceItem = await tx.marketplaceItem.findFirst({
      where: {
        id: itemId,
        isAvailable: true
      }
    });
    
    if (!marketplaceItem) {
      throw badRequest;
    }
    
    // Lekérjük a vásárló adatait
    const buyer = await tx.user.findUnique({
      where: { id: userId },
      select: { inventory: true }
    });
    
    if (!buyer) {
      throw badRequest;
    }
    
    // Frissítjük a piactéri elem státuszát
    await tx.marketplaceItem.update({
      where: { id: itemId },
      data: { isAvailable: false }
    });
    
    // Hozzáadjuk az elemet a