import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { devtools } from 'zustand/middleware'
import { Project } from '@prisma/client'

interface ProjectState {
  projects: Project[]
  currentProject: Project | null
  loading: boolean
  error: string | null
  setCurrentProject: (project: Project | null) => void
  setLoading: (loading: boolean) => void
  setProjects: (projects: Project[]) => void
  addProject: (project: Project) => void
  removeProject: (id: string) => void
  updateProject: (id: string, project: Partial<Project>) => void
}

export const useProjectStore = create<ProjectState>()(
  devtools(
    persist(
      (set) => ({
        projects: [],
        currentProject:null,
        loading: false,
        error: null,
        setLoading: (loading) => set({ loading }),
        setProjects: (projects) => set({ projects }),
        setCurrentProject: (project) => set({ currentProject: project }),
        addProject: (project) =>
          set((state) => ({
            projects: [...state.projects, project],
          })),
        removeProject: (id) =>
          set((state) => ({
            projects: state.projects.filter((p) => p.id !== id),
          })),
        updateProject: (id, updatedProject) =>
          set((state) => ({
            projects: state.projects.map((p) =>
              p.id === id ? { ...p, ...updatedProject } : p
            ),
          })),
      }),
      {
        name: 'project-storage',
      }
    )
  )
)