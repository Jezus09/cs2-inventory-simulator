/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Ian Lucas. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { type LoaderFunctionArgs } from "@remix-run/node";
import { getRule } from "./models/rule.server";

// Add proper error handling to the callback URL retrieval
export async function getSteamCallbackUrl() {
  try {
    const callbackUrlRule = await getRule("steamCallbackUrl");
    // Validate the URL before returning it
    if (!callbackUrlRule || !callbackUrlRule.trim()) {
      console.error("Steam callback URL not found in rules");
      return new URL("http://localhost:3000/auth/callback"); // Fallback URL
    }
    
    return new URL(callbackUrlRule);
  } catch (error) {
    console.error("Error getting Steam callback URL:", error);
    return new URL("http://localhost:3000/auth/callback"); // Fallback URL
  }
}

// Update your authentication functions to use the getSteamCallbackUrl helper
export async function findRequestUser(request: Request) {
  try {
    // Your existing code with proper error handling
    // ...
    return user;
  } catch (error) {
    console.error("Error in findRequestUser:", error);
    return null;
  }
}

// Add similar error handling to other auth-related functions