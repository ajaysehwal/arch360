/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Maximize2, Minimize2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Hotspot } from "@prisma/client";
import { motion, AnimatePresence } from "framer-motion";

interface ThumbnailCarouselProps {
  hotspots: Hotspot[];
  selectedImage: string;
  onSelect: (url: string) => void;
}

export const ThumbnailCarousel = ({
  hotspots,
  selectedImage,
  onSelect,
}: ThumbnailCarouselProps) => {
  const [startIndex, setStartIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [visibleCount, setVisibleCount] = useState(5);

  // Responsive visible count
  useEffect(() => {
    const updateVisibleCount = () => {
      if (window.innerWidth < 640) setVisibleCount(3);
      else if (window.innerWidth < 768) setVisibleCount(4);
      else setVisibleCount(5);
    };

    updateVisibleCount();
    window.addEventListener("resize", updateVisibleCount);
    return () => window.removeEventListener("resize", updateVisibleCount);
  }, []);

  const nextSlide = () => {
    if (startIndex + visibleCount < hotspots.length) {
      setStartIndex(prev => prev + 1);
    }
  };

  const prevSlide = () => {
    if (startIndex > 0) {
      setStartIndex(prev => prev - 1);
    }
  };

  // Auto-adjust startIndex when reaching the end
  useEffect(() => {
    if (startIndex + visibleCount > hotspots.length) {
      setStartIndex(Math.max(0, hotspots.length - visibleCount));
    }
  }, [visibleCount, hotspots.length, startIndex]);

  return (
    <motion.div
      initial={false}
      animate={isExpanded ? "expanded" : "collapsed"}
      variants={{
        expanded: { bottom: "2rem", width: "90%" },
        collapsed: { bottom: "2rem", width: "auto" }
      }}
      className="fixed left-1/2 transform -translate-x-1/2 z-10"
    >
      <Card className="bg-black/50 backdrop-blur-md border-0">
        <div className="p-2 relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute -top-10 right-0 text-white bg-black/50 hover:bg-black/70"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={prevSlide}
              disabled={startIndex === 0}
              className="text-white hover:bg-white/20 disabled:opacity-30"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex gap-2 overflow-hidden">
              <AnimatePresence mode="popLayout">
                {hotspots.slice(startIndex, startIndex + visibleCount).map((spot, i) => (
                  <motion.div
                    key={`${spot.url}-${i}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                    className={cn(
                      "relative rounded-md overflow-hidden cursor-pointer transition-all",
                      isExpanded ? "w-32 h-32" : "w-20 h-20",
                      "sm:w-24 sm:h-24",
                      selectedImage === spot.url && "ring-2 ring-white scale-105"
                    )}
                    onClick={() => onSelect(spot.url)}
                  >
                    <div className="group relative w-full h-full">
                      <img
                        src={spot.url}
                        alt={spot.label || ""}
                        className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-110"
                      />
                      {spot.label && (
                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-1 transform translate-y-full transition-transform duration-200 group-hover:translate-y-0">
                          {spot.label}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={nextSlide}
              disabled={startIndex + visibleCount >= hotspots.length}
              className="text-white hover:bg-white/20 disabled:opacity-30"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {isExpanded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-white text-xs bg-black/50 px-2 py-1 rounded-full"
            >
              {startIndex + 1}-{Math.min(startIndex + visibleCount, hotspots.length)} of {hotspots.length}
            </motion.div>
          )}
        </div>
      </Card>
    </motion.div>
  );
};