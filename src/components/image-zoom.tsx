import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface ImageZoomProps {
  src: string;
  alt: string;
}

const ImageZoom: React.FC<ImageZoomProps> = ({ src, alt }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState<number>(1);
  const [origin, setOrigin] = useState<{ x: number; y: number }>({ x: 0.5, y: 0.5 });

  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    const delta = -event.deltaY * 0.001;
    const newScale = Math.min(Math.max(scale + delta, 1), 3); // Restrict zoom range
    setScale(newScale);

    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const offsetX = (event.clientX - rect.left) / rect.width;
      const offsetY = (event.clientY - rect.top) / rect.height;
      setOrigin({ x: offsetX, y: offsetY });
    }
  };

  const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    if (event.touches.length === 2 && containerRef.current) {
      const [touch1, touch2] = Array.from(event.touches);
      const distance = Math.hypot(
        touch2.pageX - touch1.pageX,
        touch2.pageY - touch1.pageY
      );

      if ((containerRef.current as any).lastDistance) {
        const delta = distance - (containerRef.current as any).lastDistance;
        const newScale = Math.min(Math.max(scale + delta * 0.001, 1), 3);
        setScale(newScale);
      }

      (containerRef.current as any).lastDistance = distance;
    }
  };

  const handleTouchEnd = () => {
    if (containerRef.current) {
      (containerRef.current as any).lastDistance = null;
    }
  };

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative flex items-center justify-center w-full h-full overflow-hidden touch-none bg-gray-100"
    >
      <motion.img
        src={src}
        alt={alt}
        style={{
          transformOrigin: `${origin.x * 100}% ${origin.y * 100}%`,
          scale,
        }}
        initial={{ scale: 1 }}
        animate={{ scale }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="max-w-full max-h-full select-none pointer-events-none shadow-lg rounded-lg"
      />
    </div>
  );
};

export default ImageZoom;
