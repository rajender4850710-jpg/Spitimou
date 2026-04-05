import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Search, Heart, MapPin, BedDouble, Maximize, ArrowRight, ChevronDown, Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import PropertyCard from "../components/property/PropertyCard";

const DEAL_TABS = [
  { key: "sale", label: "Buy" },
  { key: "rent", label: "Rent" },
  { key: "daily_rent", label: "Daily" },
];

const TYPE_OPTIONS = ["Any Type", "Studio", "Apartment", "Penthouse", "Villa", "Maisonette", "Townhouse", "Plots & Land", "Commercial"];

const QUICK_LINKS = [
  {
    label: "New Builds",
    count: "517",
    icon: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=200&q=80",
    type: "apartment",
    deal: "sale",
  },
  {
    label: "Buy",
    count: "69,547",
    icon: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=200&q=80",
    type: "all",
    deal: "sale",
  },
  {
    label: "Rent",
    count: "9,351",
    icon: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=200&q=80",
    type: "apartment",
    deal: "rent",
  },
  {
    label: "Houses",
    count: "12,400",
    icon: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=200&q=80",
    type: "house",
    deal: "sale",
  },
  {
    label: "Commercial",
    count: "8,200",
    icon: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=200&q=80",
    type: "commercial",
    deal: "rent",
  },
  {
    label: "Penthouses",
    count: "340",
    icon: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=200&q=80",
    type: "penthouse",
    deal: "sale",
  },
  {
    label: "Empty Plots",
    count: "1,280",
    icon: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=200&q=80",
    type: "land",
    deal: "sale",
  },
];

