/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Ian Lucas. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { useState } from "react";
import { useLocalize } from "~/hooks/use-localize";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTag } from "@fortawesome/free-solid-svg-icons";
import SellItemModal from "~/components/marketplace/sell-item-modal";

interface InventoryItem {
  uid: number;
  name: string;
  type: string;
  rarity?: string;
  image?: string;
}

interface InventoryItemActionsProps {
  item: InventoryItem;
  onItemUpdated: () => void;
  isMarketplaceEnabled: boolean;
}

export default function InventoryItemActions({
  item,
  onItemUpdated,
  isMarketplaceEnabled
}: InventoryItemActionsProps) {
  const localize = useLocalize();
  const [showSellModal, setShowSellModal] = useState(false);

  if (!isMarketplaceEnabled) {
    return null;
  }

  return (
    <>
      <button
        onClick={() => setShowSellModal(true)}
        className="flex items-center rounded-md border border-gray-300 bg-white px-3 py-1 text-sm hover:bg-gray-50"
      >
        <FontAwesomeIcon icon={faTag} className="mr-1" />
        {localize("MarketplaceSellItem")}
      </button>

      {showSellModal && (
        <SellItemModal
          item={item}
          onClose={() => setShowSellModal(false)}
          onItemListed={onItemUpdated}
        />
      )}
    </>
  );
}