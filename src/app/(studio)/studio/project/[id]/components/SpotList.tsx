import React, { useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image as ImageIcon, Edit2, Trash2, Upload } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import { Hotspots } from '@prisma/client';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SpotListProps {
  hotspots: Hotspots[];
  selectedHotspot: string | null;
  onSpotNameChange: (id: string, value: string) => void;
  onSpotImageUpload: (file: File | null, spotId: string) => void;
  onDeleteSpot: (id: string) => void;
}

const SpotList: React.FC<SpotListProps> = ({
  hotspots,
  selectedHotspot,
  onSpotNameChange,
  onSpotImageUpload,
  onDeleteSpot,
}) => {
  const getDropzone = (spotId: string) => {
    const onDrop = useCallback((acceptedFiles: File[]) => {
      if (acceptedFiles?.[0]) {
        onSpotImageUpload(acceptedFiles[0], spotId);
      }
    }, [spotId]);

    return useDropzone({
      onDrop,
      accept: {
        'image/*': ['.jpeg', '.jpg', '.png', '.webp']
      },
      multiple: false
    });
  };

  return (
    <ScrollArea className="flex-1 h-[600px] px-2 py-2">
      <AnimatePresence mode="popLayout">
        {hotspots.map((spot, index) => {
          const { getRootProps, getInputProps, isDragActive } = getDropzone(spot.id);
          
          return (
            <motion.div
              key={spot.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ 
                type: "spring",
                stiffness: 400,
                damping: 25,
                mass: 1,
                delay: index * 0.05 
              }}
              className={`
                mt-4 rounded-xl border bg-white dark:bg-gray-800
                ${selectedHotspot === spot.id 
                  ? 'ring-2 ring-blue-500 shadow-lg shadow-blue-500/20' 
                  : 'border-gray-200 dark:border-gray-700 hover:shadow-md'
                }
                transition-all duration-300
              `}
            >
              <div className="p-4">
                {/* Spot Header */}
                <div className="flex items-center gap-3">
                  <motion.div 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className={`
                      w-10 h-10 rounded-xl flex items-center justify-center text-white font-semibold
                      ${selectedHotspot === spot.id 
                        ? 'bg-gradient-to-br from-blue-500 to-blue-600' 
                        : 'bg-gradient-to-br from-gray-500 to-gray-600'
                      }
                      shadow-sm transition-all duration-300
                    `}
                  >
                    {index + 1}
                  </motion.div>
                  <input
                    type="text"
                    value={spot.label}
                    onChange={(e) => onSpotNameChange(spot.id, e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-lg border-2 border-gray-200 dark:border-gray-700
                      bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100
                      focus:outline-none focus:border-blue-500 dark:focus:border-blue-400
                      placeholder:text-gray-400 dark:placeholder:text-gray-500
                      transition-all duration-200 text-sm"
                    placeholder="Enter spot name"
                  />
                </div>

                {/* Image Upload Area */}
                <div {...getRootProps()}>
                  <input {...getInputProps()} />
                  <motion.div 
                    whileHover={{ scale: 1.01 }}
                    className={`
                      relative mt-4 rounded-lg border-2 border-dashed
                      ${isDragActive ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' :
                        spot.url ? 'border-green-500 bg-green-50 dark:bg-green-900/20' :
                        'border-gray-300 dark:border-gray-600'
                      }
                      transition-all duration-200 cursor-pointer
                      ${!spot.url ? 'hover:bg-gray-50 dark:hover:bg-gray-700/50' : ''}
                    `}
                  >
                    {!spot.url ? (
                      <div className="p-6 flex flex-col items-center justify-center gap-2 text-gray-500 dark:text-gray-400">
                        <motion.div
                          animate={isDragActive ? { y: [-2, 2, -2] } : {}}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                        >
                          <Upload className="w-8 h-8 mb-2 opacity-75" />
                        </motion.div>
                        <p className="text-sm font-medium">
                          {isDragActive ? 'Drop image here' : 'Drag & drop image here'}
                        </p>
                        <p className="text-xs opacity-75">or click to browse</p>
                      </div>
                    ) : (
                      <div className="relative group">
                        <motion.div 
                          layoutId={`image-${spot.id}`}
                          className="relative w-full h-40 rounded-lg overflow-hidden"
                        >
                          <Image
                            src={spot.url}
                            alt={spot.label || ""}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent 
                            opacity-0 group-hover:opacity-100 transition-opacity duration-300
                            flex items-center justify-center gap-3">
                            <motion.button 
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              className="p-2 rounded-xl bg-white/20 hover:bg-white/40 
                                backdrop-blur-sm transition-all duration-200"
                              onClick={(e) => {
                                e.stopPropagation();
                                onSpotImageUpload(null, spot.id);
                              }}
                            >
                              <Edit2 className="w-5 h-5 text-white" />
                            </motion.button>
                            <motion.button 
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              className="p-2 rounded-xl bg-red-500/20 hover:bg-red-500/40 
                                backdrop-blur-sm transition-all duration-200"
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteSpot(spot.id);
                              }}
                            >
                              <Trash2 className="w-5 h-5 text-white" />
                            </motion.button>
                          </div>
                        </motion.div>
                      </div>
                    )}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Empty State */}
      {hotspots.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center h-[60vh]"
        >
          <div className="p-8 rounded-2xl bg-gray-50 dark:bg-gray-800/50 text-center">
            <motion.div
              animate={{ 
                y: [0, -5, 0],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 2,
                ease: "easeInOut"
              }}
            >
              <ImageIcon className="w-16 h-16 mb-4 text-gray-400 dark:text-gray-500" />
            </motion.div>
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
              No spots added yet
            </h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Click the Add Spot button to get started
            </p>
          </div>
        </motion.div>
      )}
    </ScrollArea>
  );
};

export default SpotList;