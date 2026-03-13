import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Search, SlidersHorizontal, X, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SearchFilters({ filters, onFiltersChange, onSearch }) {
  const [expanded, setExpanded] = useState(false);

  const update = (key, value) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search by address, district, or keyword..."
              className="pl-10 h-12 rounded-xl border-slate-200 bg-slate-50 focus:bg-white"
              value={filters.query || ""}
              onChange={(e) => update("query", e.target.value)}
            />
          </div>
          <Select value={filters.deal_type || "all"} onValueChange={(v) => update("deal_type", v)}>
            <SelectTrigger className="w-full sm:w-40 h-12 rounded-xl border-slate-200">
              <SelectValue placeholder="Deal Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="sale">Buy</SelectItem>
              <SelectItem value="rent">Rent</SelectItem>
              <SelectItem value="daily_rent">Daily Rent</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filters.type || "all"} onValueChange={(v) => update("type", v)}>
            <SelectTrigger className="w-full sm:w-40 h-12 rounded-xl border-slate-200">
              <SelectValue placeholder="Property" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Properties</SelectItem>
              <SelectItem value="apartment">Apartment</SelectItem>
              <SelectItem value="house">House</SelectItem>
              <SelectItem value="studio">Studio</SelectItem>
              <SelectItem value="penthouse">Penthouse</SelectItem>
              <SelectItem value="townhouse">Townhouse</SelectItem>
              <SelectItem value="commercial">Commercial</SelectItem>
            </SelectContent>
          </Select>
          <Select value={String(filters.rooms || "all")} onValueChange={(v) => update("rooms", v === "all" ? null : Number(v))}>
            <SelectTrigger className="w-full sm:w-36 h-12 rounded-xl border-slate-200">
              <SelectValue placeholder="Rooms" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any Rooms</SelectItem>
              <SelectItem value="1">1 Room</SelectItem>
              <SelectItem value="2">2 Rooms</SelectItem>
              <SelectItem value="3">3 Rooms</SelectItem>
              <SelectItem value="4">4 Rooms</SelectItem>
              <SelectItem value="5">5+ Rooms</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={onSearch} className="h-12 px-8 rounded-xl bg-slate-900 hover:bg-slate-800 gap-2">
            <Search className="w-4 h-4" /> Search
          </Button>
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-4 flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-700 transition"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Advanced Filters
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 sm:px-6 pb-6 border-t border-slate-100 pt-4 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <Label className="text-xs font-medium text-slate-500 mb-2 block">Rooms</Label>
                  <div className="flex gap-1.5">
                    {["all", 1, 2, 3, 4, "5+"].map((r) => (
                      <button
                        key={r}
                        onClick={() => update("rooms", r)}
                        className={`flex-1 h-10 rounded-lg text-sm font-medium transition ${
                          filters.rooms === r || (!filters.rooms && r === "all")
                            ? "bg-slate-900 text-white"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {r === "all" ? "Any" : r}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-xs font-medium text-slate-500 mb-2 block">Min Price</Label>
                  <Input
                    type="number"
                    placeholder="From"
                    className="h-10 rounded-lg"
                    value={filters.minPrice || ""}
                    onChange={(e) => update("minPrice", e.target.value)}
                  />
                </div>
                <div>
                  <Label className="text-xs font-medium text-slate-500 mb-2 block">Max Price</Label>
                  <Input
                    type="number"
                    placeholder="To"
                    className="h-10 rounded-lg"
                    value={filters.maxPrice || ""}
                    onChange={(e) => update("maxPrice", e.target.value)}
                  />
                </div>
                <div>
                  <Label className="text-xs font-medium text-slate-500 mb-2 block">Area (m²)</Label>
                  <div className="flex gap-2">
                    <Input type="number" placeholder="From" className="h-10 rounded-lg" value={filters.minArea || ""} onChange={(e) => update("minArea", e.target.value)} />
                    <Input type="number" placeholder="To" className="h-10 rounded-lg" value={filters.maxArea || ""} onChange={(e) => update("maxArea", e.target.value)} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Select value={filters.building_type || "all"} onValueChange={(v) => update("building_type", v)}>
                  <SelectTrigger className="h-10 rounded-lg">
                    <SelectValue placeholder="Building Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any Building</SelectItem>
                    <SelectItem value="brick">Brick</SelectItem>
                    <SelectItem value="panel">Panel</SelectItem>
                    <SelectItem value="monolith">Monolith</SelectItem>
                    <SelectItem value="wood">Wood</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filters.renovation || "all"} onValueChange={(v) => update("renovation", v)}>
                  <SelectTrigger className="h-10 rounded-lg">
                    <SelectValue placeholder="Renovation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any Renovation</SelectItem>
                    <SelectItem value="designer">Designer</SelectItem>
                    <SelectItem value="euro">Euro</SelectItem>
                    <SelectItem value="cosmetic">Cosmetic</SelectItem>
                    <SelectItem value="needs_renovation">Needs Renovation</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filters.sort || "newest"} onValueChange={(v) => update("sort", v)}>
                  <SelectTrigger className="h-10 rounded-lg">
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="price_asc">Price: Low to High</SelectItem>
                    <SelectItem value="price_desc">Price: High to Low</SelectItem>
                    <SelectItem value="area_desc">Largest First</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Switch id="parking" checked={filters.parking || false} onCheckedChange={(v) => update("parking", v)} />
                    <Label htmlFor="parking" className="text-sm">Parking</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch id="balcony" checked={filters.balcony || false} onCheckedChange={(v) => update("balcony", v)} />
                    <Label htmlFor="balcony" className="text-sm">Balcony</Label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button variant="ghost" onClick={() => onFiltersChange({})} className="text-sm text-slate-500 gap-1.5">
                  <X className="w-3.5 h-3.5" /> Clear All
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}