"use client";

import { ImageIcon, LoaderCircleIcon, Trash2Icon } from "lucide-react";
import useImageUpload from "@/hooks/useImageUpload";
import { Button } from "@/components/shadcnui/button";
import { cn } from "@/lib/utils";

type ImageUploadFieldProps = {
  kind: "avatar" | "banner" | "task";
  value: string | null;
  onChange: (url: string | null) => void;
  className?: string;
};

const ImageUploadField = ({
  kind,
  value,
  onChange,
  className,
}: ImageUploadFieldProps) => {
  const { openPicker, busy, error, clear } = useImageUpload({
    kind,
    onChange,
  });

  return (
    <div className={cn("space-y-2", className)}>
      <div className="bg-muted/40 relative overflow-hidden rounded-lg border">
        {value ?
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={value}
            alt="Uploaded image"
            className="h-full w-full object-cover"
          />
        : <div className="text-muted-foreground flex aspect-video flex-col items-center justify-center text-xs">
            <ImageIcon className="size-6" />
            No image
          </div>
        }
        {busy && (
          <div className="bg-background/60 absolute inset-0 grid place-items-center">
            <LoaderCircleIcon className="text-primary animate-spin" />
          </div>
        )}
      </div>
      {error && <p className="text-destructive text-xs">{error}</p>}
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => void openPicker()}
          disabled={busy}>
          {busy ? "Uploading..." : "Choose image"}
        </Button>
        {value && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              clear();
              onChange(null);
            }}>
            <Trash2Icon />
            Remove
          </Button>
        )}
      </div>
    </div>
  );
};

export default ImageUploadField;
