import React from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Search, Building2, Home as HomeIcon, Landmark, TrendingUp, ArrowRight, Star, MapPin, Shield, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import PropertyCard from "../components/property/PropertyCard";

export default function Home() {
  const { data: featured = [] } = useQuery({
    queryKey: ["featured-properties"],
    queryFn: () => base44.entities.Property.filter({ is_featured: true, status: "active" }),
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
  };

  const categories = [
    { icon: Building2, label: "Apartments", type: "apartment", color: "from-blue-500 to-blue-600" },
    { icon: HomeIcon, label: "Houses", type: "house", color: "from-emerald-500 to-emerald-600" },
    { icon: Landmark, label: "Penthouses", type: "penthouse", color: "from-purple-500 to-purple-600" },
    { icon: TrendingUp, label: "Commercial", type: "commercial", color: "from-amber-500 to-amber-600" },
  ];

  const stats = [
    { value: "12,000+", label: "Listed Properties" },
    { value: "8,500+", label: "Happy Clients" },
    { value: "200+", label: "Partner Agents" },
    { value: "50+", label: "Cities Covered" },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&q=80"
            className="w-full h-full object-cover"
            alt="Hero"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/70 to-transparent" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6">
              <Star className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-sm text-white/90 font-medium">#1 Real Estate Platform</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Find Your
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-rose-500">
                Dream Property
              </span>
            </h1>
            <p className="text-lg text-white/70 mb-10 max-w-lg">
              Explore thousands of premium properties with advanced search, interactive maps, and AI-powered recommendations.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/Search?deal_type=sale">
                <Button size="lg" className="w-full sm:w-auto bg-white text-slate-900 hover:bg-white/90 rounded-xl px-8 gap-2 h-13 text-base shadow-2xl">
                  <Search className="w-4 h-4" /> Browse Properties
                </Button>
              </Link>
              <Link to="/Search?deal_type=rent">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10 rounded-xl px-8 h-13 text-base">
                  Rent a Place
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {stats.map((stat) => (
              <div key={stat.label} className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-5 text-center">
                <p className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-white/60 mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 -mt-12 relative z-10 mb-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.type}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
            >
              <Link
                to={`/Search?type=${cat.type}`}
                className="block bg-white rounded-2xl p-6 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-100"
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${cat.color} rounded-xl flex items-center justify-center mb-4`}>
                  <cat.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-slate-900">{cat.label}</h3>
                <p className="text-sm text-slate-400 mt-1">Explore →</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-20">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Featured Properties</h2>
            <p className="text-slate-500 mt-2">Handpicked premium listings</p>
          </div>
          <Link to="/Search" className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-rose-600 hover:text-rose-700">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.slice(0, 6).map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              isFavorited={favIds.has(property.id)}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      </section>

      {/* Why Us */}
      <section className="bg-slate-900 py-20 mb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-bold text-white text-center mb-4">Why Choose Estato</h2>
          <p className="text-slate-400 text-center mb-14 max-w-lg mx-auto">We provide comprehensive tools and premium service for your property journey</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Shield, title: "Verified Listings", desc: "Every property is verified by our team for accuracy and legitimacy." },
              { icon: MapPin, title: "Interactive Maps", desc: "Explore properties on interactive maps with neighborhood insights." },
              { icon: Clock, title: "Real-Time Updates", desc: "Get instant notifications when new properties match your criteria." },
            ].map((item) => (
              <div key={item.title} className="text-center">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
                  <item.icon className="w-7 h-7 text-rose-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-slate-500 text-sm">© 2026 Estato. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}