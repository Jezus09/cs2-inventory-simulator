/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Ian Lucas. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTag, faUser, faClock } from "@fortawesome/free-solid-svg-icons";
import { useLocalize } from "./app-context";
import { Button } from "./button";
import { useState } from "react";
import { playSound } from "~/utils/sound";
import { useMarketplace } from "./marketplace-context";

interface MarketplaceItemProps {
  id: string;
  name: string;
  price: number;
  itemType: string;
  rarity?: string;
  seller: {
    id: string;
    name: string;
    avatar: string;
  };
  currentUserId?: string;
  onPurchase: (id: string) => Promise<void>;
  onCancel?: (id: string) => Promise<void>;
}

export function MarketplaceItem({ 
  id, 
  name, 
  price, 
  itemType, 
  rarity, 
  seller, 
  currentUserId,
  onPurchase,
  onCancel 
}: MarketplaceItemProps) {
  const localize = useLocalize();
  const { balance } = useMarketplace();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const isOwner = seller.id === currentUserId;
  const canBuy = balance >= price && !isOwner;
  
  const formattedPrice = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2
  }).format(price);
  
  const handlePurchase = async () => {
    if (isLoading || !canBuy) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      await onPurchase(id);
      playSound("inventory_item_pickup");
    } catch (err: any) {
      setError(err.message || localize("MarketplacePurchaseFailed"));
      playSound("inventory_item_close");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCancel = async () => {
    if (isLoading || !isOwner || !onCancel) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      await onCancel(id);
      playSound("inventory_item_pickup");
    } catch (err: any) {
      setError(err.message || localize("MarketplaceCancelFailed"));
      playSound("inventory_item_close");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Determine rarity class for styling
  const rarityClass = rarity?.toLowerCase() || "normal";
  const rarityColors: Record<string, string> = {
    consumer: "border-gray-400",
    industrial: "border-blue-400",
    mil_spec: "border-blue-500",
    restricted: "border-purple-500",
    classified: "border-pink-500",
    covert: "border-red-500",
    rare: "border-yellow-400",
    extraordinary: "border-yellow-500",
    contraband: "border-yellow-600",
    default: "border-gray-600"
  };
  
  const borderColorClass = rarityColors[rarityClass] || rarityColors.default;
  
  return (
    <div className={`flex flex-col rounded-md border ${borderColorClass} bg-stone-800 shadow`}>
      <div className="p-4">
        <div className="flex justify-between">
          <h3 className="font-semibold text-white truncate" title={name}>
            {name}
          </h3>
          <span className="font-bold text-green-400">{formattedPrice}</span>
        </div>
        
        <div className="mt-1 flex items-center text-xs text-gray-300">
          <FontAwesomeIcon icon={faUser} className="mr-1" />
          <span className="truncate" title={seller.name}>{seller.name}</span>
        </div>
        
        <div className="mt-3">
          <div className="inline-block rounded bg-stone-700 px-2 py-1 text-xs text-gray-300">
            {itemType}
          </div>
          {rarity && (
            <div className="ml-2 inline-block rounded bg-stone-700 px-2 py-1 text-xs text-gray-300">
              {rarity}
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-auto border-t border-stone-700 p-3">
        {error && (
          <div className="mb-2 rounded bg-red-900/20 p-1 text-xs text-red-400">
            {error}
          </div>
        )}
        
        {isOwner && onCancel ? (
          <Button
            className="w-full border border-red-600 bg-red-600/20 py-1 text-sm text-red-400 hover:bg-red-600/30"
            onClick={handleCancel}
            disabled={isLoading}
          >
            {isLoading ? localize("MarketplaceProcessing") : localize("MarketplaceCancel")}
          </Button>
        ) : (
          <Button
            className={`w-full py-1 text-sm ${
              canBuy
                ? "border border-green-600 bg-green-600/20 text-green-400 hover:bg-green-600/30"
                : "border border-gray-600 bg-gray-600/20 text-gray-400 cursor-not-allowed"
            }`}
            onClick={handlePurchase}
            disabled={!canBuy || isLoading}
          >
            {isLoading 
              ? localize("MarketplaceProcessing") 
              : isOwner 
                ? localize("MarketplaceYourItem")
                : balance < price 
                  ? localize("MarketplaceInsufficientFunds") 
                  : localize("MarketplaceBuy")}
          </Button>
        )}
      </div>
    </div>
  );
}