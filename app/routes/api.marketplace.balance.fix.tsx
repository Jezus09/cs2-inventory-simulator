/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Ian Lucas. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { json, type LoaderFunctionArgs, type ActionFunctionArgs } from "@remix-run/node";
import { findRequestUser } from "~/auth.server";
import { getUserBalance, addUserBalance } from "~/models/marketplace.server";
import { middleware } from "~/http.server";

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    await middleware(request);
  
    const user = await findRequestUser(request);
    if (!user) {
      return json({ error: "Unauthorized" }, { status: 401 });
    }
  
    const balance = await getUserBalance(user.id);
    
    return json({ balance });
  } catch (error) {
    console.error("Error in marketplace balance loader:", error);
    return json({ error: "Failed to fetch balance" }, { status: 500 });
  }
}

export async function action({ request }: ActionFunctionArgs) {
  try {
    await middleware(request);
  
    if (request.method !== "POST") {
      return json({ error: "Method not allowed" }, { status: 405 });
    }
  
    const user = await findRequestUser(request);
    if (!user) {
      return json({ error: "Unauthorized" }, { status: 401 });
    }
  
    try {
      const data = await request.json();
      const { amount } = data;
    
      if (typeof amount !== "number" || amount <= 0) {
        return json({ error: "Amount must be a positive number" }, {