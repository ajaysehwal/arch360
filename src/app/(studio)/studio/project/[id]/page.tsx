"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Download, Loader2, Plus, Save, X } from "lucide-react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { Hotspots, Project } from "@prisma/client";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import RightSidebar from "./components/RightSidebar";
import LeftSidebar from "./components/leftSidebar";
import { useHotspots } from "@/hooks/useHotspots";
import { useProject } from "@/hooks/useProject";
import { useUser } from "@clerk/nextjs";

import { handleImageUpload } from "@/utils/image-upload";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

const ProjectPage: React.FC = () => {
  const params = useParams();
  const { user } = useUser();
  const { toast } = useToast();
  const imageRef = React.useRef<HTMLDivElement>(null);
  const { project, loading } = useProject(params.id as string);
  const [isSaving, setIsSaving] = useState(false);
  const {
    hotspots,
    selectedHotspot,
    isAddingHotspot,
    spotRefs,
    handleAddHotspot,
    handleSpotNameChange,
    handleDeleteSpot,
    handleSpotSelect,
    handleSpotImageUpload: uploadSpotImage,
    setIsAddingHotspot,
  } = useHotspots(params.id as string);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await axios.post(`/api/project/${params.id}/save`, {
        hotspots,
      });
      toast({
        title: "Project saved",
        description: "Your project has been saved",
      });
      setIsSaving(false);
    } catch (error) {
      console.error("Failed to save project:", error);
      setIsSaving(false);
      toast({
        title: "Failed to save project",
        description: "Please try again",
      });
    }
  };
  const tools = [
    {
      icon: isAddingHotspot ? X : Plus,
      label: isAddingHotspot ? "Cancel" : "Add Spot",
      action: () => setIsAddingHotspot(!isAddingHotspot),
      className: isAddingHotspot ? "text-red-500" : "text-green-500",
    },
    {
      icon: Download,
      label: "Download",
      action: () => null,
      className: "",
    },
    {
      icon: isSaving ? Loader2 : Save,
      label: "Save",
      action: handleSave,
      className: isSaving ? "animate-spin" : "",
    },
  ];

  const handleImageClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isAddingHotspot || !imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const position = {
      x: ((event.clientX - rect.left) / rect.width) * 100,
      y: ((event.clientY - rect.top) / rect.height) * 100,
    };

    handleAddHotspot(position);
  };

  const handleSpotImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement> | null,
    spotId: string
  ) => {
    if (!event) {
      uploadSpotImage(null, spotId);
      return;
    }

    const file = event.target.files?.[0];
    if (!file || !user?.id) return;

    try {
      const url = await handleImageUpload(file, user.id, (progress) => {
        console.log(`Uploading... ${progress}% done`);
      });
      uploadSpotImage(url, spotId);
    } catch (error) {
      console.error("Failed to upload image:", error);
      // Here you might want to show a toast notification to the user
    }
  };
  console.log(hotspots);

  if (loading || !project) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 bg-gray-50 dark:bg-gray-900 h-[90vh] w-full">
      <main className="w-full">
        <div className="flex w-full justify-between items-center">
          <LeftSidebar tools={tools} />

          <MapView
            project={project}
            hotspots={hotspots}
            selectedHotspot={selectedHotspot}
            imageRef={imageRef}
            onImageClick={handleImageClick}
            onHotspotClick={handleSpotSelect}
          />

          <RightSidebar
            onSpotImageUpload={handleSpotImageUpload}
            onSpotNameChange={handleSpotNameChange}
            onDeleteSpot={handleDeleteSpot}
            selectedHotspot={selectedHotspot}
            hotspots={hotspots}
            spotRefs={spotRefs}
            projectId={params.id as string}
          />
        </div>
      </main>
    </div>
  );
};

interface MapViewProps {
  project: Project; // Replace with proper type
  hotspots: Hotspots[];
  selectedHotspot: string | null;
  imageRef: React.RefObject<HTMLDivElement>;
  onImageClick: (event: React.MouseEvent<HTMLDivElement>) => void;
  onHotspotClick: (id: string) => void;
}

const MapView: React.FC<MapViewProps> = ({
  project,
  hotspots,
  selectedHotspot,
  imageRef,
  onImageClick,
  onHotspotClick,
}) => (
  <div className="relative w-full h-[90vh] dark:bg-gray-800 shadow-lg overflow-hidden dotted-background">
    <TransformWrapper
      smooth={true}
      initialScale={1}
      initialPositionX={0}
      initialPositionY={0}
      minScale={0.5}
      maxScale={2}
      limitToBounds={false}
    >
      <TransformComponent>
        <div onClick={onImageClick} ref={imageRef}>
          <Image
            src={project.floorMapUrl}
            alt="Floor Map"
            width={1100}
            height={600}
            objectFit="contain"
            className="transition-all duration-300 ease-out dark:filter dark:brightness-90"
          />
          <HotspotMarkers
            hotspots={hotspots}
            selectedHotspot={selectedHotspot}
            onHotspotClick={onHotspotClick}
          />
        </div>
      </TransformComponent>
    </TransformWrapper>
  </div>
);

interface HotspotMarkersProps {
  hotspots: Hotspots[];
  selectedHotspot: string | null;
  onHotspotClick: (id: string) => void;
}

const HotspotMarkers: React.FC<HotspotMarkersProps> = ({
  hotspots,
  selectedHotspot,
  onHotspotClick,
}) => (
  <>
    {hotspots.map((hotspot, index) => (
      <div
        key={hotspot.id}
        className={`absolute w-6 h-6 -ml-3 -mt-3 rounded-full flex items-center justify-center 
          ${selectedHotspot === hotspot.id ? "bg-blue-500" : "bg-red-500"} 
          hover:bg-blue-600 cursor-pointer transition-colors`}
        style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
        onClick={(e) => {
          e.stopPropagation();
          onHotspotClick(hotspot.id);
        }}
      >
        <span className="text-white text-xs font-bold">{index + 1}</span>
      </div>
    ))}
  </>
);

export default ProjectPage;
