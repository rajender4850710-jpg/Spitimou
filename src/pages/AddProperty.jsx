import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { Plus, Upload, ArrowLeft, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function AddProperty() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "", description: "", type: "apartment", deal_type: "sale",
    price: "", area: "", living_area: "", kitchen_area: "",
    rooms: "", floor: "", total_floors: "", building_year: "",
    building_type: "brick", renovation: "euro",
    address: "", city: "", district: "",
    contact_name: "", contact_phone: "",
    parking: false, balcony: false, elevator: false, is_featured: false,
  });

  const update = (key, value) => setForm({ ...form, [key]: value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = {
      ...form,
      price: Number(form.price),
      area: Number(form.area),
      living_area: form.living_area ? Number(form.living_area) : undefined,
      kitchen_area: form.kitchen_area ? Number(form.kitchen_area) : undefined,
      rooms: Number(form.rooms),
      floor: form.floor ? Number(form.floor) : undefined,
      total_floors: form.total_floors ? Number(form.total_floors) : undefined,
      building_year: form.building_year ? Number(form.building_year) : undefined,
      price_per_sqm: form.area ? Math.round(Number(form.price) / Number(form.area)) : undefined,
      status: "active",
      images: ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800"],
    };
    await base44.entities.Property.create(data);
    setLoading(false);
    navigate("/Search");
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setForm({ ...form, images: [...(form.images || []), file_url] });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <Link to="/Search" className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back
      </Link>

      <h1 className="text-3xl font-bold text-slate-900 mb-2">List a Property</h1>
      <p className="text-slate-500 mb-8">Fill in the details to create your listing</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="p-6 rounded-2xl border-slate-100 space-y-4">
          <h2 className="font-semibold text-slate-900">Basic Information</h2>
          <div>
            <Label>Title *</Label>
            <Input required className="mt-1 rounded-xl" value={form.title} onChange={e => update("title", e.target.value)} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Property Type *</Label>
              <Select value={form.type} onValueChange={v => update("type", v)}>
                <SelectTrigger className="mt-1 rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="studio">Studio</SelectItem>
                  <SelectItem value="apartment">Apartment</SelectItem>
                  <SelectItem value="penthouse">Penthouse</SelectItem>
                  <SelectItem value="villa">Villa</SelectItem>
                  <SelectItem value="maisonette">Maisonette</SelectItem>
                  <SelectItem value="townhouse">Townhouse</SelectItem>
                  <SelectItem value="land">Plots & Land</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Deal Type *</Label>
              <Select value={form.deal_type} onValueChange={v => update("deal_type", v)}>
                <SelectTrigger className="mt-1 rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="sale">For Sale</SelectItem>
                  <SelectItem value="rent">For Rent</SelectItem>
                  <SelectItem value="daily_rent">Daily Rent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label>Description</Label>
            <Textarea className="mt-1 rounded-xl" rows={4} value={form.description} onChange={e => update("description", e.target.value)} />
          </div>
        </Card>

        <Card className="p-6 rounded-2xl border-slate-100 space-y-4">
          <h2 className="font-semibold text-slate-900">Specifications</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div><Label>Price ($) *</Label><Input required type="number" className="mt-1 rounded-xl" value={form.price} onChange={e => update("price", e.target.value)} /></div>
            <div><Label>Total Area (m²) *</Label><Input required type="number" className="mt-1 rounded-xl" value={form.area} onChange={e => update("area", e.target.value)} /></div>
            <div><Label>Rooms *</Label><Input required type="number" className="mt-1 rounded-xl" value={form.rooms} onChange={e => update("rooms", e.target.value)} /></div>
            <div><Label>Living Area (m²)</Label><Input type="number" className="mt-1 rounded-xl" value={form.living_area} onChange={e => update("living_area", e.target.value)} /></div>
            <div><Label>Kitchen (m²)</Label><Input type="number" className="mt-1 rounded-xl" value={form.kitchen_area} onChange={e => update("kitchen_area", e.target.value)} /></div>
            <div><Label>Floor</Label><Input type="number" className="mt-1 rounded-xl" value={form.floor} onChange={e => update("floor", e.target.value)} /></div>
            <div><Label>Total Floors</Label><Input type="number" className="mt-1 rounded-xl" value={form.total_floors} onChange={e => update("total_floors", e.target.value)} /></div>
            <div><Label>Year Built</Label><Input type="number" className="mt-1 rounded-xl" value={form.building_year} onChange={e => update("building_year", e.target.value)} /></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Building Type</Label>
              <Select value={form.building_type} onValueChange={v => update("building_type", v)}>
                <SelectTrigger className="mt-1 rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="brick">Brick</SelectItem><SelectItem value="panel">Panel</SelectItem>
                  <SelectItem value="monolith">Monolith</SelectItem><SelectItem value="wood">Wood</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Renovation</Label>
              <Select value={form.renovation} onValueChange={v => update("renovation", v)}>
                <SelectTrigger className="mt-1 rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="designer">Designer</SelectItem><SelectItem value="euro">Euro</SelectItem>
                  <SelectItem value="cosmetic">Cosmetic</SelectItem><SelectItem value="needs_renovation">Needs Renovation</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex flex-wrap gap-6 pt-2">
            <div className="flex items-center gap-2"><Switch checked={form.parking} onCheckedChange={v => update("parking", v)} /><Label>Parking</Label></div>
            <div className="flex items-center gap-2"><Switch checked={form.balcony} onCheckedChange={v => update("balcony", v)} /><Label>Balcony</Label></div>
            <div className="flex items-center gap-2"><Switch checked={form.elevator} onCheckedChange={v => update("elevator", v)} /><Label>Elevator</Label></div>
          </div>
        </Card>

        <Card className="p-6 rounded-2xl border-slate-100 space-y-4">
          <h2 className="font-semibold text-slate-900">Location & Contact</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div><Label>Address *</Label><Input required className="mt-1 rounded-xl" value={form.address} onChange={e => update("address", e.target.value)} /></div>
            <div><Label>City *</Label><Input required className="mt-1 rounded-xl" value={form.city} onChange={e => update("city", e.target.value)} /></div>
            <div><Label>District</Label><Input className="mt-1 rounded-xl" value={form.district} onChange={e => update("district", e.target.value)} /></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><Label>Contact Name</Label><Input className="mt-1 rounded-xl" value={form.contact_name} onChange={e => update("contact_name", e.target.value)} /></div>
            <div><Label>Contact Phone</Label><Input className="mt-1 rounded-xl" value={form.contact_phone} onChange={e => update("contact_phone", e.target.value)} /></div>
          </div>
        </Card>

        <Card className="p-6 rounded-2xl border-slate-100">
          <h2 className="font-semibold text-slate-900 mb-4">Photos</h2>
          <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:border-slate-300 transition">
            <Upload className="w-8 h-8 text-slate-300 mb-2" />
            <span className="text-sm text-slate-400">Click to upload photos</span>
            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
          </label>
        </Card>

        <Button type="submit" disabled={loading} size="lg" className="w-full rounded-xl bg-slate-900 hover:bg-slate-800 gap-2">
          {loading ? "Creating..." : <><CheckCircle className="w-5 h-5" /> Create Listing</>}
        </Button>
      </form>
    </div>
  );
}