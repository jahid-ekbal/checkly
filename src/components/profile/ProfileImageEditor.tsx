"use client";

import { useState } from "react";
import { ImageIcon, LoaderCircleIcon, PencilIcon, XIcon } from "lucide-react";
import useImageUpload from "@/hooks/useImageUpload";
import { updateProfileImageAction } from "@/server/actions/profile-actions";
import { toast } from "@/components/shadcnui/toast";
import { cn } from "@/lib/utils";

type ProfileImageEditorProps = {
  field: "image" | "banner";
  initial: string | null;
  className?: string;
  imageClassName?: string;
  emptyClassName?: string;
};

const ProfileImageEditor = ({
  field,
  initial,
  className,
  imageClassName,
  emptyClassName,
}: ProfileImageEditorProps) => {
  const [value, setValue] = useState<string | null>(initial);
  const [saving, setSaving] = useState(false);

  const { openPicker, busy, error } = useImageUpload({
    kind: field === "image" ? "avatar" : "banner",
    onChange: async (url) => {
      if (!url) return;
      setSaving(true);
      const result = await updateProfileImageAction(field, url);
      setSaving(false);
      if (result.error) {
        toast.add({ title: "Upload failed", description: result.error });
        return;
      }
      setValue(url);
      toast.add({
        title: "Image updated",
        description: "Your image was saved.",
      });
    },
  });

  const remove = async () => {
    setSaving(true);
    const result = await updateProfileImageAction(field, null);
    setSaving(false);
    if (result.error) {
      toast.add({ title: "Update failed", description: result.error });
      return;
    }
    setValue(null);
    toast.add({
      title: "Image removed",
      description: "Your image was removed.",
    });
  };

  const overlayBusy = busy || saving;

  return (
    <div className={cn("group relative", className)}>
      {value ?
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={value}
          alt={field === "image" ? "Profile picture" : "Profile banner"}
          className={cn("h-full w-full object-cover", imageClassName)}
        />
      : <div
          className={cn(
            "bg-muted/40 grid h-full w-full place-items-center",
            emptyClassName,
          )}>
          <ImageIcon className="text-muted-foreground size-6" />
        </div>
      }

      {overlayBusy && (
        <div className="bg-background/60 absolute inset-0 grid place-items-center">
          <LoaderCircleIcon className="text-primary animate-spin" />
        </div>
      )}

      <button
        type="button"
        aria-label="Change image"
        onClick={() => void openPicker()}
        disabled={overlayBusy}
        className="bg-background/80 hover:bg-background text-foreground absolute right-2 bottom-2 grid size-8 place-items-center rounded-full border shadow-sm transition-colors">
        <PencilIcon className="size-4" />
      </button>

      {value && (
        <button
          type="button"
          aria-label="Remove image"
          onClick={() => void remove()}
          disabled={overlayBusy}
          className="bg-background/80 hover:bg-destructive hover:text-destructive-foreground absolute top-2 right-2 grid size-8 place-items-center rounded-full border shadow-sm transition-colors">
          <XIcon className="size-4" />
        </button>
      )}

      {error && (
        <p className="text-destructive absolute bottom-2 left-2 text-xs">
          {error}
        </p>
      )}
    </div>
  );
};

export default ProfileImageEditor;
