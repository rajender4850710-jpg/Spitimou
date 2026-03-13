import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Send, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ContactForm({ propertyId, contactName, contactPhone }) {
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await base44.entities.Inquiry.create({ ...form, property_id: propertyId });
    setSent(true);
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6">
      <h3 className="font-semibold text-slate-900 mb-1">Contact Agent</h3>
      {contactName && <p className="text-sm text-slate-500 mb-4">{contactName}</p>}

      {contactPhone && (
        <a
          href={`tel:${contactPhone}`}
          className="flex items-center gap-2 w-full mb-4 px-4 py-3 bg-emerald-50 rounded-xl text-emerald-700 font-medium text-sm hover:bg-emerald-100 transition"
        >
          <Phone className="w-4 h-4" /> {contactPhone}
        </a>
      )}

      <AnimatePresence mode="wait">
        {sent ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-6">
            <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <p className="font-semibold text-slate-900">Request Sent!</p>
            <p className="text-sm text-slate-500">We'll get back to you soon.</p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <Input
              placeholder="Your Name"
              required
              className="rounded-xl"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <Input
              placeholder="Phone Number"
              required
              className="rounded-xl"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
            <Input
              placeholder="Email (optional)"
              type="email"
              className="rounded-xl"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <Textarea
              placeholder="Your message..."
              className="rounded-xl resize-none"
              rows={3}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
            />
            <Button type="submit" disabled={loading} className="w-full rounded-xl bg-slate-900 hover:bg-slate-800 gap-2">
              <Send className="w-4 h-4" /> {loading ? "Sending..." : "Send Request"}
            </Button>
          </form>
        )}
      </AnimatePresence>
    </div>
  );
}