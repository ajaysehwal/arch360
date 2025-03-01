import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Hotspot } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RightSidebar({
  hotspots,
  spotRefs,
  selectedHotspot,
  onSpotNameChange,
  onSpotImageUpload,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onDeleteSpot,
  onSave,
  projectId,
}: {
  hotspots: Hotspot[];
  spotRefs: React.RefObject<{
    [key: string]: HTMLDivElement | null;
  }>;
  onDeleteSpot: (id: string) => void;
  selectedHotspot: string | null;
  onSpotNameChange: (id: string, newName: string) => void;
  onSave:() => Promise<void>;
  onSpotImageUpload: (
    event: React.ChangeEvent<HTMLInputElement> | null,
    spotId: string
  ) => void;
  projectId: string;
}) {
  const router = useRouter();
  const handlePublish = () => {
    onSave();
    router.push(`/tour/${projectId}`);
  };
  const handlePreview = () => {
    onSave();
    router.push(`/tour/${projectId}`);
  };
  return (
    <div className="h-[90vh]">
      <Sidebar side="right" collapsible="none">
        <SidebarHeader>
          <div className="p-2 border-b flex justify-between items-center">
            <p className="text-sm text-gray-500">
              {hotspots.length} spots added
            </p>
            <div className="flex justify-between items-center gap-1">
              <button
                onClick={() => handlePublish()}
                className="shadow-[0_4px_14px_0_rgb(0,118,255,39%)] hover:shadow-[0_6px_20px_rgba(0,118,255,23%)] hover:bg-[rgba(0,118,255,0.9)] px-4 py-2 bg-[#0070f3] text-white font-light transition duration-200 ease-linear rounded-2xl"
              >
                Publish
              </button>
              <Button>
                <Link
                  onClick={() => handlePreview()}
                  className="flex gap-2 items-center"
                  href={`/tour/${projectId}`}
                >
                  Preview <Eye />
                </Link>
              </Button>
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
                      ref={(el) => {
                        if (el && el instanceof HTMLDivElement) spotRefs.current[spot.id] = el;
                      }}
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
                            value={spot.label || ""}
                            onChange={(e) =>
                              onSpotNameChange(spot.id, e.target.value)
                            }
                          />
                        </div>

                        <Input
                          type="file"
                          onChange={(e) => onSpotImageUpload(e, spot.id)}
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
  );
}
