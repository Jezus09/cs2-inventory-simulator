/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Ian Lucas. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { json, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { useLoaderData, useNavigation } from "@remix-run/react";
import { useCallback, useEffect, useState } from "react";
import { withLoaderSession } from "~/sessions.server";
import { findRequestUser } from "~/auth.server";
import { getRule } from "~/models/rule.server";
import { getUserBalance, getMarketplaceItems } from "~/models/marketplace.server";
import { useToastDispatch } from "~/contexts/toast";
import { message } from "~/components/app-message";
import MarketplaceFilters from "~/components/marketplace/marketplace-filters";
import MarketplaceItemList from "~/components/marketplace/marketplace-item-list";
import MarketplaceBalance from "~/components/marketplace/marketplace-balance";
import { middleware } from "~/http.server";

export const meta: MetaFunction = () => {
  return [{ title: "CS2 Inventory Simulator | Marketplace" }];
};

export async function loader({ request }: LoaderFunctionArgs) {
  await middleware(request);
  
  const user = await findRequestUser(request);
  if (!user) {
    throw new Response("Unauthorized", { status: 401 });
  }

  // Check if marketplace is enabled
  const marketplaceEnabled = await getRule("marketplaceEnabled");
  if (marketplaceEnabled !== "true") {
    throw new Response("Marketplace is currently disabled", { status: 403 });
  }

  // Get user balance
  const balance = await getUserBalance(user.id);
  
  // Get initial marketplace items
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "1");
  const items = await getMarketplaceItems({ page });

  return json({
    user,
    balance,
    initialItems: items
  });
}

export default function Marketplace() {
  const { user, balance: initialBalance, initialItems } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const [balance, setBalance] = useState(initialBalance);
  const [items, setItems] = useState(initialItems.items);
  const [pagination, setPagination] = useState(initialItems.pagination);
  const [filters, setFilters] = useState({
    page: 1,
    search: "",
    minPrice: undefined as number | undefined,
    maxPrice: undefined as number | undefined,
    type: undefined as string | undefined,
    rarity: undefined as string | undefined
  });
  const toast = useToastDispatch();
  
  const fetchItems = useCallback(async () => {
    const params = new URLSearchParams();
    params.append("page", String(filters.page));
    
    if (filters.search) params.append("search", filters.search);
    if (filters.minPrice !== undefined) params.append("minPrice", String(filters.minPrice));
    if (filters.maxPrice !== undefined) params.append("maxPrice", String(filters.maxPrice));
    if (filters.type) params.append("type", filters.type);
    if (filters.rarity) params.append("rarity", filters.rarity);
    
    try {
      const response = await fetch(`/api/marketplace?${params.toString()}`);
      const data = await response.json();
      setItems(data.items);
      setPagination(data.pagination);
    } catch (error) {
      toast(message("Error fetching marketplace items", "error"));
    }
  }, [filters, toast]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handleBalanceUpdate = (newBalance: number) => {
    setBalance(newBalance);
  };

  const isLoading = navigation.state === "loading";

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6 flex flex-wrap items-center justify-between">
        <h1 className="text-3xl font-bold">Marketplace</h1>
        <MarketplaceBalance balance={balance} onBalanceUpdate={handleBalanceUpdate} />
      </div>
      
      <MarketplaceFilters filters={filters} onFilterChange={handleFilterChange} />
      
      <MarketplaceItemList 
        items={items}
        currentUser={user}
        isLoading={isLoading}
        userBalance={balance}
        onItemPurchased={fetchItems}
        onItemCancelled={fetchItems}
        onBalanceUpdate={handleBalanceUpdate}
        pagination={pagination}
        onPageChange={handlePageChange}
      />
    </div>
  );
}