/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Ian Lucas. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { prisma } from "~/db.server";
import { getRule } from "./rule.server";
import { v4 as uuidv4 } from "uuid";

// User balance functions
export async function getUserBalance(userId: string): Promise<number> {
  const userBalance = await prisma.userBalance.findUnique({
    where: { userId }
  });
  
  return userBalance?.balance || 0;
}

export async function addUserBalance(userId: string, amount: number) {
  // Handle validation
  if (amount <= 0) {
    throw new Error("Amount must be positive");
  }
  
  // Check if there's a maximum allowed amount
  const maxAmount = await getRule("marketplaceMaxFundsAddAmount");
  if (maxAmount && amount > parseFloat(maxAmount)) {
    throw new Error(`Cannot add more than ${maxAmount} at once`);
  }
  
  return prisma.userBalance.upsert({
    where: { userId },
    update: {
      balance: {
        increment: amount
      },
      updatedAt: new Date()
    },
    create: {
      userId,
      balance: amount,
      updatedAt: new Date()
    }
  });
}

// Marketplace listing functions
interface ListItemParams {
  userId: string;
  itemUid: number;
  price: number;
  description?: string;
}

export async function listItemForSale({ userId, itemUid, price, description }: ListItemParams) {
  // Check if marketplace is enabled
  const marketplaceEnabled = await getRule("marketplaceEnabled");
  if (marketplaceEnabled !== "true") {
    throw new Error("Marketplace is currently disabled");
  }
  
  // Check price limits
  const minPrice = await getRule("marketplaceMinPrice");
  const maxPrice = await getRule("marketplaceMaxPrice");
  
  if (minPrice && price < parseFloat(minPrice)) {
    throw new Error(`Price cannot be lower than ${minPrice}`);
  }
  
  if (maxPrice && price > parseFloat(maxPrice)) {
    throw new Error(`Price cannot be higher than ${maxPrice}`);
  }
  
  // Get item details from user inventory
  const inventoryItem = await prisma.inventoryItem.findFirst({
    where: {
      uid: itemUid,
      userId
    }
  });
  
  if (!inventoryItem) {
    throw new Error("Item not found in your inventory");
  }
  
  // Check if item is already listed
  const existingListing = await prisma.marketplaceItem.findUnique({
    where: { itemUid }
  });
  
  if (existingListing) {
    throw new Error("This item is already listed on the marketplace");
  }
  
  // Get maximum listings per user
  const maxListings = await getRule("marketplaceMaxUserListings");
  if (maxListings) {
    const userListings = await prisma.marketplaceItem.count({
      where: {
        sellerId: userId,
        status: "active"
      }
    });
    
    if (userListings >= parseInt(maxListings)) {
      throw new Error(`You cannot have more than ${maxListings} active listings`);
    }
  }
  
  // Create marketplace listing
  const listing = await prisma.marketplaceItem.create({
    data: {
      id: uuidv4(),
      itemUid,
      sellerId: userId,
      name: inventoryItem.name,
      description,
      price,
      itemType: inventoryItem.type,
      rarity: inventoryItem.rarity,
      status: "active",
      updatedAt: new Date()
    }
  });
  
  return listing;
}

interface GetMarketplaceItemsParams {
  page?: number;
  limit?: number;
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  rarity?: string;
  search?: string;
}

export async function getMarketplaceItems({
  page = 1,
  limit = 20,
  type,
  minPrice,
  maxPrice,
  rarity,
  search
}: GetMarketplaceItemsParams) {
  const where = {
    status: "active",
    ...(type && { itemType: type }),
    ...(minPrice && { price: { gte: minPrice } }),
    ...(maxPrice && { price: { lte: maxPrice } }),
    ...(rarity && { rarity }),
    ...(search && { 
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ] 
    })
  };
  
  const totalItems = await prisma.marketplaceItem.count({ where });
  const totalPages = Math.ceil(totalItems / limit) || 1;
  
  const items = await prisma.marketplaceItem.findMany({
    where,
    include: {
      seller: {
        select: {
          id: true,
          name: true,
          avatar: true
        }
      }
    },
    orderBy: { price: 'asc' },
    skip: (page - 1) * limit,
    take: limit
  });
  
  return {
    items,
    pagination: {
      page,
      limit,
      totalItems,
      totalPages
    }
  };
}

interface BuyMarketplaceItemParams {
  buyerId: string;
  marketplaceItemId: string;
}

export async function buyMarketplaceItem({ buyerId, marketplaceItemId }: BuyMarketplaceItemParams) {
  // Check if marketplace is enabled
  const marketplaceEnabled = await getRule("marketplaceEnabled");
  if (marketplaceEnabled !== "true") {
    throw new Error("Marketplace is currently disabled");
  }
  
  // Find the marketplace item
  const marketplaceItem = await prisma.marketplaceItem.findUnique({
    where: { id: marketplaceItemId },
    include: {
      seller: {
        select: {
          id: true
        }
      }
    }
  });
  
  if (!marketplaceItem) {
    throw new Error("Item not found");
  }
  
  if (marketplaceItem.status !== "active") {
    throw new Error("This item is no longer available");
  }
  
  if (marketplaceItem.seller.id === buyerId) {
    throw new Error("You cannot buy your own items");
  }
  
  // Get buyer balance
  const buyerBalance = await getUserBalance(buyerId);
  if (buyerBalance < marketplaceItem.price) {
    throw new Error("Insufficient funds");
  }
  
  // Start transaction
  const sellerId = marketplaceItem.seller.id;
  const price = marketplaceItem.price;
  
  return prisma.$transaction(async (tx) => {
    // Calculate tax
    const taxPercentageStr = await getRule("marketplaceTaxPercentage");
    const taxPercentage = taxPercentageStr ? parseFloat(taxPercentageStr) : 0;
    const taxAmount = (price * taxPercentage) / 100;
    const sellerReceives = price - taxAmount;
    
    // Update buyer balance
    await tx.userBalance.upsert({
      where: { userId: buyerId },
      update: {
        balance: { decrement: price },
        updatedAt: new Date()
      },
      create: {
        userId: buyerId,
        balance: -price,
        updatedAt: new Date()
      }
    });
    
    // Update seller balance
    await tx.userBalance.upsert({
      where: { userId: sellerId },
      update: {
        balance: { increment: sellerReceives },
        updatedAt: new Date()
      },
      create: {
        userId: sellerId,
        balance: sellerReceives,
        updatedAt: new Date()
      }
    });
    
    // Update item ownership in inventory
    await tx.inventoryItem.update({
      where: { uid: marketplaceItem.itemUid },
      data: {
        userId: buyerId
      }
    });
    
    // Update marketplace item status
    const updatedItem = await tx.marketplaceItem.update({
      where: { id: marketplaceItemId },
      data: {
        status: "sold",
        updatedAt: new Date()
      }
    });
    
    // Create transaction record
    const transaction = await tx.transaction.create({
      data: {
        id: uuidv4(),
        marketplaceItemId,
        buyerId,
        sellerId,
        price,
        status: "completed"
      }
    });
    
    return { updatedItem, transaction };
  });
}

interface CancelMarketplaceListingParams {
  userId: string;
  marketplaceItemId: string;
}

export async function cancelMarketplaceListing({ userId, marketplaceItemId }: CancelMarketplaceListingParams) {
  // Find the marketplace item
  const marketplaceItem = await prisma.marketplaceItem.findUnique({
    where: { id: marketplaceItemId }
  });
  
  if (!marketplaceItem) {
    throw new Error("Item not found");
  }