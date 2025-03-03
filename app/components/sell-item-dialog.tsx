/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Ian Lucas. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { useState } from "react";
import { useLocalize } from "./app-context";
import { Button } from "./button";
import { faClose, faTag } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSubmit } from "@remix-run/react";
import { playSound } from "~/utils/sound";

interface SellItemDialogProps {
  itemUid: number;
  itemName: string;
  onClose: () => void;
  onSuccess?: () => void;
}

export function SellItemDialog({ itemUid, itemName, onClose, onSuccess }: SellItemDialogProps) {
  const localize = useLocalize();
  const submit = useSubmit();
  const [price, setPrice] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (isSubmitting) return;
    
    const priceValue = parseFloat(price);
    if (isNaN(priceValue) || priceValue <= 0) {
      setError(localize("MarketplaceInvalidPrice"));
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const response = await fetch("/api/marketplace/sell", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          itemUid,
          price: priceValue,
          description
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || localize("MarketplaceListingFailed"));
      }
      
      playSound("inventory_item_pickup");
      onSuccess?.();
      onClose();
      
    } catch (err: any) {
      setError(err.message || localize("MarketplaceListingFailed"));
      playSound("inventory_item_close");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/70">
      <div className="mx-2 w-full max-w-md rounded bg-stone-900 p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">
            <FontAwesomeIcon icon={faTag} className="mr-2" />
            {localize("MarketplaceSellItem")}
          </h2>
          <Button
            className="text-gray-400 hover:text-white"
            onClick={onClose}
            disabled={isSubmitting}
          >
            <FontAwesomeIcon icon={faClose} />
          </Button>
        </div>
        
        <div className="mt-4">
          <p className="text-sm text-gray-300">{localize("MarketplaceItemToSell")}: <span className="font-semibold text-white">{itemName}</span></p>
        </div>
        
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-gray-200">
              {localize("MarketplacePrice")}
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center px-3 text-gray-300">$</span>
              <input
                type="number"
                step="0.01"
                min="0.01"
                className="w-full rounded border border-gray-700 bg-stone-800 p-2 pl-8 text-white"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-gray-200">
              {localize("MarketplaceDescription")} ({localize("MarketplaceOptional")})
            </label>
            <textarea
              className="w-full rounded border border-gray-700 bg-stone-800 p-2 text-white"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              disabled={isSubmitting}
            />
          </div>
          
          {error && (
            <div className="mb-4 rounded border border-red-500 bg-red-500/10 p-2 text-sm text-red-500">
              {error}
            </div>
          )}
          
          <div className="mt-6 flex justify-end gap-2">
            <Button
              type="button"
              className="border border-gray-600 bg-transparent text-white hover:bg-gray-800"
              onClick={onClose}
              disabled={isSubmitting}
            >
              {localize("Cancel")}
            </Button>
            <Button
              type="submit"
              className="border border-blue-600 bg-blue-600 text-white hover:bg-blue-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? localize("MarketplaceListingInProgress") : localize("MarketplaceListItem")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}