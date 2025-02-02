"use client";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { useProjectStore } from "@/store/project";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { projectApi } from "@/utils/requests";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { Hotspots } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Command, Download, Plus, Share, X } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import RightSidebar from "./components/RightSidebar";
async function getProject(id: string) {
  try {
    const { data } = await projectApi.getProject(id);
    return data.project;
  } catch (error) {
    console.error("Failed to fetch project:", error);
    return null;
  }
}

function ProjectPage() {
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const { setCurrentProject, currentProject: project } = useProjectStore();
  const [isAddingHotspot, setIsAddingHotspot] = useState(false);
  const [hotspots, setHotspots] = useState<Hotspots[]>([]);
  const [selectedHotspot, setSelectedHotspot] = useState<string | null>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const spotRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    async function fetchProject() {
      setLoading(true);
      if (params.id) {
        try {
          const project = await getProject(params.id as string);
          setCurrentProject(project);
        } catch (error) {
          console.error("Failed to fetch project:", error);
        } finally {
          setLoading(false);
        }
      }
    }
    fetchProject();
  }, [params.id, setCurrentProject]);

  const handleImageClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isAddingHotspot || !imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    const newHotspot: Hotspots = {
      id: Date.now().toString(),
      x,
      y,
      url: "",
      projectId: params.id as string,
      updatedAt: new Date(),
      createdAt: new Date(),
      label: `Room ${hotspots.length + 1}`,
    };

    setHotspots((prev) => [...prev, newHotspot]);
    console.log(hotspots);
    setIsAddingHotspot(false);
  };
  useEffect(() => {
    if (selectedHotspot && spotRefs.current[selectedHotspot]) {
      spotRefs.current[selectedHotspot]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [selectedHotspot]);

  if (loading || !project) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
        <LoadingSpinner />
      </div>
    );
  }
  const handleSpotNameChange = (id: string, newName: string) => {
    setHotspots((spots) =>
      spots.map((spot) => (spot.id === id ? { ...spot, label: newName } : spot))
    );
  };

  // const handleRoomImageUpload = (
  //   event: React.ChangeEvent<HTMLInputElement>,
  //   hotspotId: string
  // ) => {
  //   const file = event.target.files?.[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       setHotspots(
  //         hotspots.map((hotspot) =>
  //           hotspot.id === hotspotId
  //             ? { ...hotspot, roomImage: reader.result as string }
  //             : hotspot
  //         )
  //       );
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };
  const Tools = [
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
  ];
  const handleSpotImageUpload = (
    event: React.ChangeEvent<HTMLInputElement> | null,
    spotId: string
  ) => {
    if (!event) {
      // Handle image removal
      setHotspots((spots) =>
        spots.map((spot) =>
          spot.id === spotId ? { ...spot, roomImage: undefined } : spot
        )
      );
      return;
    }

    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setHotspots((spots) =>
          spots.map((spot) =>
            spot.id === spotId
              ? { ...spot, roomImage: reader.result as string }
              : spot
          )
        );
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteSpot = (id: string) => {
    setHotspots((spots) => spots.filter((spot) => spot.id !== id));
    if (selectedHotspot === id) {
      setSelectedHotspot(null);
    }
  };

  return (
    <div className="flex flex-col gap-4 bg-gray-50 dark:bg-gray-900 h-[90vh]">
      <main className="container mx-auto">
        <div className="flex w-full justify-between items-center">
          {/* Toolbar */}
          <div className="min-w-[50px] h-[90vh] flex flex-col gap-1 items-center">
            <Sidebar
              collapsible="none"
              className="!w-[calc(var(--sidebar-width-icon)_+_1px)] border-r"
            >
              <SidebarContent>
                <SidebarGroup>
                  <SidebarGroupContent className="px-1.5 md:px-0">
                    <SidebarMenu>
                      {Tools.map((item, i) => (
                        <SidebarMenuItem key={i}>
                          <SidebarMenuButton
                            onClick={item.action}
                            tooltip={{
                              children: item.label,
                              hidden: false,
                            }}
                            className={`px-2.5 md:px-2`}
                          >
                            <item.icon className={item.className} />
                            <span>{item.label}</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              </SidebarContent>
            </Sidebar>
          </div>
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
                <div onClick={handleImageClick} ref={imageRef}>
                  <Image
                    src={project.floor_map_url}
                    alt="Floor Map"
                    width={1100}
                    height={600}
                    objectFit="contain"
                    className="transition-all duration-300 ease-out dark:filter dark:brightness-90"
                  />
                  {hotspots.map((hotspot) => (
                    <div
                      key={hotspot.id}
                      className={`absolute w-6 h-6 -ml-3 -mt-3 rounded-full flex items-center justify-center 
                    ${
                      selectedHotspot === hotspot.id
                        ? "bg-blue-500"
                        : "bg-red-500"
                    } 
                    hover:bg-blue-600 cursor-pointer transition-colors`}
                      style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedHotspot(
                          selectedHotspot === hotspot.id ? null : hotspot.id
                        );
                      }}
                    >
                      <span className="text-white text-xs font-bold">
                        {hotspots.indexOf(hotspot) + 1}
                      </span>
                    </div>
                  ))}
                </div>
              </TransformComponent>
            </TransformWrapper>
          </div>
          <div className="h-[90vh]">
            <Sidebar side="right" collapsible="none">
              <SidebarHeader>
                <div className="p-2 border-b flex justify-between items-center">
                  <p className="text-sm text-gray-500">
                    {hotspots.length} spots added
                  </p>
                  <div className="flex justify-between items-center gap-2">
                    <button className="shadow-[0_4px_14px_0_rgb(0,118,255,39%)] hover:shadow-[0_6px_20px_rgba(0,118,255,23%)] hover:bg-[rgba(0,118,255,0.9)] px-4 py-2 bg-[#0070f3] text-white font-light transition duration-200 ease-linear rounded-2xl">
                      Publish
                    </button>
                  </div>
                </div>
              </SidebarHeader>

              <SidebarContent>
                <SidebarGroup>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <ScrollArea className="h-[500px] flex flex-col gap-2 rounded-md">
                        {hotspots.map((spot, i) => (
                          <SidebarMenuItem
                            key={i}
                            className={`p-2 flex flex-col gap-1`}
                            ref={(el) => (spotRefs.current[spot.id] = el)}
                          >
                            <div
                              className={`p-4 rounded-lg border transition-all duration-200 ${
                                selectedHotspot === spot.id
                                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                                  : "border-gray-200 dark:border-gray-700"
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <span className="w-6 text-sm font-medium">
                                  {i + 1}
                                </span>
                                <Input
                                  placeholder="Spot name"
                                  className="flex-1"
                                  onChange={(e) =>
                                    handleSpotNameChange(
                                      spot.id,
                                      e.target.value
                                    )
                                  }
                                />
                              </div>

                              <Input
                                type="file"
                                onChange={(e) =>
                                  handleSpotImageUpload(e, spot.id)
                                }
                                placeholder="upload spot image"
                              />
                            </div>
                          </SidebarMenuItem>
                        ))}
                      </ScrollArea>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              </SidebarContent>
            </Sidebar>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ProjectPage;
