import React, { useState, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { LayoutGrid, List, Map as MapIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import SearchFilters from "../components/property/SearchFilters";
import PropertyCard from "../components/property/PropertyCard";
import PropertyMap from "../components/property/PropertyMap";

export default function SearchPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const initialFilters = {};
  if (urlParams.get("deal_type")) initialFilters.deal_type = urlParams.get("deal_type");
  if (urlParams.get("type")) initialFilters.type = urlParams.get("type");

  const [filters, setFilters] = useState(initialFilters);
  const [viewMode, setViewMode] = useState("grid");
  const queryClient = useQueryClient();

  const { data: properties = [], isLoading } = useQuery({
    queryKey: ["properties"],
    queryFn: () => base44.entities.Property.filter({ status: "active" }),
  });

  const { data: favorites = [] } = useQuery({
    queryKey: ["favorites"],
    queryFn: () => base44.entities.Favorite.list(),
  });

  const favIds = new Set(favorites.map(f => f.property_id));

  const toggleFavorite = async (propertyId) => {
    const existing = favorites.find(f => f.property_id === propertyId);
    if (existing) {
      await base44.entities.Favorite.delete(existing.id);
    } else {
      await base44.entities.Favorite.create({ property_id: propertyId });
    }
    queryClient.invalidateQueries({ queryKey: ["favorites"] });
  };

  const filtered = useMemo(() => {
    let result = [...properties];

    if (filters.query) {
      const q = filters.query.toLowerCase();
      result = result.filter(p =>
        p.title?.toLowerCase().includes(q) ||
        p.address?.toLowerCase().includes(q) ||
        p.district?.toLowerCase().includes(q)
      );
    }
    if (filters.deal_type && filters.deal_type !== "all") result = result.filter(p => p.deal_type === filters.deal_type);
    if (filters.type && filters.type !== "all") result = result.filter(p => p.type === filters.type);
    if (filters.rooms && filters.rooms !== "all") {
      if (filters.rooms === "5+") result = result.filter(p => p.rooms >= 5);
      else result = result.filter(p => p.rooms === Number(filters.rooms));
    }
    if (filters.minPrice) result = result.filter(p => p.price >= Number(filters.minPrice));
    if (filters.maxPrice) result = result.filter(p => p.price <= Number(filters.maxPrice));
    if (filters.minArea) result = result.filter(p => p.area >= Number(filters.minArea));
    if (filters.maxArea) result = result.filter(p => p.area <= Number(filters.maxArea));
    if (filters.building_type && filters.building_type !== "all") result = result.filter(p => p.building_type === filters.building_type);
    if (filters.renovation && filters.renovation !== "all") result = result.filter(p => p.renovation === filters.renovation);
    if (filters.parking) result = result.filter(p => p.parking);
    if (filters.balcony) result = result.filter(p => p.balcony);

    if (filters.sort === "price_asc") result.sort((a, b) => a.price - b.price);
    else if (filters.sort === "price_desc") result.sort((a, b) => b.price - a.price);
    else if (filters.sort === "area_desc") result.sort((a, b) => b.area - a.area);

    return result;
  }, [properties, filters]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 mb-1">Find Properties</h1>
        <p className="text-slate-500">{filtered.length} properties found</p>
      </div>

      <SearchFilters filters={filters} onFiltersChange={setFilters} onSearch={() => {}} />

      <div className="flex items-center justify-between mt-6 mb-4">
        <p className="text-sm text-slate-500">{filtered.length} results</p>
        <div className="flex gap-1 bg-slate-100 rounded-xl p-1">
          {[
            { mode: "grid", icon: LayoutGrid },
            { mode: "list", icon: List },
            { mode: "map", icon: MapIcon },
          ].map(({ mode, icon: Icon }) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`p-2 rounded-lg transition ${viewMode === mode ? "bg-white shadow-sm text-slate-900" : "text-slate-400 hover:text-slate-600"}`}
            >
              <Icon className="w-4 h-4" />
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
        </div>
      ) : viewMode === "map" ? (
        <PropertyMap properties={filtered} />
      ) : (
        <div className={viewMode === "grid"
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          : "space-y-4"
        }>
          {filtered.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              isFavorited={favIds.has(property.id)}
              onToggleFavorite={toggleFavorite}
              compact={viewMode === "list"}
            />
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full text-center py-20">
              <p className="text-slate-400 text-lg">No properties match your filters</p>
              <Button variant="ghost" onClick={() => setFilters({})} className="mt-3 text-rose-600">
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}