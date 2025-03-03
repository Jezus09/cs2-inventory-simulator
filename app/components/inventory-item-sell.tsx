/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Ian Lucas. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { useState } from "react";
import { useLocalize } from "./app-context";
import { SellItemDialog } from "./sell-item-dialog";

interface InventoryItemSellProps {
  uid: number;
  name: string;
  onAfterSale?: () => void;
}

export function InventoryItemSell({ uid, name, onAfterSale }: InventoryItemSellProps) {
  const localize = useLocalize();
  const [showSellDialog, setShowSellDialog] = useState(false);
  
  return (
    <>
      <button
        className="w-full bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 py-1 px-2 text-sm"
        onClick={() => setShowSellDialog(true)}
      >
        {localize("MarketplaceSellItem")}
      </button>
      
      {showSellDialog && (
        <SellItemDialog
          itemUid={uid}
          itemName={name}
          onClose={() => setShowSellDialog(false)}
          onSuccess={onAfterSale}
        />
      )}
    </>
  );
}