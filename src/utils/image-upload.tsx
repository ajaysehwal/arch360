// utils/imageUpload.ts
import axios from 'axios';
import { UploadResponse } from '@/types/api-types';

// Constants
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

// Types
export interface UploadError extends Error {
  code: 'FILE_TOO_LARGE' | 'INVALID_FILE_TYPE' | 'UPLOAD_FAILED';
  details?: any;
}

// Helper functions
export const validateImageFile = (file: File): void => {
  if (file.size > MAX_FILE_SIZE) {
    const error: UploadError = new Error('File size exceeds 5MB limit') as UploadError;
    error.code = 'FILE_TOO_LARGE';
    throw error;
  }

  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    const error: UploadError = new Error('Invalid file type. Please upload a JPEG, PNG, or WebP image') as UploadError;
    error.code = 'INVALID_FILE_TYPE';
    throw error;
  }
};

export const createFormData = (file: File, userId: string): FormData => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('user_id', userId);
  return formData;
};

export const uploadImage = async (file: File, userId: string): Promise<string> => {
  try {
    // Validate the file before uploading
    validateImageFile(file);

    // Create form data
    const formData = createFormData(file, userId);

    // Upload the image
    const { data } = await axios.post<UploadResponse>(
      '/api/upload',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          // You can use this to show upload progress if needed
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 0)
          );
          console.log(`Upload progress: ${percentCompleted}%`);
        },
      }
    );

    if (!data.success || !data.url) {
      throw new Error('Upload failed');
    }

    return data.url;
  } catch (error) {
    if ((error as UploadError).code) {
      // Re-throw validation errors
      throw error;
    }

    // Handle other errors
    const uploadError: UploadError = new Error(
      'Failed to upload image'
    ) as UploadError;
    uploadError.code = 'UPLOAD_FAILED';
    uploadError.details = error;
    throw uploadError;
  }
};

// Utility function to compress images before upload if needed
export const compressImage = async (
  file: File,
  maxWidth = 1920,
  quality = 0.8
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        // Calculate new dimensions
        let width = img.width;
        let height = img.height;
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        // Set canvas dimensions
        canvas.width = width;
        canvas.height = height;

        // Draw and compress image
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to compress image'));
            }
          },
          file.type,
          quality
        );
      };
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
    };
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
  });
};

// Helper function to generate a preview URL for an image file
export const createImagePreview = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to create preview'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};

// Example usage of the upload image with error handling
export const handleImageUpload = async (
  file: File,
  userId: string,
  onProgress?: (progress: number) => void
): Promise<string> => {
  try {
    // Optionally compress the image before upload
    const compressedImage = await compressImage(file);
    const compressedFile = new File([compressedImage], file.name, {
      type: file.type,
    });

    // Upload the compressed image
    const imageUrl = await uploadImage(compressedFile, userId);
    return imageUrl;
  } catch (error) {
    const uploadError = error as UploadError;
    switch (uploadError.code) {
      case 'FILE_TOO_LARGE':
        throw new Error('Please select an image under 5MB');
      case 'INVALID_FILE_TYPE':
        throw new Error('Please select a valid image file (JPEG, PNG, or WebP)');
      case 'UPLOAD_FAILED':
        throw new Error('Failed to upload image. Please try again');
      default:
        throw new Error('An unexpected error occurred');
    }
  }
};