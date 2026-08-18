"use client";

import { useState } from "react";
import { useFilePicker } from "use-file-picker";
import {
  FileSizeValidator,
  FileTypeValidator,
} from "use-file-picker/validators";
import { apiFetch } from "@/lib/api";

type UseImageUploadOptions = {
  kind: "avatar" | "banner" | "task";
  onChange: (url: string | null) => void;
};

const useImageUpload = ({ kind, onChange }: UseImageUploadOptions) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { openFilePicker, loading, clear } = useFilePicker({
    readAs: "DataURL",
    accept: "image/*",
    multiple: false,
    validators: [
      new FileTypeValidator(["jpg", "jpeg", "png", "webp"]),
      new FileSizeValidator({ maxFileSize: 5 * 1024 * 1024 }),
    ],
    onFilesSuccessfullySelected: async ({ filesContent }) => {
      setError(null);
      setUploading(true);
      try {
        const result = await apiFetch<{ url: string }>("/api/upload", {
          method: "POST",
          body: JSON.stringify({
            data: filesContent[0].content,
            kind,
          }),
        });
        onChange(result.url);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed");
      }
      setUploading(false);
    },
    onFilesRejected: () => {
      setError("Only JPG, PNG, or WebP images up to 5MB are allowed");
    },
  });

  return {
    openPicker: openFilePicker,
    busy: loading || uploading,
    error,
    clear,
  };
};

export default useImageUpload;
