"use client";
/* eslint-disable @next/next/no-img-element */

import { ImageIcon, Upload, X } from "lucide-react";
import { useRef } from "react";

type Props = {
  previewUrl: string | null;
  onChange: (file: File | null, previewUrl: string | null) => void;
};

export default function ThumbnailUploadSection({ previewUrl, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File | null) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    onChange(file, url);
  };

  const clearFile = () => {
    onChange(null, null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <section className="rounded-lg border border-[#dce7f2] bg-white p-4">
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-[#587189]">
        Thumbnail Image
      </h3>

      {previewUrl ? (
        <div className="relative overflow-hidden rounded-lg border border-[#dce7f2]">
          <img src={previewUrl} alt="thumbnail" className="h-56 w-full object-cover" />
          <button
            type="button"
            onClick={clearFile}
            className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#fdeeee] text-[#db6f6f] hover:bg-[#f4d7d7]"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <div
          role="button"
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
          className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#c0d8ee] bg-[#f8fbff] py-10 text-center hover:border-[#2f86d8] hover:bg-[#f0f7fe]"
        >
          <ImageIcon className="h-8 w-8 text-[#b4cfe8]" />
          <p className="mt-2 text-sm text-[#7e95ab]">Click to upload thumbnail</p>
          <p className="text-xs text-[#90a3b6]">JPG, PNG · Max 3MB</p>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
      />

      {!previewUrl && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="mt-2 flex items-center gap-1.5 text-xs font-medium text-[#2f86d8] hover:underline"
        >
          <Upload className="h-3 w-3" />
          Upload from computer
        </button>
      )}
    </section>
  );
}
