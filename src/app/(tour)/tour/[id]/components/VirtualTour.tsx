"use client";

import React, { useEffect, useRef, useState } from "react";
import { Hotspot } from "@prisma/client";
import { TourViewer } from "@/services/Viewer"; // Adjust path as needed


export default function VirtualTour({ hotspots }: { hotspots: Hotspot[] }) {
  const viewerContainerRef = useRef<HTMLDivElement | null>(null);
  const [tour, setTour] = useState<TourViewer | null>(null);

  useEffect(() => {
    if (viewerContainerRef.current && hotspots.length > 0) {
      const tourInstance = new TourViewer(hotspots, "viewer-container");
      setTour(tourInstance);
    }
  }, [hotspots]);

  return (
    <div className="relative w-full h-screen">
      <h1 className="absolute top-5 left-1/2 transform -translate-x-1/2 text-white text-3xl font-bold">
        Virtual Tour
      </h1>
      <div ref={viewerContainerRef} id="viewer-container" className="w-full h-full"></div>
    </div>
  );
}
