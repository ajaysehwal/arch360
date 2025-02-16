import { useState, useRef, useEffect } from 'react';
import { Hotspots } from '@prisma/client';
import axios from 'axios';

interface Position {
  x: number;
  y: number;
}

export const useHotspots = (projectId: string) => {
  const [hotspots, setHotspots] = useState<Hotspots[]>([]);
  const [selectedHotspot, setSelectedHotspot] = useState<string | null>(null);
  const [isAddingHotspot, setIsAddingHotspot] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const spotRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Fetch initial hotspots
  useEffect(() => {
    const fetchHotspots = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`/api/project/${projectId}/get`);
        setHotspots(response.data);
      } catch (error) {
        console.error('Failed to fetch hotspots:', error);
        setHotspots([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (projectId) {
      fetchHotspots();
    }
  }, [projectId]);

  useEffect(() => {
    if (selectedHotspot && spotRefs.current[selectedHotspot]) {
      spotRefs.current[selectedHotspot]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [selectedHotspot]);

  const handleAddHotspot = (position: Position) => {
    const newHotspot: Hotspots = {
      id: Date.now().toString(),
      x: position.x,
      y: position.y,
      url: "",
      projectId,
      updatedAt: new Date(),
      createdAt: new Date(),
      label: `Room ${hotspots.length + 1}`,
    };

    setHotspots(prev => [...prev, newHotspot]);
    setIsAddingHotspot(false);
  };

  const handleSpotNameChange = (id: string, newName: string) => {
    setHotspots(spots =>
      spots.map(spot => (spot.id === id ? { ...spot, label: newName } : spot))
    );
  };

  const handleDeleteSpot = (id: string) => {
    setHotspots(spots => spots.filter(spot => spot.id !== id));
    if (selectedHotspot === id) {
      setSelectedHotspot(null);
    }
  };

  const handleSpotSelect = (id: string) => {
    setSelectedHotspot(selectedHotspot === id ? null : id);
  };

  const handleSpotImageUpload = (url: string | null, spotId: string) => {
    setHotspots(spots =>
      spots.map(spot =>
        spot.id === spotId ? { ...spot, url: url || "" } : spot
      )
    );
  };

  return {
    hotspots,
    selectedHotspot,
    isAddingHotspot,
    isLoading,
    spotRefs,
    handleAddHotspot,
    handleSpotNameChange,
    handleDeleteSpot,
    handleSpotSelect,
    handleSpotImageUpload,
    setIsAddingHotspot,
  };
};