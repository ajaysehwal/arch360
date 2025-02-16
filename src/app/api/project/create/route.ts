import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export const POST = async (req: Request) => {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json(
      {
        success: false,
        message: "Unauthorized",
      },
      { status: 401 }
    );
  }
  try {
    const { name, description, floor_map_url, top_view_url } = await req.json();
    if (!name || !floor_map_url) {
      return NextResponse.json(
        { success: false, message: "Please fill all the fields" },
        { status: 400 }
      );
    }

    const project = await prisma.project.create({
      data: {
        name,
        description,
        ownerId: userId,
        floorMapUrl: floor_map_url,
        topViewUrl: top_view_url || '',
      },
    });
    return NextResponse.json({
      success: true,
      message: "Project created successfully",
      project,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create project",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
};
