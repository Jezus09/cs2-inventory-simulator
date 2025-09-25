/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Ian Lucas. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Authenticator } from "remix-auth";
import { ApiStrategy } from "./api-strategy.server";
import { findUniqueUser } from "./models/user.server";
import { getSession } from "./session.server";
import { SteamStrategy } from "./steam-strategy.server";

export const authenticator = new Authenticator<string>();

authenticator.use(new SteamStrategy(), "steam");
authenticator.use(new ApiStrategy(), "api");

export async function requireUser(request: Request) {
  const session = await getSession(request.headers.get("cookie"));
  const userId = session.get("userId") as string | undefined;
  
  if (!userId) {
    throw new Response("Unauthorized", { status: 401 });
  }

  const user = await findUniqueUser(userId);
  return user;
}

export async function findRequestUser(request: Request) {
  try {
    const session = await getSession(request.headers.get("cookie"));
    const userId = session.get("userId") as string | undefined;
    
    if (!userId) {
      return null;
    }

    return await findUniqueUser(userId);
  } catch (error) {
    console.error("Error in findRequestUser:", error);
    return null;
  }
}