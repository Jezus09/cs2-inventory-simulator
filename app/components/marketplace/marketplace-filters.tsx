/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Ian Lucas. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { useCallback, useState } from "react";
import { useLocalize } from "~/hooks/use-localize";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faFilter, faXmark } from "@fortawesome/free-solid-svg-icons";
import { debounce } from "~/utils/debounce";

interface FiltersState {
  search: string;
  minPrice?: number;
  maxPrice?: number;
  type?: string;
  rarity?: string;
}

interface MarketplaceFiltersProps {
  filters: FiltersState;
  onFilterChange: (filters: Partial<FiltersState>) => void;
}

export default function MarketplaceFilters({ filters, onFilterChange }: MarketplaceFiltersProps) {
  const localize = useLocalize();
  const [searchValue, setSearchValue] = useState(filters.search);
  const [showFilters, setShowFilters] = useState(false);
  
  // Debounced search update
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      onFilterChange({ search: value });
    }, 500),
    [onFilterChange]
  );
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    debouncedSearch(value);
  };
  
  const handleFilterToggle = () => {
    setShowFilters(!showFilters);
  };
  
  const handleApplyFilters = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const minPrice = formData.get("minPrice") ? parseFloat(formData.get("minPrice") as string) : undefined;
    const maxPrice = formData.get("maxPrice") ? parseFloat(formData.get("maxPrice") as string) : undefined;
    const type = formData.get("type") as string || undefined;
    const rarity = formData.get("rarity") as string || undefined;
    
    onFilterChange({
      minPrice,
      maxPrice,
      type: type === "all" ? undefined : type,
      rarity: rarity === "all" ? undefined : rarity
    });
  };
  
  const clearFilters = () => {
    onFilterChange({
      search: "",
      minPrice: undefined,
      maxPrice: undefined,
      type: undefined,
      rarity: undefined
    });
    setSearchValue("");
  };
  
  const hasActiveFilters = filters.search || filters.minPrice || filters.maxPrice || filters.type || filters.rarity;
  
  return (
    <div className="mb-6">
      <div className="flex flex-wrap items-center gap-3">
        {/* Search input */}
        <div className="relative flex-1">
          <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchValue}
            onChange={handleSearchChange}
            placeholder={localize("MarketplaceSearch")}
            className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 focus:border-blue-500 focus:outline-none"
          />
        </div>
        
        {/* Filter toggle button */}
        <button
          type="button"
          onClick={handleFilterToggle}
          className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 transition hover:bg-gray-50"
        >
          <FontAwesomeIcon icon={faFilter} />
          <span>{localize("MarketplaceFilters")}</span>
        </button>
        
        {/* Clear filters button - only show if filters are active */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-red-500 transition hover:bg-gray-50"
          >
            <FontAwesomeIcon icon={faXmark} />
            <span>{localize("MarketplaceClearFilters")}</span>
          </button>
        )}
      </div>
      
      {/* Extended filter panel */}
      {showFilters && (
        <form onSubmit={handleApplyFilters} className="mt-4 rounded-md border border-gray-300 bg-white p-4 shadow-sm">
          <div className="grid gap-4 md:grid-cols-4">
            {/* Price range */}
            <div>
              <label className="mb-2 block text-sm font-medium">{localize("MarketplaceMinPrice")}</label>
              <input
                type="number"
                name="minPrice"
                min="0"
                step="0.01"
                defaultValue={filters.minPrice}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
              />
            </div>
            
            <div>
              <label className="mb-2 block text-sm font-medium">{localize("MarketplaceMaxPrice")}</label>
              <input
                type="number"
                name="maxPrice"
                min="0"
                step="0.01"
                defaultValue={filters.maxPrice}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
              />
            </div>
            
            {/* Item type filter */}
            <div>
              <label className="mb-2 block text-sm font-medium">{localize("MarketplaceType")}</label>
              <select
                name="type"
                defaultValue={filters.type || "all"}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
              >
                <option value="all">All</option>
                <option value="weapon">Weapon</option>
                <option value="knife">Knife</option>
                <option value="glove">Glove</option>
                <option value="sticker">Sticker</option>
                <option value="agent">Agent</option>
              </select>
            </div>
            
            {/* Rarity filter */}
            <div>
              <label className="mb-2 block text-sm font-medium">{localize("MarketplaceRarity")}</label>
              <select
                name="rarity"
                defaultValue={filters.rarity || "all"}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
              >
                <option value="all">All</option>
                <option value="consumer">Consumer</option>
                <option value="industrial">Industrial</option>
                <option value="milspec">Mil-Spec</option>
                <option value="restricted">Restricted</option>
                <option value="classified">Classified</option>
                <option value="covert">Covert</option>
              </select>
            </div>
          </div>
          
          <div className="mt-4 flex justify-end">
            <button
              type="submit"
              className="rounded-md bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600"
            >
              {localize("MarketplaceApplyFilters")}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}