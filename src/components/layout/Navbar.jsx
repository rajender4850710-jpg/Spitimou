import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Heart, Menu, X, Home, Search, Calculator, GitCompare, Plus, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const links = [
    { to: "/Home", label: "Home", icon: Home },
    { to: "/Search", label: "Search", icon: Search },
    { to: "/Favorites", label: "Favorites", icon: Heart },
    { to: "/Calculator", label: "Mortgage", icon: Calculator },
    { to: "/Compare", label: "Compare", icon: GitCompare },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/Home" className="flex items-center gap-2.5">
            <img src="https://base44.com/logo_v2.svg" alt="Logo" className="w-9 h-9" />
            <span className="text-xl font-bold tracking-tight text-slate-900">Στέγη μου</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive(link.to)
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link to="/AddProperty">
              <Button size="sm" className="bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white rounded-xl gap-2 shadow-lg shadow-rose-500/20">
                <Plus className="w-4 h-4" />
                List Property
              </Button>
            </Link>
          </div>

          <button
            className="md:hidden p-2 rounded-xl hover:bg-slate-100 transition"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-slate-100 overflow-hidden"
          >
            <div className="px-4 py-3 space-y-1">
              {links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                    isActive(link.to) ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </Link>
              ))}
              <Link to="/AddProperty" onClick={() => setMobileOpen(false)}>
                <Button className="w-full mt-2 bg-rose-500 hover:bg-rose-600 rounded-xl gap-2">
                  <Plus className="w-4 h-4" /> List Property
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}