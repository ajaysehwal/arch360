// hooks/useProject.ts
import { useState, useEffect } from 'react';
import { useProjectStore } from '@/store/project';
import { projectApi } from '@/utils/requests';

export const useProject = (projectId: string) => {
  const [loading, setLoading] = useState(false);
  const { setCurrentProject, currentProject: project } = useProjectStore();

  useEffect(() => {
    async function fetchProject() {
      setLoading(true);
      try {
        const project = await getProject(projectId);
        setCurrentProject(project);
      } catch (error) {
        console.error('Failed to fetch project:', error);
      } finally {
        setLoading(false);
      }
    }

    if (projectId) {
      fetchProject();
    }
  }, [projectId, setCurrentProject]);

  return { project, loading };
};

async function getProject(id: string) {
  try {
    const { data } = await projectApi.getProject(id);
    return data.project;
  } catch (error) {
    console.error('Failed to fetch project:', error);
    return null;
  }
}