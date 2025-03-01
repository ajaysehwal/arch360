// app/api/projects/[id]/save/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { Hotspot } from "@prisma/client";

export const runtime = "edge";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Get the current user using Clerk
    const { userId } = await auth();
    const projectId = (await params).id;
    // Check authentication
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }


    // Parse and validate the request body
    const {hotspots} = await request.json();
    // if (!validatedData.success) {
    //   return NextResponse.json(
    //     { error: "Invalid request data", details: validatedData.error },
    //     { status: 400 }
    //   );
    // }


    // Verify project exists and user has access
    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
        ownerId: userId, // Using Clerk userId
      },

    });

    if (!project) {
      return NextResponse.json(
        { error: "Project not found or access denied" },
        { status: 404 }
      );
    }

    // Delete existing hotspots
    await prisma.hotspot.deleteMany({
      where: {
        projectId: projectId,
      },
    });

    // Create new hotspots
    await prisma.hotspot.createMany({
        data: hotspots.map((hotspot:Hotspot) => ({

        ...hotspot,
        projectId: projectId,
      })),
    });


    return NextResponse.json(
      { message: "Hotspots saved successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error saving hotspots:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
