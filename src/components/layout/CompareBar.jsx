import React from "react";
import { Link } from "react-router-dom";
import { GitCompare, X } from "lucide-react";
import { useCompare } from "@/lib/CompareContext";
import { motion, AnimatePresence } from "framer-motion";

export default function CompareBar() {
  const { compareIds, toggleCompare } = useCompare();

  if (compareIds.length === 0) return null;

  const isFull = compareIds.length === 4;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className={`fixed bottom-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl shadow-2xl border transition-all ${
          isFull
            ? "bg-blue-600 border-blue-700 text-white"
            : "bg-white border-slate-200 text-slate-800"
        }`}
      >
        <GitCompare className={`w-5 h-5 flex-shrink-0 ${isFull ? "text-white" : "text-blue-500"}`} />
        <span className="text-sm font-semibold whitespace-nowrap">
          {isFull ? "🎉 4 properties selected!" : `${compareIds.length} of 4 added to compare`}
        </span>
        {isFull && (
          <Link
            to="/Compare"
            className="ml-1 bg-white text-blue-600 text-sm font-bold px-4 py-1.5 rounded-xl hover:bg-blue-50 transition whitespace-nowrap"
          >
            Open Compare →
          </Link>
        )}
        <button
          onClick={() => compareIds.forEach(id => toggleCompare(id))}
          className={`w-6 h-6 rounded-full flex items-center justify-center ml-1 transition ${
            isFull ? "bg-blue-500 hover:bg-blue-400 text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-500"
          }`}
          title="Clear all"
        >
          <X className="w-3 h-3" />
        </button>
      </motion.div>
    </AnimatePresence>
  );
}