export default function Home() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [dealTab, setDealTab] = useState("sale");
  const [propertyType, setPropertyType] = useState("Any Type");
  const [rooms, setRooms] = useState("Any Rooms");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [query, setQuery] = useState("");

  const { data: allProperties = [] } = useQuery({
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

  const handleSearch = () => {
    const params = new URLSearchParams();
    params.set("deal_type", dealTab);
    if (propertyType !== "Any Type") params.set("type", propertyType.toLowerCase());
    if (rooms !== "Any Rooms") params.set("rooms", rooms);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (query) params.set("query", query);
    navigate(`/Search?${params.toString()}`);
  };

  const forSale = allProperties.filter(p => p.deal_type === "sale").slice(0, 4);
  const forRent = allProperties.filter(p => p.deal_type === "rent").slice(0, 4);

  const totalCount = {
    sale: allProperties.filter(p => p.deal_type === "sale").length,
    rent: allProperties.filter(p => p.deal_type === "rent").length,
    daily_rent: allProperties.filter(p => p.deal_type === "daily_rent").length,
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Hero search block */}
      <section className="max-w-4xl mx-auto px-4 pt-14 pb-10 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-8">
          Real Estate in Cyprus
        </h1>
        <p className="text-base text-slate-500 -mt-4 mb-8">From Cyprus to the world</p>

        {/* Deal type tabs */}
        <div className="inline-flex bg-slate-100 rounded-xl p-1 mb-5">
          {DEAL_TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setDealTab(tab.key)}
              className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
                dealTab === tab.key
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search bar */}
        <div className="flex flex-col sm:flex-row items-stretch gap-0 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          {/* Type */}
          <div className="relative border-r border-slate-200">
            <select
              value={propertyType}
              onChange={e => setPropertyType(e.target.value)}
              className="h-14 pl-4 pr-8 text-sm font-medium text-slate-700 bg-transparent appearance-none outline-none cursor-pointer w-full sm:w-40"
            >
              {TYPE_OPTIONS.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>

          {/* Rooms */}
          <div className="relative border-r border-slate-200">
            <select
              value={rooms}
              onChange={e => setRooms(e.target.value)}
              className="h-14 pl-4 pr-8 text-sm font-medium text-slate-700 bg-transparent appearance-none outline-none cursor-pointer w-full sm:w-36"
            >
              {["Any Rooms", "1", "2", "3", "4", "5", "6+"].map(r => (
                <option key={r} value={r}>{r === "Any Rooms" ? r : `${r} ${r === "1" ? "Room" : "Rooms"}`}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>

          {/* Price Range */}
          <div className="relative border-r border-slate-200 flex items-center gap-1 px-3">
            <span className="text-slate-400 text-xs whitespace-nowrap">€</span>
            <input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={e => setMinPrice(e.target.value)}
              className="h-14 w-20 text-sm text-slate-700 bg-transparent outline-none"
            />
            <span className="text-slate-300 text-sm">—</span>
            <input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={e => setMaxPrice(e.target.value)}
              className="h-14 w-20 text-sm text-slate-700 bg-transparent outline-none"
            />
          </div>

          {/* Location search */}
          <div className="flex-1 flex items-center border-r border-slate-200">
            <Search className="ml-4 w-4 h-4 text-slate-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="District, street, address..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSearch()}
              className="h-14 flex-1 px-3 text-sm text-slate-700 bg-transparent outline-none"
            />
          </div>

          {/* Map button */}
          <a
            href={`https://www.google.com/maps/search/real+estate+cyprus`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-2 px-4 text-sm text-slate-500 hover:text-slate-700 border-r border-slate-200 whitespace-nowrap"
          >
            <Map className="w-4 h-4" /> On map
          </a>

          {/* CTA */}
          <button
            onClick={handleSearch}
            className="h-14 px-6 bg-red-500 hover:bg-red-600 text-white font-semibold text-sm transition-colors whitespace-nowrap sm:rounded-r-2xl"
          >
            Show {totalCount[dealTab] > 0 ? totalCount[dealTab] : ""} listings
          </button>
        </div>
      </section>

      {/* Quick links */}
      <section className="max-w-5xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {QUICK_LINKS.map(link => (
            <Link
              key={link.label}
              to={`/Search?deal_type=${link.deal}&type=${link.type}`}
              className="group flex flex-col items-center gap-2"
            >
              <div className="w-full aspect-square rounded-2xl overflow-hidden bg-slate-100">
                <img
                  src={link.icon}
                  alt={link.label}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-slate-800 group-hover:text-red-500 transition-colors leading-tight">{link.label}</p>
                <p className="text-xs text-slate-400">{link.count}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <div className="border-t border-slate-100" />

      {/* For Sale listings */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            For Sale
            <span className="text-base font-normal text-slate-400">{forSale.length}</span>
            <ArrowRight className="w-4 h-4 text-slate-400" />
          </h2>
          <Link to="/Search?deal_type=sale" className="text-sm text-red-500 hover:text-red-600 font-medium">
            View all
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {forSale.map(p => (
            <PropertyCard
              key={p.id}
              property={p}
              isFavorited={favIds.has(p.id)}
              onToggleFavorite={toggleFavorite}
            />
          ))}
          {forSale.length === 0 && (
            <p className="text-slate-400 text-sm col-span-4 py-8 text-center">No listings yet</p>
          )}
        </div>
      </section>

      <div className="border-t border-slate-100" />

      {/* For Rent listings */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            For Rent
            <span className="text-base font-normal text-slate-400">{forRent.length}</span>
            <ArrowRight className="w-4 h-4 text-slate-400" />
          </h2>
          <Link to="/Search?deal_type=rent" className="text-sm text-red-500 hover:text-red-600 font-medium">
            View all
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {forRent.map(p => (
            <PropertyCard
              key={p.id}
              property={p}
              isFavorited={favIds.has(p.id)}
              onToggleFavorite={toggleFavorite}
            />
          ))}
          {forRent.length === 0 && (
            <p className="text-slate-400 text-sm col-span-4 py-8 text-center">No listings yet</p>
          )}
        </div>
      </section>

      <div className="border-t border-slate-100" />

      {/* Services promo strip */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-xl font-bold text-slate-900 mb-5">Services</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              title: "Mortgage Calculator",
              desc: "Calculate monthly payments and find the best rates",
              link: "/Calculator",
              bg: "bg-amber-50",
              accent: "text-amber-600",
            },
            {
              title: "Compare Properties",
              desc: "Side-by-side comparison of up to 4 properties",
              link: "/Compare",
              bg: "bg-blue-50",
              accent: "text-blue-600",
            },
            {
              title: "List Your Property",
              desc: "Reach thousands of buyers and renters today",
              link: "/AddProperty",
              bg: "bg-emerald-50",
              accent: "text-emerald-600",
            },
            {
              title: "AI Price Valuation",
              desc: "Get an instant AI-powered market value estimate for your property",
              link: "/Valuation",
              bg: "bg-violet-50",
              accent: "text-violet-600",
            },
          ].map(s => (
            <Link
              key={s.title}
              to={s.link}
              className={`${s.bg} rounded-2xl p-6 hover:opacity-80 transition group`}
            >
              <h3 className={`font-bold text-lg ${s.accent} mb-1`}>{s.title}</h3>
              <p className="text-sm text-slate-600">{s.desc}</p>
              <span className={`text-xs font-semibold ${s.accent} mt-3 inline-block group-hover:underline`}>
                Learn more →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-8 mt-4">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">

          <p className="text-xs text-slate-400">© 2026 Amrit tech Ltd. All rights reserved.</p>
          <div className="flex gap-4 text-xs text-slate-400">



          </div>
        </div>
      </footer>
    </div>
  );
}