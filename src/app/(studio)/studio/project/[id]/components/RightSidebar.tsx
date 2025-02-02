import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Image as ImageIcon, Trash2, Edit2 } from "lucide-react";
import Image from "next/image";
import { Hotspots } from "@prisma/client";
import { Sidebar } from "@/components/ui/sidebar";
import SpotList from "./SpotList";

interface RightSidebarProps {
  hotspots: Hotspots[];
  selectedHotspot: string | null;
  onSpotNameChange: (id: string, newName: string) => void;
  onSpotImageUpload: (
    event: React.ChangeEvent<HTMLInputElement> | null,
    spotId: string
  ) => void;
  onDeleteSpot: (id: string) => void;
}

interface SpotRefs {
  [key: string]: HTMLDivElement | null;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({
  hotspots,
  selectedHotspot,
  onSpotNameChange,
  onSpotImageUpload,
  onDeleteSpot,
}) => {
  const spotRefs = useRef<SpotRefs>({});

  useEffect(() => {
    if (selectedHotspot && spotRefs.current[selectedHotspot]) {
      spotRefs.current[selectedHotspot]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [selectedHotspot]);

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    spotId: string
  ) => {
    if (e.target.files && e.target.files[0]) {
      onSpotImageUpload(e, spotId);
    }
  };

  return (
    <Sidebar
      side="right"
      collapsible="none"
      className="w-96 h-[90vh] bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-2 border-b border-gray-200 dark:border-gray-700"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            Spots
          </h2>
          <span className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full">
            {hotspots.length} total
          </span>
        </div>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage your floor map spots
        </p>
      </motion.div>

      {/* Spots List */}
      <SpotList
        hotspots={hotspots}
        selectedHotspot={selectedHotspot}
        onDeleteSpot={onDeleteSpot}
        onSpotImageUpload={onSpotImageUpload}
        onSpotNameChange={onSpotNameChange}
      />
      <div className="flex-1 overflow-y-auto px-4 py-2">
        <AnimatePresence mode="popLayout">
          {hotspots.map((spot, index) => (
            <motion.div
              key={spot.id}
              ref={(el) => (spotRefs.current[spot.id] = el)}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 30,
                delay: index * 0.05,
              }}
              className={`
                mt-4 p-4 rounded-lg border 
                ${
                  selectedHotspot === spot.id
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md"
                    : "border-gray-200 dark:border-gray-700"
                }
                transition-all duration-200 hover:shadow-lg
              `}
            >
              {/* Spot Header */}
              <div className="flex items-center gap-3 mb-3">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold
                    ${
                      selectedHotspot === spot.id
                        ? "bg-blue-500"
                        : "bg-gray-500"
                    }
                    transition-colors duration-200
                  `}
                >
                  {index + 1}
                </motion.div>
                <input
                  type="text"
                  value={spot.label}
                  onChange={(e) => onSpotNameChange(spot.id, e.target.value)}
                  className="flex-1 px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 
                    bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100
                    focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                    transition-all duration-200"
                  placeholder="Enter spot name"
                />
              </div>

              {/* Image Upload Area */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className={`
                  relative mt-2 p-4 rounded-lg border-2 border-dashed
                  ${
                    spot.url
                      ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                      : "border-gray-300 dark:border-gray-600"
                  }
                  hover:border-blue-500 dark:hover:border-blue-400
                  transition-all duration-200
                `}
              >
                <input
                  type="file"
                  onChange={(e) => handleImageUpload(e, spot.id)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  accept="image/*"
                />
                <div className="flex items-center justify-center gap-2 text-gray-500 dark:text-gray-400">
                  <ImageIcon className="w-5 h-5" />
                  <span className="text-sm">
                    {spot.url ? "Change image" : "Upload spot image"}
                  </span>
                </div>
              </motion.div>

              {/* Preview & Actions */}
              <AnimatePresence>
                {spot.url && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3"
                  >
                    <div className="relative w-full h-32 rounded-lg overflow-hidden">
                      <Image
                        src={spot.url}
                        alt={spot.label || ""}
                        className="w-full h-full object-cover"
                      />
                      <div
                        className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 
                        transition-opacity duration-200 flex items-center justify-center gap-2"
                      >
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => onSpotImageUpload(null, spot.id)}
                          className="p-2 rounded-full bg-white/20 hover:bg-white/40 
                            transition-colors duration-200"
                        >
                          <Edit2 className="w-4 h-4 text-white" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => onDeleteSpot(spot.id)}
                          className="p-2 rounded-full bg-red-500/20 hover:bg-red-500/40 
                            transition-colors duration-200"
                        >
                          <Trash2 className="w-4 h-4 text-white" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Empty State */}
        {hotspots.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center h-[60vh] text-gray-500 dark:text-gray-400"
          >
            <ImageIcon className="w-12 h-12 mb-4 opacity-50" />
            <p className="text-lg font-medium">No spots added yet</p>
            <p className="text-sm">Click the Add Spot button to get started</p>
          </motion.div>
        )}
      </div>
    </Sidebar>
  );
};

export default RightSidebar;
