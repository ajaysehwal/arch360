"use client";

import React, { useEffect, useState } from "react";
import { Hotspot } from "@prisma/client";
import { useParams } from "next/navigation";
export const runtime = "edge";

interface Project {
  hotspots: Hotspot[];
}


import '@photo-sphere-viewer/core/index.css';
import '@photo-sphere-viewer/virtual-tour-plugin/index.css';
import { Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ReactPhotoSphereViewer } from "react-photo-sphere-viewer";
import { ThumbnailCarousel } from "./components/ThumbnailCarousel";

const VirtualTourPage = () => {
  const [project, setProject] = useState<Project | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const {id}=useParams()
  useEffect(() => {
    const fetchProject = async (id:string) => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch(`/api/tour/${id}`, { cache: "no-store" });
        
        if (!response.ok) throw new Error("Failed to load tour");
        
        const data = await response.json();
        setProject(data);
        setSelectedImage(data.hotspots[0]?.url || "");
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject(id as string);
  }, [id]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-white mx-auto" />
          <p className="mt-2 text-white">Loading virtual tour...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-900">
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600">{error || "Tour not found"}</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="relative h-screen bg-gray-900">
      {selectedImage && (
        <ReactPhotoSphereViewer
          src={selectedImage}
          height="100vh"
          width="100%"
          container="div"
          containerClass="absolute inset-0"
          loadingImg="/loading.gif"
        />
      )}
      
      <ThumbnailCarousel
        hotspots={project.hotspots}
        selectedImage={selectedImage}
        onSelect={setSelectedImage}
      />
    </div>
  );
};

export default VirtualTourPage;