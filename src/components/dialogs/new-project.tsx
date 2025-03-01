/* eslint-disable jsx-a11y/alt-text */
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

interface FileUploadBoxProps {
  file: File | null;
  setFile: (file: File | null) => void;
  title: string;
  isOptional?: boolean;
  isDragging: boolean;
  setIsDragging: (isDragging: boolean) => void;
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
        group relative overflow-hidden rounded-xl border-2 border-dashed p-6
        transition-all duration-300 ease-out
        hover:border-primary hover:bg-primary/5
        ${isDragging ? "scale-102 border-primary bg-primary/10" : "border-slate-200 dark:border-slate-800"}
        ${file ? "border-emerald-500 bg-emerald-50/50 dark:border-emerald-500/50 dark:bg-emerald-950/20" : ""}
      `}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept="image/*"
        className="absolute inset-0 cursor-pointer opacity-0"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        {file ? (
          <>
            <div className="relative rounded-full bg-emerald-100 p-4 dark:bg-emerald-950/50">
              <Image className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="font-medium text-emerald-600 dark:text-emerald-400">{file.name}</p>
              <p className="mt-1 text-xs text-emerald-600/80 dark:text-emerald-400/80">
                Click or drag to replace
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setFile(null);
              }}
              className="absolute right-2 top-2 h-8 w-8 rounded-full p-0 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-950/50"
            >
              <X className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <>
            <div className="rounded-full bg-slate-100 p-4 transition-transform group-hover:scale-110 dark:bg-slate-800">
              <Upload className="h-8 w-8 text-slate-600 dark:text-slate-400" />
            </div>
            <div>
              <p className="font-medium text-slate-900 dark:text-slate-100">
                {title}{" "}
                {isOptional && (
                  <span className="text-slate-500 dark:text-slate-400">(Optional)</span>
                )}
              </p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
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

  const handleSubmit = async (): Promise<void> => {
    if (!projectName || !floorPlan) {
      setError("Please provide a project name and floor plan");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", floorPlan);
      formData.append("user_id", user?.id || "");

      const floor_plan = await uploadImage(floorPlan);
      const top_view = topView ? await uploadImage(topView) : null;

      const { data } = await axios.post("/api/project/create", {
        name: projectName,
        floor_map_url: floor_plan,
        top_view_url: top_view,
      });

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

  const uploadImage = async (file: File): Promise<string> => {
    if (!user) throw new Error("User not found");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("user_id", user.id);

    try {
      const { data } = await axios.post("/api/upload", formData);
      if (!data.success) throw new Error("Upload failed");
      return data.url;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || "Upload failed");
      }
      throw error;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
      <Button
        size="sm"
        className="group relative rounded-lg bg-purple-600 px-4 py-2 hover:bg-purple-700 text-white transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] dark:bg-purple-500"
      >
        <span className="relative flex items-center gap-2">
          <Plus className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
          New Project
          <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-400/0 via-purple-400/30 to-purple-400/0 opacity-0 group-hover:animate-shine" />
        </span>
      </Button>


      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-3xl font-bold text-transparent">
            Create New Project
          </DialogTitle>
          <DialogDescription className="text-base text-slate-500 dark:text-slate-400">
            Start your new project by uploading your floor plan and optional top view.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-6">
          {error && (
            <Alert variant="destructive" className="animate-shake border-red-500/50 bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400">
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
              onChange={(e) => setProjectName(e.target.value)}
              className="h-12 text-lg transition-shadow duration-300 focus:ring-4 focus:ring-primary/20 dark:focus:ring-primary/10"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
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

        <DialogFooter className="gap-2 sm:gap-3">
          <Button
            onClick={() => setOpen(false)}
            variant="outline"
            type="button"
            className="hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="min-w-[140px] gap-2 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/20"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="animate-pulse">Creating...</span>
              </div>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                Create Project
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}