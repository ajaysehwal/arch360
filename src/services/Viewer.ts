import { VirtualTourPlugin } from "@photo-sphere-viewer/virtual-tour-plugin";
import { Viewer } from "@photo-sphere-viewer/core";
import { Hotspot } from "@prisma/client";

type Node = {
  id: string;
  panorama: string;
  links: { nodeId: string; position?: { textureX: number; textureY: number } }[]; // ✅ Fixed type
};

export class TourViewer {
  private viewer: Viewer;
  private nodes: Node[];

  constructor(hotspots: Hotspot[], containerId: string) {
    this.nodes = this.getNodes(hotspots);
    this.viewer = new Viewer({
      container: document.getElementById(containerId) as HTMLElement, // ✅ Ensure valid element
      plugins: [
        [
          VirtualTourPlugin,
          {
            nodes: this.nodes,
          },
        ],
      ],
    });
  }

  public startTour() {
    return this.viewer;
  }

  private getNodes(hotspots: Hotspot[]): Node[] {
    const nodes: Node[] = [];

    hotspots.forEach((hotspot, index) => {
      const links = hotspots
        .filter((_, i) => i !== index) // Avoid linking to itself
        .map((target) => ({
          nodeId: target.id,
          position: { textureX: target.x, textureY: target.y },
        }));

      nodes.push({
        id: hotspot.id,
        panorama: `${process.env.NEXT_PUBLIC_URL}/api/image/${hotspot.url.split(".r2.dev")[1]}`,
        links: links, // ✅ Now linking to other nodes

      });
    });


    return nodes;
  }
}
