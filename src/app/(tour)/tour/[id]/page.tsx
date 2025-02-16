"use client";

import React, { useEffect, useState } from "react";
import VirtualTour from "./components/VirtualTour";
import { Hotspot } from "@prisma/client";
import { useParams } from "next/navigation";

interface Project {
  hotspots: Hotspot[];
}

interface PageProps {
  params: {
    id: string;
  };
}
import '@photo-sphere-viewer/core/index.css';
import '@photo-sphere-viewer/virtual-tour-plugin/index.css';


const VirtualTourPage: React.FC<PageProps> = () => {
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams();
  useEffect(() => {
    const fetchProject = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`/api/tour/${id}`, {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Project not found");
        }

        const data = await response.json();
        setProject(data);
      } catch (error) {
        console.error("Error fetching project:", error);
        setError(error instanceof Error ? error.message : "Failed to load project");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-600">
        <p>{error}</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="p-4 text-gray-600">
        Project not found
      </div>
    );
  }

  return (
    <div>
      <VirtualTour hotspots={project.hotspots || []} />
    </div>
  );
};

export default VirtualTourPage;