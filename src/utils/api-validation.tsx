import { MAX_FILE_SIZE, ALLOWED_FILE_TYPES } from "@/constants/server";
export const sanitizeFileName = (fileName: string): string => {
  return fileName.replace(/[^a-zA-Z0-9.-]/g, "");
};
export const validateFile = (file: File, userId: string): string | null => {
  if (!file) return "No file provided";
  if (!userId) return "No user ID provided";
  if (file.size > MAX_FILE_SIZE) return "File size exceeds limit";
  if (!ALLOWED_FILE_TYPES.includes(file.type)) return "Invalid file type";
  return null;
};
