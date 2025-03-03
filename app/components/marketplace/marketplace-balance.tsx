/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Ian Lucas. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { useState } from "react";
import { useLocalize } from "~/hooks/use-localize";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWallet, faPlus, faTimes, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { useToastDispatch } from "~/contexts/toast";
import { message } from "~/components/app-message";

interface MarketplaceBalanceProps {
  balance: number;
  onBalanceUpdate: (balance: number) => void;
}

export default function MarketplaceBalance({ balance, onBalanceUpdate }: MarketplaceBalanceProps) {
  const localize = useLocalize();
  const toast = useToastDispatch();
  const [showAddFundsModal, setShowAddFundsModal] = useState(false);
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAddFunds = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      toast(message("Please enter a valid amount", "error"));
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/marketplace/balance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ amount: amountValue })
      });

      const data = await response.json();
      
      if (data.error) {
        toast(message(data.error, "error"));
        return;
      }

      onBalanceUpdate(data.balance);
      toast(message(localize("MarketplaceFundsAdded"), "success"));
      setShowAddFundsModal(false);
      setAmount("");
    } catch (error) {
      toast(message("Error adding funds", "error"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center">
        <div className="mr-3 rounded-md border border-gray-300 bg-white px-4 py-2">
          <div className="flex items-center">
            <FontAwesomeIcon icon={faWallet} className="mr-2 text-green-500" />
            <span className="font-medium">
              {localize("MarketplaceBalance")}: ${balance.toFixed(2)}
            </span>
          </div>
        </div>
        <button
          onClick={() => setShowAddFundsModal(true)}
          className="flex items-center rounded-md bg-green-500 px-4 py-2 text-white transition hover:bg-green-600"
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          {localize("MarketplaceAddFunds")}
        </button>
      </div>

      {/* Add Funds Modal */}
      {showAddFundsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-medium">{localize("MarketplaceAddFunds")}</h3>
              <button
                onClick={() => setShowAddFundsModal(false)}
                className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <form onSubmit={handleAddFunds}>
              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium">
                  {localize("MarketplaceAddAmount")}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min="0.01"
                    step="0.01"
                    placeholder="0.00"
                    className="w-full rounded-md border border-gray-300 py-2 pl-8 pr-4 focus:border-blue-500 focus:outline-none"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowAddFundsModal(false)}
                  className="mr-2 rounded-md border border-gray-300 bg-white px-4 py-2 transition hover:bg-gray-50"
                >
                  {localize("MarketplaceCancel")}
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center rounded-md bg-green-500 px-4 py-2 text-white transition hover:bg-green-600"
                >
                  {isLoading && <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />}
                  {localize("MarketplaceAddToBalance")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}