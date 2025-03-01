import { api } from "@/lib/api";
import { ProjectsResponse } from "@/types";

export const projectApi = {
  getProjects: () => api.get<ProjectsResponse>("/project/get"),
  getProject: (id: string) => api.get(`/project/get/${id}`),
};
