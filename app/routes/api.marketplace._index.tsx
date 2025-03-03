/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Ian Lucas. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { z } from "zod";
import { api } from "~/api.server";
import { middleware } from "~/http.server";
import { methodNotAllowed } from "~/responses.server";
import { prisma } from "~/db.server";

// Ez az API endpoint GET kérés esetén visszaadja a piactéren elérhető tárgyakat
export const loader = api(async ({ request }: LoaderFunctionArgs) => {
  await middleware(request);
  
  // Itt később bővítheted szűrési lehetőségekkel
  const items = await prisma.marketplaceItem.findMany({
    orderBy: {
      createdAt: "desc"
    }
  });
  
  return json({ items });
});

// Ez az API endpoint POST kérés esetén új tárgyat ad a piactérhez
export const action = api(async ({ request }: ActionFunctionArgs) => {
  await middleware(request);
  
  if (request.method !== "POST") {
    throw methodNotAllowed;
  }
  
  const { userId, itemData, price } = z
    .object({
      userId: z.string(),
      itemData: z.record(z.any()),
      price: z.number().positive()
    })
    .parse(await request.json());
  
  const marketplaceItem = await prisma.marketplaceItem.create({
    data: {
      sellerId: userId,
      itemData,
      price,
      isAvailable: true,
      createdAt: new Date()
    }
  });
  
  return json({ marketplaceItem });
});