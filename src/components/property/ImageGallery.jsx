import React, { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ImageGallery({ images = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);

  if (!images.length) return null;

  const next = () => setCurrentIndex((i) => (i + 1) % images.length);
  const prev = () => setCurrentIndex((i) => (i - 1 + images.length) % images.length);

  return (
    <>
      <div className="relative rounded-2xl overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 h-[300px] md:h-[480px]">
          <div
            className="md:col-span-2 cursor-pointer overflow-hidden"
            onClick={() => setFullscreen(true)}
          >
            <img
              src={images[0]}
              alt="Main"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="hidden md:grid grid-rows-2 gap-2">
            {images.slice(1, 3).map((img, i) => (
              <div key={i} className="overflow-hidden cursor-pointer relative" onClick={() => { setCurrentIndex(i + 1); setFullscreen(true); }}>
                <img src={img} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                {i === 1 && images.length > 3 && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <span className="text-white font-semibold text-lg">+{images.length - 3} more</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="md:hidden absolute bottom-3 right-3 bg-black/50 text-white text-xs px-3 py-1 rounded-full">
          {images.length} photos
        </div>
      </div>

      <AnimatePresence>
        {fullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
          >
            <button onClick={() => setFullscreen(false)} className="absolute top-4 right-4 p-2 bg-white/10 rounded-full hover:bg-white/20 transition">
              <X className="w-6 h-6 text-white" />
            </button>
            <button onClick={prev} className="absolute left-4 p-3 bg-white/10 rounded-full hover:bg-white/20 transition">
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            <button onClick={next} className="absolute right-4 p-3 bg-white/10 rounded-full hover:bg-white/20 transition">
              <ChevronRight className="w-6 h-6 text-white" />
            </button>
            <img src={images[currentIndex]} alt="" className="max-w-[90vw] max-h-[85vh] object-contain rounded-xl" />
            <div className="absolute bottom-4 text-white text-sm">
              {currentIndex + 1} / {images.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}