import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useControls } from "react-zoom-pan-pinch";

export const ToolBar = () => {
  const { zoomIn, zoomOut, resetTransform } = useControls();
  const [toolbarPosition, setToolbarPosition] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);

  return (
    <div
      className={`absolute flex items-center bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm 
                      rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 transition-all duration-200 
                      ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
      style={{
        left: `${toolbarPosition.x}px`,
        top: `${toolbarPosition.y}px`,
        transform: "translate(0, 0)",
        touchAction: "none",
        transition: isDragging ? "none" : "all 0.2s ease-out",
      }}
    >
      <Button onClick={()=>zoomIn()}>Zoom In</Button>
      <Button onClick={()=>zoomOut()}>Zoom Out</Button>
      <Button onClick={()=>resetTransform()}>Reset</Button>
    </div>
  );
};
