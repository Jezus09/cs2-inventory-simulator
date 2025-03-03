/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Ian Lucas. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { json, type ActionFunctionArgs } from "@remix-run/node";
import { findRequestUser } from "~/auth.server";
import { listItemForSale } from "~/models/marketplace.server";
import { middleware } from "~/http.server";

export async function action({ request }: ActionFunctionArgs) {
  await middleware(request);

  // Only allow POST method
  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, { status: 405 });
  }

  // Ensure user is authenticated
  const user = await findRequestUser(request);
  if (!user) {
    return json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Parse request data
    const data = await request.json();
    const { itemUid, price, description } = data;

    // Validate required fields
    if (!itemUid || !price) {
      return json({ error: "Missing required fields" }, { status: 400 });
    }

    // Create the marketplace listing
    const marketplaceItem = await listItemForSale({
      userId: user.id,
      itemUid,
      price,
      description
    });

    return json({ success: true, marketplaceItem });
  } catch (error: any) {
    return json({ error: error.message || "Failed to list item" }, { status: 500 });
  }
}