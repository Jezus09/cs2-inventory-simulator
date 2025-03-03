// Add this to the imports at the top of inventory-item.tsx
import { InventoryItemSell } from "./inventory-item-sell";

// Add this to the props interface
onSell?: (uid: number) => void;

// Add this to the component's JSX, typically in the context menu where other action buttons are located
{/* Add this where appropriate in the component */}
{rules.inventoryItemAllowSell && (
  <InventoryItemSell
    uid={uid}
    name={item.getName()}
    onAfterSale={() => onSell?.(uid)}
  />
)}