"use client";

import { useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { getPublicImageUrl } from "@/lib/supabase/storage";

export function ImageUploader({
  objectPathPrefix,
  initialPath,
}: {
  objectPathPrefix: string;
  initialPath?: string | null;
}) {
  const [path, setPath] = useState(initialPath ?? "");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    const supabase = createClient();
    const objectPath = `${objectPathPrefix}/${Date.now()}-${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from("menu-images")
      .upload(objectPath, file, { upsert: true });

    setIsUploading(false);

    if (uploadError) {
      setError(uploadError.message);
      return;
    }

    setPath(objectPath);
  }

  return (
    <div className="flex flex-col gap-2">
      <input type="hidden" name="image_path" value={path} />
      {path && (
        <Image
          src={getPublicImageUrl(path)}
          alt=""
          width={120}
          height={120}
          className="h-28 w-28 rounded-xl object-cover"
        />
      )}
      <input
        type="file"
        accept="image/*"
        onChange={handleChange}
        disabled={isUploading}
        className="text-sm"
      />
      {isUploading && (
        <span className="text-sm text-black/60 dark:text-white/60">Yükleniyor…</span>
      )}
      {error && <span className="text-sm text-red-600 dark:text-red-400">{error}</span>}
    </div>
  );
}
