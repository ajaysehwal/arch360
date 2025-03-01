import React, { useState } from "react";
import { Project } from "@prisma/client";
import { format } from "date-fns";
import { Trash2 } from "lucide-react";
import { useProjectStore } from "@/store/project";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "./ui/input";

interface ProjectItemProps {
  project: Project;
}

export function ProjectItem({ project }: ProjectItemProps) {
  const { removeProject } = useProjectStore();
  const [deleteText, setDeleteText] = useState("");
  const isDeleteEnabled = deleteText.toLowerCase() === "delete";
  const handleDelete = async () => {
    try {
      await fetch(`/api/project/${project.id}/delete`, {
        method: "DELETE",
      });
      removeProject(project.id);
    } catch (error) {
      console.error("Failed to delete project:", error);
    }
  };

  return (
    <div className="relative flex flex-col items-start gap-2 p-4 border-b hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 hover:bg-red-500/10 transition-all duration-200"
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              project and all its data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Input
              value={deleteText}
              onChange={(e) => setDeleteText(e.target.value)}
              placeholder="Type 'delete' to confirm"
              className={`w-full ${
                !isDeleteEnabled && deleteText ? "border-destructive" : ""
              }`}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={!isDeleteEnabled}
              className={`bg-destructive text-destructive-foreground 
                ${
                  !isDeleteEnabled
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-destructive/90"
                }`}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <a href={`/studio/project/${project.id}`} className="flex-1">
        <div className="flex w-full items-center justify-between">
          <span className="font-medium">{project.name}</span>
          <span className="text-xs text-muted-foreground">
            {project.description}
          </span>
        </div>
        <span className="text-sm text-muted-foreground">
          {format(new Date(project.createdAt), "MMM dd, yyyy")}
        </span>
      </a>
    </div>
  );
}

export default ProjectItem;
