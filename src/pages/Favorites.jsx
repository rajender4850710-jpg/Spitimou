import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Heart } from "lucide-react";
import PropertyCard from "../components/property/PropertyCard";

export default function Favorites() {
  const queryClient = useQueryClient();

  const { data: favorites = [] } = useQuery({
    queryKey: ["favorites"],
    queryFn: () => base44.entities.Favorite.list(),
  });

  const { data: allProperties = [] } = useQuery({
    queryKey: ["all-properties"],
    queryFn: () => base44.entities.Property.filter({ status: "active" }),
  });

  const favIds = new Set(favorites.map(f => f.property_id));
  const favProperties = allProperties.filter(p => favIds.has(p.id));

  const toggleFavorite = async (propertyId) => {
    const existing = favorites.find(f => f.property_id === propertyId);
    if (existing) {
      await base44.entities.Favorite.delete(existing.id);
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-1">Saved Properties</h1>
      <p className="text-slate-500 mb-8">{favProperties.length} properties saved</p>

      {favProperties.length === 0 ? (
        <div className="text-center py-20">
          <Heart className="w-16 h-16 text-slate-200 mx-auto mb-4" />
          <p className="text-lg text-slate-400">No saved properties yet</p>
          <p className="text-sm text-slate-400 mt-1">Click the heart icon on any property to save it</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favProperties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              isFavorited={true}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      )}
    </div>
  );
}