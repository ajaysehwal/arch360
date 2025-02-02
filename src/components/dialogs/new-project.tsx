import React, { JSX, useState } from "react";
import { useUser } from "@clerk/nextjs";
import axios, { AxiosError } from "axios";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Upload, Image, X, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Project } from "@prisma/client";
interface FileUploadBoxProps {
  file: File | null;
  setFile: (file: File | null) => void;
  title: string;
  isOptional?: boolean;
  isDragging: boolean;
  setIsDragging: (isDragging: boolean) => void;
}

interface UploadResponse {
  success: boolean;
  url: string;
}

interface CreateProjectResponse {
  success: boolean;
  error?: string;
  project?: Project;
}

const FileUploadBox: React.FC<FileUploadBoxProps> = ({
  file,
  setFile,
  title,
  isOptional = false,
  isDragging,
  setIsDragging,
}) => {
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile?.type.startsWith("image/")) {
      setFile(droppedFile);
    }
    setIsDragging(false);
  };

  return (
    <div
      className={`
        relative rounded-lg border-2 border-dashed p-6
        transition-all duration-200 ease-in-out
        hover:border-primary/50 hover:bg-primary/5
        ${isDragging ? "border-primary bg-primary/10" : "border-border"}
        ${file ? "border-success bg-success/5" : ""}
      `}
      onDragOver={(e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept="image/*"
        className="absolute inset-0 opacity-0 cursor-pointer"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setFile(e.target.files?.[0] || null)
        }
      />
      <div className="flex flex-col items-center justify-center space-y-3 text-center">
        {file ? (
          <>
            <div className="relative p-4 bg-success/10 rounded-full">
              <Image className="h-8 w-8 text-success" />
            </div>
            <div>
              <p className="font-medium text-success">{file.name}</p>
              <p className="text-xs text-success/80">
                Click or drag to replace
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                setFile(null);
              }}
              className="absolute top-2 right-2 hover:bg-error/10 hover:text-error"
            >
              <X className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <>
            <div className="p-4 bg-muted/30 rounded-full">
              <Upload className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium">
                {title}{" "}
                {isOptional && (
                  <span className="text-muted-foreground">(Optional)</span>
                )}
              </p>
              <p className="text-sm text-muted-foreground">
                Drop your file here or click to browse
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export function NewProject(): JSX.Element {
  const [projectName, setProjectName] = useState<string>("");
  const [floorPlan, setFloorPlan] = useState<File | null>(null);
  const [topView, setTopView] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const { user } = useUser();
  const router = useRouter();
  const uploadImage = async (file: File): Promise<string> => {
    if (!user) throw new Error("User not found");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("user_id", user.id);

    try {
      const { data } = await axios.post<UploadResponse>(
        "/api/upload",
        formData
      );
      if (!data.success) throw new Error("Upload failed");
      return data.url;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || "Upload failed");
      }
      throw error;
    }
  };

  const handleSubmit = async (): Promise<void> => {
    if (!projectName || !floorPlan) {
      setError("Please provide a project name and floor plan");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const floor_plan = await uploadImage(floorPlan);
      const top_view = topView ? await uploadImage(topView) : null;

      const { data } = await axios.post<CreateProjectResponse>(
        "/api/project/create",
        {
          name: projectName,
          floor_map_url: floor_plan,
          top_view_url: top_view,
        }
      );

      if (!data.success) {
        throw new Error(data.error || "Failed to create project");
      }
      setProjectName("");
      setFloorPlan(null);
      setTopView(null);
      setOpen(false);
      router.push(`/studio/project/${data?.project?.id}`);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to create project"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open}>
      <DialogTrigger onClick={() => setOpen(true)} asChild>
        <Button
          size="sm"
          className="gap-2 hover:scale-105 transition-transform"
        >
          <Plus className="h-5 w-5" /> New Project
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Create New Project
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Start your new project by uploading your floor plan and optional top
            view.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="projectName" className="text-sm font-medium">
              Project Name
            </Label>
            <Input
              id="projectName"
              placeholder="Enter a memorable name for your project"
              value={projectName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setProjectName(e.target.value)
              }
              className="h-12 text-lg"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <FileUploadBox
              file={floorPlan}
              setFile={setFloorPlan}
              title="Floor Plan"
              isDragging={isDragging}
              setIsDragging={setIsDragging}
            />
            <FileUploadBox
              file={topView}
              setFile={setTopView}
              title="Top View"
              isOptional
              isDragging={isDragging}
              setIsDragging={setIsDragging}
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            onClick={() => setOpen(false)}
            variant="outline"
            type="button"
            className="hover:bg-muted/50"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="gap-2 min-w-[120px]"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="animate-pulse flex gap-2 items-center">
                <Loader2 className="animate-spin" />
                Creating...
              </div>
            ) : (
              <>
                <Plus className="h-4 w-4" /> Create Project
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
