import { Project } from "@prisma/client"

export interface ApiResponse<T> {
    success: boolean
    data?: T
    error?: string
  }
  
export interface ProjectsResponse extends ApiResponse<Project[]> {
    projects?: Project[]
  }