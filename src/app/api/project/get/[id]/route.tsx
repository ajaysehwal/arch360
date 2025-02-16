import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"

interface RouteParams {
  params: Promise<{
    id: string
  }>
}


export async function GET(req: Request, { params }: RouteParams) {
  try {
    const { userId } = await auth()
    const projectId = (await params).id
    if (!userId) {
      return NextResponse.json({
        success: false,
        message: "Unauthorized"
      }, { status: 401 })
    }

    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
        ownerId: userId
      },

      include: {
        hotspots: true
      }
    })


    if (!project) {
      return NextResponse.json({
        success: false,
        message: "Project not found"
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      project,
      message: "Project fetched successfully"
    })

  } catch (error) {
    console.error("[Project Fetch Error]:", error)
    return NextResponse.json({
      success: false,
      message: "Failed to fetch project"
    }, { status: 500 })
  }
}