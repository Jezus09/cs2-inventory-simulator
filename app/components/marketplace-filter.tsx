/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Ian Lucas. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useLocalize } from "./app-context";
import { useMarketplace } from "./marketplace-context";
import { useState } from "react";
import { Button } from "./button";

export function MarketplaceFilter() {
  const localize = useLocalize();
  const { filters, setFilters } = useMarketplace();
  
  const [searchInput, setSearchInput] = useState(filters.search || "");
  const [minPriceInput, setMinPriceInput] = useState(filters.minPrice?.toString() || "");
  const [maxPriceInput, setMaxPriceInput] = useState(filters.maxPrice?.toString() || "");
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Item types in CS2
  const itemTypes = [
    { value: "", label: localize("MarketplaceAllTypes") },
    { value: "weapon", label: localize("MarketplaceTypeWeapon") },
    { value: "knife", label: localize("MarketplaceTypeKnife") },
    { value: "gloves", label: localize("MarketplaceTypeGloves") },
    { value: "sticker", label: localize("MarketplaceTypeSticker") },
    { value: "case", label: localize("MarketplaceTypeCase") },
    { value: "key", label: localize("MarketplaceTypeKey") },
    { value: "agent", label: localize("MarketplaceTypeAgent") },
    { value: "music", label: localize("MarketplaceTypeMusic") },
    { value: "patch", label: localize("MarketplaceTypePatch") }
  ];
  
  // Rarities in CS2
  const rarities = [
    { value: "", label: localize("MarketplaceAllRarities") },
    { value: "consumer", label: localize("MarketplaceRarityConsumer") },
    { value: "industrial", label: localize("MarketplaceRarityIndustrial") },
    { value: "mil_spec", label: localize("MarketplaceRarityMilSpec") },
    { value: "restricted", label: localize("MarketplaceRarityRestricted") },
    { value: "classified", label: localize("MarketplaceRarityClassified") },
    { value: "covert", label: localize("MarketplaceRarityCovert") },
    { value: "rare", label: localize("MarketplaceRarityRare") },
    { value: "extraordinary", label: localize("MarketplaceRarityExtraordinary") },
    { value: "contraband", label: localize("MarketplaceRarityContraband") }
  ];
  
  const handleSearch = () => {
    setFilters({
      search: searchInput || null,
      minPrice: minPriceInput ? parseFloat(minPriceInput) : null,
      maxPrice: maxPriceInput ? parseFloat(maxPriceInput) : null
    });
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };
  
  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({ type: e.target.value || null });
  };
  
  const handleRarityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({ rarity: e.target.value || null });
  };
  
  const handleClearFilters = () => {
    setSearchInput("");
    setMinPriceInput("");
    setMaxPriceInput("");
    setFilters({
      search: null,
      type: null,
      rarity: null,
      minPrice: null,
      maxPrice: null
    });
  };
  
  const hasActiveFilters = 
    !!filters.search || !!filters.type || !!filters.rarity || 
    !!filters.minPrice || !!filters.maxPrice;
  
  return (
    <div className="bg-stone-800 rounded-md border border-stone-700 p-4 mb-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium text-white flex items-center">
          <FontAwesomeIcon icon={faFilter} className="mr-2" />
          {localize("MarketplaceFilters")}
        </h3>
        
        {hasActiveFilters && (
          <Button
            className="text-xs text-gray-300 hover:text-white flex items-center"
            onClick={handleClearFilters}
          >
            <FontAwesomeIcon icon={faTimes} className="mr-1" />
            {localize("MarketplaceClearFilters")}
          </Button>
        )}
      </div>
      
      <div className="space-y-3">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                className="w-full rounded border border-stone-600 bg-stone-700 py-2 pl-9 pr-3 text-white"
                placeholder={localize("MarketplaceSearchItems")}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <FontAwesomeIcon
                icon={faSearch}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </div>
          </div>
          
          <div className="flex gap-3">
            <select
              className="rounded border border-stone-600 bg-stone-700 px-3 py-2 text-white"
              value={filters.type || ""}
              onChange={handleTypeChange}
            >
              {itemTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            
            <Button
              className="border border-blue-600 bg-blue-600 text-white hover:bg-blue-700 lg:hidden"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? localize("MarketplaceLessFilters") : localize("MarketplaceMoreFilters")}
            </Button>
          </div>
        </div>
        
        <div className={`space-y-3 ${isExpanded ? 'block' : 'hidden lg:block'}`}>
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="flex-1">
              <select
                className="w-full rounded border border-stone-600 bg-stone-700 px-3 py-2 text-white"
                value={filters.rarity || ""}
                onChange={handleRarityChange}
              >
                {rarities.map((rarity) => (
                  <option key={rarity.value} value={rarity.value}>
                    {rarity.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex gap-3 lg:w-2/5">
              <div className="flex-1">
                <input
                  type="number"
                  className="w-full rounded border border-stone-600 bg-stone-700 px-3 py-2 text-white"
                  placeholder={localize("MarketplaceMinPrice")}
                  value={minPriceInput}
                  onChange={(e) => setMinPriceInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="flex-1">
                <input
                  type="number"
                  className="w-full rounded border border-stone-600 bg-stone-700 px-3 py-2 text-white"
                  placeholder={localize("MarketplaceMaxPrice")}
                  value={maxPriceInput}
                  onChange={(e) => setMaxPriceInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button
              className="border border-blue-600 bg-blue-600 text-white hover:bg-blue-700"
              onClick={handleSearch}
            >
              {localize("MarketplaceApplyFilters")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}