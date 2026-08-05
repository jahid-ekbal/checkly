"use client";

import { useState } from "react";
import { useFilePicker } from "use-file-picker";
import {
  FileSizeValidator,
  FileTypeValidator,
} from "use-file-picker/validators";
import { uploadImageAction } from "@/server/actions/upload-actions";

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
      const result = await uploadImageAction({
        data: filesContent[0].content,
        kind,
      });
      setUploading(false);
      if (result.error) {
        setError(result.error);
        return;
      }
      onChange(result.url ?? null);
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
