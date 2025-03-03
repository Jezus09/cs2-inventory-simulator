// Update to inventory-item.tsx to check the sell rule
import { useRules } from "./app-context"; // Assuming you have a useRules hook

// Inside your component
const rules = useRules();
const canSell = rules.inventoryItemAllowSell === "true";

// In the component's JSX where you want to add the sell button
{canSell && (
  <InventoryItemSell
    uid={uid}
    name={item.getName()}
    onAfterSale={() => onSell?.(uid)}
  />
)}