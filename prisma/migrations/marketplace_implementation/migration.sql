-- CreateTable
CREATE TABLE "MarketplaceItem" (
  "id" TEXT NOT NULL,
  "itemUid" INTEGER NOT NULL,
  "sellerId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "price" DOUBLE PRECISION NOT NULL,
  "itemType" TEXT NOT NULL,
  "rarity" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "MarketplaceItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
  "id" TEXT NOT NULL,
  "marketplaceItemId" TEXT NOT NULL,
  "buyerId" TEXT NOT NULL,
  "sellerId" TEXT NOT NULL,
  "price" DOUBLE PRECISION NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'completed',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserBalance" (
  "userId" TEXT NOT NULL,
  "balance" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "UserBalance_pkey" PRIMARY KEY ("userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "MarketplaceItem_itemUid_key" ON "MarketplaceItem"("itemUid");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_marketplaceItemId_key" ON "Transaction"("marketplaceItemId");

-- AddForeignKey
ALTER TABLE "MarketplaceItem" ADD CONSTRAINT "MarketplaceItem_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_marketplaceItemId_fkey" FOREIGN KEY ("marketplaceItemId") REFERENCES "MarketplaceItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBalance" ADD CONSTRAINT "UserBalance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Add index for better performance
CREATE INDEX "MarketplaceItem_status_idx" ON "MarketplaceItem"("status");
CREATE INDEX "MarketplaceItem_price_idx" ON "MarketplaceItem"("price");
CREATE INDEX "MarketplaceItem_itemType_idx" ON "MarketplaceItem"("itemType");
CREATE INDEX "MarketplaceItem_sellerId_idx" ON "MarketplaceItem"("sellerId");
CREATE INDEX "Transaction_buyerId_idx" ON "Transaction"("buyerId");
CREATE INDEX "Transaction_sellerId_idx" ON "Transaction"("sellerId");