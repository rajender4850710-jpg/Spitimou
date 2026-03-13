import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  ArrowLeft, Heart, Share2, MapPin, BedDouble, Maximize, Building2,
  Calendar, Layers, Paintbrush, Car, Fence, ArrowUpDown,
  CheckCircle, GitCompare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ImageGallery from "../components/property/ImageGallery";
import ContactForm from "../components/property/ContactForm";
import PropertyMap from "../components/property/PropertyMap";

const typeLabels = { apartment: "Apartment", house: "House", studio: "Studio", penthouse: "Penthouse", townhouse: "Townhouse", commercial: "Commercial" };
const dealLabels = { sale: "For Sale", rent: "For Rent", daily_rent: "Daily Rent" };
const renovationLabels = { cosmetic: "Cosmetic", euro: "Euro Renovation", designer: "Designer", needs_renovation: "Needs Renovation", none: "None" };
const buildingLabels = { brick: "Brick", panel: "Panel", monolith: "Monolith", wood: "Wood", block: "Block" };

export default function PropertyPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const propertyId = urlParams.get("id");
  const queryClient = useQueryClient();

  const { data: property, isLoading } = useQuery({
    queryKey: ["property", propertyId],
    queryFn: async () => {
      const list = await base44.entities.Property.filter({ id: propertyId });
      return list[0];
    },
    enabled: !!propertyId,
  });

  const { data: favorites = [] } = useQuery({
    queryKey: ["favorites"],
    queryFn: () => base44.entities.Favorite.list(),
  });

  const isFav = favorites.some(f => f.property_id === propertyId);

  const toggleFav = async () => {
    const existing = favorites.find(f => f.property_id === propertyId);
    if (existing) await base44.entities.Favorite.delete(existing.id);
    else await base44.entities.Favorite.create({ property_id: propertyId });
    queryClient.invalidateQueries({ queryKey: ["favorites"] });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-40">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="text-center py-40">
        <p className="text-slate-400 text-lg">Property not found</p>
        <Link to="/Search"><Button variant="ghost" className="mt-3">Back to Search</Button></Link>
      </div>
    );
  }

  const details = [
    { icon: BedDouble, label: "Rooms", value: property.rooms },
    { icon: Maximize, label: "Total Area", value: `${property.area} m²` },
    { icon: Maximize, label: "Living Area", value: property.living_area ? `${property.living_area} m²` : null },
    { icon: Maximize, label: "Kitchen", value: property.kitchen_area ? `${property.kitchen_area} m²` : null },
    { icon: Building2, label: "Floor", value: property.floor && property.total_floors ? `${property.floor} of ${property.total_floors}` : null },
    { icon: Calendar, label: "Built", value: property.building_year },
    { icon: Layers, label: "Building", value: buildingLabels[property.building_type] },
    { icon: Paintbrush, label: "Renovation", value: renovationLabels[property.renovation] },
  ].filter(d => d.value);

  const features = [
    property.parking && { icon: Car, label: "Parking" },
    property.balcony && { icon: Fence, label: "Balcony" },
    property.elevator && { icon: ArrowUpDown, label: "Elevator" },
  ].filter(Boolean);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <Link to="/Search" className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition">
          <ArrowLeft className="w-4 h-4" /> Back to Search
        </Link>
        <div className="flex gap-2">
          <Link to={`/Compare?add=${property.id}`}>
            <Button variant="outline" size="sm" className="rounded-xl gap-1.5">
              <GitCompare className="w-4 h-4" /> Compare
            </Button>
          </Link>
          <Button variant="outline" size="sm" className="rounded-xl gap-1.5" onClick={toggleFav}>
            <Heart className={`w-4 h-4 ${isFav ? "fill-rose-500 text-rose-500" : ""}`} />
            {isFav ? "Saved" : "Save"}
          </Button>
          <Button
            variant="outline" size="sm" className="rounded-xl gap-1.5"
            onClick={() => navigator.clipboard.writeText(window.location.href)}
          >
            <Share2 className="w-4 h-4" /> Share
          </Button>
        </div>
      </div>

      <ImageGallery images={property.images} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-2 space-y-8">
          <div>
            <div className="flex gap-2 mb-3">
              <Badge variant="secondary" className="rounded-full">{typeLabels[property.type]}</Badge>
              <Badge variant="secondary" className="rounded-full">{dealLabels[property.deal_type]}</Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">{property.title}</h1>
            <div className="flex items-center gap-1.5 text-slate-500 mb-4">
              <MapPin className="w-4 h-4" />
              <span>{property.address}, {property.district}, {property.city}</span>
            </div>
            <div className="flex items-baseline gap-4">
              <span className="text-3xl font-bold text-slate-900">
                ${property.price?.toLocaleString()}
                {(property.deal_type === "rent" || property.deal_type === "daily_rent") && <span className="text-lg text-slate-400 font-normal">/mo</span>}
              </span>
              {property.price_per_sqm > 0 && property.deal_type === "sale" && (
                <span className="text-sm text-slate-400">${property.price_per_sqm?.toLocaleString()}/m²</span>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <h2 className="font-semibold text-slate-900 mb-4">Property Details</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {details.map((d) => (
                <div key={d.label} className="bg-slate-50 rounded-xl p-4">
                  <d.icon className="w-5 h-5 text-slate-400 mb-2" />
                  <p className="text-xs text-slate-400">{d.label}</p>
                  <p className="font-semibold text-slate-900 mt-0.5">{d.value}</p>
                </div>
              ))}
            </div>
          </div>

          {features.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-100 p-6">
              <h2 className="font-semibold text-slate-900 mb-4">Features</h2>
              <div className="flex flex-wrap gap-3">
                {features.map(f => (
                  <div key={f.label} className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">{f.label}</span>
                  </div>
                ))}
                {property.amenities?.map(a => (
                  <div key={a} className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-xl">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm font-medium capitalize">{a.replace(/_/g, " ")}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {property.description && (
            <div className="bg-white rounded-2xl border border-slate-100 p-6">
              <h2 className="font-semibold text-slate-900 mb-3">Description</h2>
              <p className="text-slate-600 leading-relaxed whitespace-pre-line">{property.description}</p>
            </div>
          )}

          {property.lat && property.lng && (
            <div className="bg-white rounded-2xl border border-slate-100 p-6">
              <h2 className="font-semibold text-slate-900 mb-4">Location</h2>
              <div className="h-[350px]">
                <PropertyMap properties={[property]} />
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <ContactForm propertyId={property.id} contactName={property.contact_name} contactPhone={property.contact_phone} />
        </div>
      </div>
    </div>
  );
}