import React from "react";
import { Link } from "react-router-dom";
import { Heart, MapPin, Maximize, BedDouble, Building2, Star, GitCompare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useCompare } from "@/lib/CompareContext";

const typeLabels = {
  apartment: "Apartment", house: "House", studio: "Studio",
  penthouse: "Penthouse", townhouse: "Townhouse", commercial: "Commercial"
};
const dealLabels = { sale: "For Sale", rent: "For Rent", daily_rent: "Daily Rent" };
const dealColors = { sale: "bg-emerald-500", rent: "bg-blue-500", daily_rent: "bg-amber-500" };

export default function PropertyCard({ property, isFavorited, onToggleFavorite, compact = false }) {
  const formatPrice = (price, dealType) => {
    if (dealType === "rent" || dealType === "daily_rent") {
      return `€${price.toLocaleString()}/mo`;
    }
    return `€${price.toLocaleString()}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group bg-white rounded-2xl overflow-hidden border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500"
    >
      <div className="relative">
        <Link to={`/Property?id=${property.id}`}>
          <div className="aspect-[16/10] overflow-hidden">
            <img
              src={property.images?.[0] || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800"}
              alt={property.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
          </div>
        </Link>
        <div className="absolute top-3 left-3 flex gap-2">
          <span className={`${dealColors[property.deal_type]} text-white text-xs font-semibold px-3 py-1 rounded-full`}>
            {dealLabels[property.deal_type]}
          </span>
          {property.is_featured && (
            <span className="bg-amber-400 text-amber-900 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
              <Star className="w-3 h-3" /> Featured
            </span>
          )}
        </div>
        <button
          onClick={(e) => { e.preventDefault(); onToggleFavorite?.(property.id); }}
          className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition shadow-sm"
        >
          <Heart className={`w-4 h-4 transition ${isFavorited ? "fill-rose-500 text-rose-500" : "text-slate-400"}`} />
        </button>
      </div>

      <Link to={`/Property?id=${property.id}`} className="block p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-slate-900 line-clamp-1 group-hover:text-rose-600 transition">
            {property.title}
          </h3>
        </div>
        <div className="flex items-center gap-1.5 text-slate-500 text-sm mb-3">
          <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="truncate">{property.address}, {property.district}</span>
        </div>
        <div className="flex items-center gap-4 text-sm text-slate-600 mb-4">
          <span className="flex items-center gap-1.5">
            <BedDouble className="w-4 h-4 text-slate-400" />
            {property.rooms} {property.rooms === 1 ? "room" : "rooms"}
          </span>
          <span className="flex items-center gap-1.5">
            <Maximize className="w-4 h-4 text-slate-400" />
            {property.area} m²
          </span>
          <span className="flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-slate-400" />
            Floor {property.floor}/{property.total_floors}
          </span>
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <span className="text-xl font-bold text-slate-900">
            {formatPrice(property.price, property.deal_type)}
          </span>
          {property.price_per_sqm > 0 && property.deal_type === "sale" && (
            <span className="text-sm text-slate-400">${property.price_per_sqm.toLocaleString()}/m²</span>
          )}
        </div>
      </Link>
    </motion.div>
  );
}