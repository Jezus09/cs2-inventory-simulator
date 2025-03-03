// In your loader function in root.tsx, add the marketplace rules to the list
const rules = await getRules(
  [
    // Existing rules...
    
    // Add marketplace rules
    "marketplaceEnabled",
    "inventoryItemAllowSell",
    "marketplaceMaxPrice",
    "marketplaceMinPrice",
    "marketplaceTaxPercentage",
    "marketplaceFundsEnabled",
    "marketplaceMaxFundsAddAmount",
    "marketplaceAllowSellCases",
    "marketplaceAllowSellKeys",
    "marketplaceAllowSellStickers",
    "marketplaceAllowSellStatTrak",
    "marketplaceAllowSellWithStickers",
    "marketplaceMaxUserListings",
    "marketplaceListingExpireHours"
  ],
  user?.id
);