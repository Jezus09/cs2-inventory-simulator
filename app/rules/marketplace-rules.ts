/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Ian Lucas. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { prisma } from "~/db.server";

// This function seeds the marketplace rules into your database
export async function seedMarketplaceRules() {
  const rules = [
    // Enable/disable marketplace feature globally
    {
      name: "marketplaceEnabled",
      value: "true",
      type: "boolean"
    },
    
    // Allow users to sell items
    {
      name: "inventoryItemAllowSell",
      value: "true",
      type: "boolean"
    },
    
    // Maximum price allowed for listing items
    {
      name: "marketplaceMaxPrice",
      value: "10000",
      type: "number"
    },
    
    // Minimum price allowed for listing items
    {
      name: "marketplaceMinPrice",
      value: "0.03",
      type: "number"
    },
    
    // Tax percentage charged on sales (0-100)
    {
      name: "marketplaceTaxPercentage",
      value: "5",
      type: "number"
    },
    
    // Enable/disable funds management
    {
      name: "marketplaceFundsEnabled", 
      value: "true",
      type: "boolean"
    },
    
    // Maximum funds a user can add at once
    {
      name: "marketplaceMaxFundsAddAmount",
      value: "1000",
      type: "number"
    },
    
    // Maximum number of items a user can list at once
    {
      name: "marketplaceMaxUserListings",
      value: "100",
      type: "number"
    }
  ];

  // Upsert each rule (create if doesn't exist, update if it does)
  for (const rule of rules) {
    await prisma.rule.upsert({
      where: { name: rule.name },
      update: { value: rule.value, type: rule.type },
      create: rule
    });
  }
  
  console.log(`Seeded ${rules.length} marketplace rules`);
}