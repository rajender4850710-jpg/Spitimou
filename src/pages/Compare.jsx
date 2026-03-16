import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, GitCompare, CheckCircle, XCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useCompare } from "@/lib/CompareContext";

const buildingLabels = { brick: "Brick", panel: "Panel", monolith: "Monolith", wood: "Wood", block: "Block" };
const renovationLabels = { cosmetic: "Cosmetic", euro: "Euro", designer: "Designer", needs_renovation: "Needs Renovation" };

export default function Compare() {
  const { compareIds, toggleCompare } = useCompare();

  const { data: allProperties = [] } = useQuery({
    queryKey: ["all-properties"],
    queryFn: () => base44.entities.Property.filter({ status: "active" }),
  });

  const selectedProperties = allProperties.filter(p => compareIds.includes(p.id));

  const addProperty = (id) => {
    if (id && !compareIds.includes(id) && compareIds.length < 4) {
      toggleCompare(id);
    }
  };

  const removeProperty = (id) => toggleCompare(id);

  const rows = [
    { label: "Price", render: (p) => `$${p.price?.toLocaleString()}` },
    { label: "Price/m²", render: (p) => p.price_per_sqm ? `$${p.price_per_sqm?.toLocaleString()}` : "—" },
    { label: "Area", render: (p) => `${p.area} m²` },
    { label: "Living Area", render: (p) => p.living_area ? `${p.living_area} m²` : "—" },
    { label: "Kitchen", render: (p) => p.kitchen_area ? `${p.kitchen_area} m²` : "—" },
    { label: "Rooms", render: (p) => p.rooms },
    { label: "Floor", render: (p) => p.floor && p.total_floors ? `${p.floor}/${p.total_floors}` : "—" },
    { label: "Building Type", render: (p) => buildingLabels[p.building_type] || "—" },
    { label: "Built", render: (p) => p.building_year || "—" },
    { label: "Renovation", render: (p) => renovationLabels[p.renovation] || "—" },
    { label: "Parking", render: (p) => p.parking },
    { label: "Balcony", render: (p) => p.balcony },
    { label: "Elevator", render: (p) => p.elevator },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-gradient-to-br from-slate-900 to-slate-700 rounded-2xl flex items-center justify-center">
          <GitCompare className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Compare Properties</h1>
          <p className="text-slate-500">Compare up to 4 properties side by side</p>
        </div>
      </div>

      {/* Add selector */}
      <div className="mb-6">
        <Select onValueChange={addProperty}>
          <SelectTrigger className="w-full sm:w-80 rounded-xl h-11">
            <SelectValue placeholder="Add a property to compare..." />
          </SelectTrigger>
          <SelectContent>
            {allProperties.filter(p => !selectedIds.includes(p.id)).map(p => (
              <SelectItem key={p.id} value={p.id}>{p.title} — ${p.price?.toLocaleString()}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedProperties.length === 0 ? (
        <div className="text-center py-20">
          <GitCompare className="w-16 h-16 text-slate-200 mx-auto mb-4" />
          <p className="text-lg text-slate-400">Select properties to compare</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left p-4 w-40 bg-slate-50 rounded-tl-2xl"></th>
                {selectedProperties.map(p => (
                  <th key={p.id} className="p-4 bg-slate-50 min-w-[220px] last:rounded-tr-2xl">
                    <div className="relative">
                      <button onClick={() => removeProperty(p.id)} className="absolute -top-1 -right-1 w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center hover:bg-slate-300">
                        <X className="w-3 h-3" />
                      </button>
                      <Link to={`/Property?id=${p.id}`}>
                        <img src={p.images?.[0]} alt="" className="w-full h-32 object-cover rounded-xl mb-3" />
                        <p className="font-semibold text-slate-900 text-sm line-clamp-1 hover:text-rose-600 transition">{p.title}</p>
                      </Link>
                      <p className="text-xs text-slate-400 mt-1">{p.district}</p>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={row.label} className={i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}>
                  <td className="p-4 text-sm font-medium text-slate-500">{row.label}</td>
                  {selectedProperties.map(p => {
                    const val = row.render(p);
                    return (
                      <td key={p.id} className="p-4 text-sm font-medium text-slate-900 text-center">
                        {typeof val === "boolean" ? (
                          val ? <CheckCircle className="w-5 h-5 text-emerald-500 mx-auto" /> : <XCircle className="w-5 h-5 text-slate-300 mx-auto" />
                        ) : val}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}