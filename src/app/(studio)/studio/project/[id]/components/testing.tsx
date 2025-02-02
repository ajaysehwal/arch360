import React, { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, ImageIcon, Plus } from 'lucide-react';
import Image from 'next/image';

const FloorPlanViewer = () => {
  const [floorPlan, setFloorPlan] = useState<string | null>(null);
  const [hotspots, setHotspots] = useState<Array<{
    id: string;
    x: number;
    y: number;
    roomImage: string | null;
    label: string;
  }>>([]);
  const [isAddingHotspot, setIsAddingHotspot] = useState(false);
  const [selectedHotspot, setSelectedHotspot] = useState<string | null>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  const handleFloorPlanUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFloorPlan(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isAddingHotspot || !imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    const newHotspot = {
      id: Date.now().toString(),
      x,
      y,
      roomImage: null,
      label: `Room ${hotspots.length + 1}`,
    };

    setHotspots([...hotspots, newHotspot]);
    setIsAddingHotspot(false);
  };

  const handleRoomImageUpload = (event: React.ChangeEvent<HTMLInputElement>, hotspotId: string) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setHotspots(hotspots.map(hotspot => 
          hotspot.id === hotspotId 
            ? { ...hotspot, roomImage: reader.result as string }
            : hotspot
        ));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card className="w-full max-w-4xl p-6">
      <div className="space-y-6">
        {!floorPlan ? (
          <div className="border-2 border-dashed rounded-lg p-12 text-center">
            <input
              type="file"
              accept="image/*"
              onChange={handleFloorPlanUpload}
              className="hidden"
              id="floor-plan-upload"
            />
            <label
              htmlFor="floor-plan-upload"
              className="flex flex-col items-center cursor-pointer"
            >
              <Upload className="w-12 h-12 mb-4 text-gray-400" />
              <span className="text-lg font-medium">Upload Floor Plan</span>
              <span className="text-sm text-gray-500">Click to upload or drag and drop</span>
            </label>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Button
                onClick={() => setIsAddingHotspot(!isAddingHotspot)}
                variant={isAddingHotspot ? "destructive" : "default"}
              >
                <Plus className="w-4 h-4 mr-2" />
                {isAddingHotspot ? 'Cancel' : 'Add Room Marker'}
              </Button>
              <input
                type="file"
                accept="image/*"
                onChange={handleFloorPlanUpload}
                className="hidden"
                id="floor-plan-update"
              />
              <label htmlFor="floor-plan-update">
                <Button variant="outline" asChild>
                  <span>
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Change Floor Plan
                  </span>
                </Button>
              </label>
            </div>

            <div 
              ref={imageRef}
              className="relative border rounded-lg overflow-hidden cursor-pointer"
              onClick={handleImageClick}
            >
              <Image 
                src={floorPlan} 
                alt="Floor Plan" 
                className="w-full h-auto"
              />
              {hotspots.map((hotspot) => (
                <div
                  key={hotspot.id}
                  className={`absolute w-6 h-6 -ml-3 -mt-3 rounded-full flex items-center justify-center 
                    ${selectedHotspot === hotspot.id ? 'bg-blue-500' : 'bg-red-500'} 
                    hover:bg-blue-600 cursor-pointer transition-colors`}
                  style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedHotspot(selectedHotspot === hotspot.id ? null : hotspot.id);
                  }}
                >
                  <span className="text-white text-xs font-bold">{hotspots.indexOf(hotspot) + 1}</span>
                </div>
              ))}
            </div>

            {selectedHotspot && (
              <div className="border rounded-lg p-4">
                {(() => {
                  const hotspot = hotspots.find(h => h.id === selectedHotspot);
                  if (!hotspot) return null;

                  return (
                    <div className="space-y-4">
                      <h3 className="font-medium">Room {hotspots.indexOf(hotspot) + 1}</h3>
                      {!hotspot.roomImage ? (
                        <div className="border-2 border-dashed rounded-lg p-6 text-center">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleRoomImageUpload(e, hotspot.id)}
                            className="hidden"
                            id={`room-image-${hotspot.id}`}
                          />
                          <label
                            htmlFor={`room-image-${hotspot.id}`}
                            className="flex flex-col items-center cursor-pointer"
                          >
                            <Upload className="w-8 h-8 mb-2 text-gray-400" />
                            <span className="text-sm">Upload Room Image</span>
                          </label>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Image
                            src={hotspot.roomImage}
                            alt={`Room ${hotspots.indexOf(hotspot) + 1}`}
                            className="w-full h-auto rounded-lg"
                          />
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleRoomImageUpload(e, hotspot.id)}
                            className="hidden"
                            id={`room-image-update-${hotspot.id}`}
                          />
                          <label htmlFor={`room-image-update-${hotspot.id}`}>
                            <Button variant="outline" className="w-full">
                              <ImageIcon className="w-4 h-4 mr-2" />
                              Change Room Image
                            </Button>
                          </label>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default FloorPlanViewer;