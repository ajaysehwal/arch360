export interface PanoramaState {
    isUserInteracting: boolean;
    mouse: {
      x: number;
      y: number;
      lon: number;
      lat: number;
    };
  }
  
  export interface PanoramaProps {
    imageUrl: string;
    initialFov?: number;
    minFov?: number;
    maxFov?: number;
    className?: string;
  }
  
  