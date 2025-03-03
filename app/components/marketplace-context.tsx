/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Ian Lucas. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { createContext, useContext, useState, ReactNode } from "react";

interface MarketplaceContextType {
  balance: number;
  setBalance: (balance: number) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  filters: {
    type: string | null;
    minPrice: number | null;
    maxPrice: number | null;
    rarity: string | null;
    search: string | null;
  };
  setFilters: (filters: {
    type?: string | null;
    minPrice?: number | null;
    maxPrice?: number | null;
    rarity?: string | null;
    search?: string | null;
  }) => void;
}

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

export function MarketplaceProvider({ children, initialBalance = 0 }: { children: ReactNode, initialBalance?: number }) {
  const [balance, setBalance] = useState(initialBalance);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFiltersState] = useState({
    type: null as string | null,
    minPrice: null as number | null,
    maxPrice: null as number | null,
    rarity: null as string | null,
    search: null as string | null
  });

  const setFilters = (newFilters: {
    type?: string | null;
    minPrice?: number | null;
    maxPrice?: number | null;
    rarity?: string | null;
    search?: string | null;
  }) => {
    setFiltersState(prevFilters => ({
      ...prevFilters,
      ...newFilters
    }));
  };

  return (
    <MarketplaceContext.Provider
      value={{
        balance,
        setBalance,
        isLoading,
        setIsLoading,
        filters,
        setFilters
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  );
}

export function useMarketplace() {
  const context = useContext(MarketplaceContext);
  if (context === undefined) {
    throw new Error("useMarketplace must be used within a MarketplaceProvider");
  }
  return context;
}