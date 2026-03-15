import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Sparkles, TrendingUp, MapPin, Home } from "lucide-react";
import { Link } from "react-router-dom";

export default function Valuation() {
  const [form, setForm] = useState({
    address: "", city: "Limassol", district: "",
    type: "apartment", area: "", rooms: "", floor: "",
    renovation: "euro", building_year: "",
    parking: "no", balcony: "no",
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleValuate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    const res = await base44.integrations.Core.InvokeLLM({
      prompt: `You are a Cyprus real estate expert. Estimate the current market value of this property for a seller.

Property details:
- Location: ${form.address}, ${form.district ? form.district + ", " : ""}${form.city}, Cyprus
- Type: ${form.type}
- Total area: ${form.area} m²
- Rooms: ${form.rooms}
- Floor: ${form.floor || "N/A"}
- Renovation: ${form.renovation}
- Year built: ${form.building_year || "unknown"}
- Parking: ${form.parking}
- Balcony: ${form.balcony}

Based on current Cyprus real estate market conditions (2025-2026), provide:
1. Estimated market price (EUR) - a realistic range
2. Price per sqm range
3. Brief market insight for this location (2-3 sentences)
4. 3 key factors affecting this valuation
5. Recommended listing strategy (price high/at market/below market)

Be specific with numbers based on real Cyprus market data.`,
      add_context_from_internet: true,
      response_json_schema: {
        type: "object",
        properties: {
          price_min: { type: "number" },
          price_max: { type: "number" },
          price_sqm_min: { type: "number" },
          price_sqm_max: { type: "number" },
          market_insight: { type: "string" },
          key_factors: { type: "array", items: { type: "string" } },
          listing_strategy: { type: "string" },
          confidence: { type: "string", enum: ["low", "medium", "high"] },
        }
      }
    });
    setResult(res);
    setLoading(false);
  };

  const fmt = (n) => n ? `€${Number(n).toLocaleString()}` : "-";

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <Link to="/" className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back
      </Link>

      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-violet-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">AI Property Valuation</h1>
          <p className="text-sm text-slate-500">Get an instant market price estimate for your property</p>
        </div>
      </div>

      <form onSubmit={handleValuate} className="space-y-5 mt-8">
        <Card className="p-5 rounded-2xl border-slate-100 space-y-4">
          <h2 className="font-semibold text-slate-800 flex items-center gap-2"><MapPin className="w-4 h-4 text-violet-500" /> Location</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label>City *</Label>
              <Select value={form.city} onValueChange={v => update("city", v)}>
                <SelectTrigger className="mt-1 rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["Limassol", "Nicosia", "Paphos", "Larnaca", "Famagusta", "Kyrenia"].map(c => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>District / Area</Label>
              <Input className="mt-1 rounded-xl" placeholder="e.g. Germasogeia" value={form.district} onChange={e => update("district", e.target.value)} />
            </div>
          </div>
          <div>
            <Label>Street / Address</Label>
            <Input className="mt-1 rounded-xl" placeholder="e.g. Makarios Ave 12" value={form.address} onChange={e => update("address", e.target.value)} />
          </div>
        </Card>

        <Card className="p-5 rounded-2xl border-slate-100 space-y-4">
          <h2 className="font-semibold text-slate-800 flex items-center gap-2"><Home className="w-4 h-4 text-violet-500" /> Property Details</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div>
              <Label>Type *</Label>
              <Select value={form.type} onValueChange={v => update("type", v)}>
                <SelectTrigger className="mt-1 rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["apartment", "studio", "penthouse", "house", "townhouse", "villa", "commercial"].map(t => (
                    <SelectItem key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Area (m²) *</Label>
              <Input required type="number" className="mt-1 rounded-xl" value={form.area} onChange={e => update("area", e.target.value)} />
            </div>
            <div>
              <Label>Rooms *</Label>
              <Input required type="number" className="mt-1 rounded-xl" value={form.rooms} onChange={e => update("rooms", e.target.value)} />
            </div>
            <div>
              <Label>Floor</Label>
              <Input type="number" className="mt-1 rounded-xl" value={form.floor} onChange={e => update("floor", e.target.value)} />
            </div>
            <div>
              <Label>Year Built</Label>
              <Input type="number" className="mt-1 rounded-xl" placeholder="e.g. 2010" value={form.building_year} onChange={e => update("building_year", e.target.value)} />
            </div>
            <div>
              <Label>Renovation</Label>
              <Select value={form.renovation} onValueChange={v => update("renovation", v)}>
                <SelectTrigger className="mt-1 rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="designer">Designer</SelectItem>
                  <SelectItem value="euro">Euro</SelectItem>
                  <SelectItem value="cosmetic">Cosmetic</SelectItem>
                  <SelectItem value="needs_renovation">Needs Renovation</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Parking</Label>
              <Select value={form.parking} onValueChange={v => update("parking", v)}>
                <SelectTrigger className="mt-1 rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Balcony</Label>
              <Select value={form.balcony} onValueChange={v => update("balcony", v)}>
                <SelectTrigger className="mt-1 rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        <Button type="submit" disabled={loading} size="lg" className="w-full rounded-xl bg-violet-600 hover:bg-violet-700 gap-2">
          {loading ? (
            <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Analysing market data...</>
          ) : (
            <><Sparkles className="w-5 h-5" /> Get AI Valuation</>
          )}
        </Button>
      </form>

      {result && (
        <Card className="mt-8 p-6 rounded-2xl border-violet-100 bg-violet-50 space-y-5">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-violet-600" />
            <h2 className="font-bold text-lg text-slate-900">Valuation Result</h2>
            <span className={`ml-auto text-xs font-semibold px-2 py-0.5 rounded-full ${
              result.confidence === "high" ? "bg-green-100 text-green-700" :
              result.confidence === "medium" ? "bg-amber-100 text-amber-700" :
              "bg-slate-100 text-slate-500"
            }`}>
              {result.confidence?.toUpperCase()} confidence
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-4 text-center">
              <p className="text-xs text-slate-500 mb-1">Estimated Market Value</p>
              <p className="text-xl font-bold text-violet-700">{fmt(result.price_min)} – {fmt(result.price_max)}</p>
            </div>
            <div className="bg-white rounded-xl p-4 text-center">
              <p className="text-xs text-slate-500 mb-1">Price per m²</p>
              <p className="text-xl font-bold text-violet-700">{fmt(result.price_sqm_min)} – {fmt(result.price_sqm_max)}</p>
            </div>
          </div>

          {result.market_insight && (
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Market Insight</p>
              <p className="text-sm text-slate-700">{result.market_insight}</p>
            </div>
          )}

          {result.key_factors?.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Key Valuation Factors</p>
              <ul className="space-y-1">
                {result.key_factors.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                    <span className="w-5 h-5 rounded-full bg-violet-200 text-violet-700 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {result.listing_strategy && (
            <div className="bg-white rounded-xl p-4">
              <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Recommended Strategy</p>
              <p className="text-sm font-medium text-slate-800">{result.listing_strategy}</p>
            </div>
          )}

          <Link to="/AddProperty">
            <Button className="w-full rounded-xl bg-slate-900 hover:bg-slate-800 mt-2">List Your Property Now</Button>
          </Link>
        </Card>
      )}
    </div>
  );
}