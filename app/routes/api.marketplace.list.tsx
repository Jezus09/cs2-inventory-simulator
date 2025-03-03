/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Ian Lucas. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { getMarketplaceItems } from "~/models/marketplace.server";
import { middleware } from "~/http.server";

export async function loader({ request }: LoaderFunctionArgs) {
  await middleware(request);
  
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "1");
  const limit = parseInt(url.searchParams.get("limit") || "20");
  const type = url.searchParams.get("type") || undefined;
  const minPrice = url.searchParams.get("minPrice") ? parseFloat(url.searchParams.get("minPrice")!) : undefined;
  const maxPrice = url.searchParams.get("maxPrice") ? parseFloat(url.searchParams.get("maxPrice")!) : undefined;
  const rarity = url.searchParams.get("rarity") || undefined;
  const search = url.searchParams.get("search") || undefined;
  
  const result = await getMarketplaceItems({
    page,
    limit,
    type,
    minPrice,
    maxPrice,
    rarity,
    search
  });
  
  return json(result);
}