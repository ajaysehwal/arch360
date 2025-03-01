"use client";
import {
  createContext,
  useContext,
  useEffect,
  ReactNode,
  useState,
} from "react";
import { useProjectStore } from "@/store/project";
import { projectApi } from "@/utils/requests";

interface GlobalContextType {
  initialized: boolean;
}

const GlobalContext = createContext<GlobalContextType>({ initialized: false });

export const useGlobal = () => useContext(GlobalContext);

interface GlobalProviderProps {
  children: ReactNode;
}

export function GlobalProvider({ children }: GlobalProviderProps) {
  const { setProjects, setLoading, projects } = useProjectStore();
  const [initialized, setInitialized] = useState(false);
  const initializeApp = async () => {
    if (initialized || projects.length > 0) return;
    setLoading(true);

    try {
      const { data } = await projectApi.getProjects();
      if (data.success && data.projects) {
        setProjects(data.projects);
      }
    } catch (err) {
      console.error("Failed to fetch projects:", err);
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  };

  useEffect(() => {
    initializeApp();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialized]);

  return (
    <GlobalContext.Provider value={{ initialized }}>
      {children}
    </GlobalContext.Provider>
  );
}
