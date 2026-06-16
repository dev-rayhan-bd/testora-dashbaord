"use client";

import { Download, FileSpreadsheet, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

type Props = {
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
  onOpenMappingModal: () => void;
  isImporting?: boolean;
};

export default function UploadFileSection({ onFileSelect, selectedFile, onOpenMappingModal, isImporting }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (isImporting) return;
    setDragging(false);
    const file = e.dataTransfer.files[0] ?? null;
    if (file && !file.name.endsWith(".csv")) {
      toast.error("Only CSV files are allowed.");
      return;
    }
    onFileSelect(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isImporting) return;
    const file = e.target.files?.[0] ?? null;
    if (file && !file.name.endsWith(".csv")) {
      toast.error("Only CSV files are allowed.");
      return;
    }
    onFileSelect(file);
  };

  return (
    <section className="rounded-lg border border-[#dce7f2] bg-white p-4">
      {/* Title */}
      <div className="mb-3 flex items-center gap-2">
        <h3 className="text-sm font-semibold text-[#3f5f7a]">Upload File</h3>
      </div>

      {/* Drop zone */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => !isImporting && inputRef.current?.click()}
        onKeyDown={(e) => e.key === "Enter" && !isImporting && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          if (isImporting) return;
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed py-10 text-center transition-colors ${
          isImporting
            ? "border-[#c0d8ee] bg-[#f8fbff]/50 cursor-not-allowed"
            : dragging
            ? "border-[#2f86d8] bg-[#edf4fb] cursor-pointer"
            : "border-[#c0d8ee] bg-[#f8fbff] hover:border-[#2f86d8] hover:bg-[#f0f7fe] cursor-pointer"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".csv"
          className="hidden"
          disabled={isImporting}
          onChange={handleFileChange}
        />
        {isImporting ? (
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#2f86d8] border-t-transparent" />
            <p className="text-sm font-medium text-[#3f5f7a]">Uploading and validating questions...</p>
          </div>
        ) : (
          <>
            <Upload className="h-8 w-8 text-[#9ab0c3]" />
            {selectedFile ? (
              <div className="mt-3 space-y-1">
                <div className="flex items-center gap-1.5 text-sm font-medium text-[#3f5f7a]">
                  <FileSpreadsheet className="h-4 w-4 text-[#2f86d8]" />
                  {selectedFile.name}
                </div>
                <p className="text-xs text-[#90a3b6]">
                  {(selectedFile.size / 1024).toFixed(1)} KB · Click to replace
                </p>
              </div>
            ) : (
              <>
                <p className="mt-3 text-sm font-medium text-[#3f5f7a]">
                  Drop your file here, or click to browse
                </p>
                <p className="mt-1 text-xs text-[#90a3b6]">
                  Supports CSV (.csv)
                </p>
              </>
            )}
          </>
        )}
        <div className="mt-3 flex items-center gap-2">
          {[
            { label: ".csv", color: "border-[#d6e5f4] bg-[#eaf2fb] text-[#4d93d9]" },
          ].map(({ label, color }) => (
            <span
              key={label}
              className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${color}`}
            >
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* Template downloads and Modal trigger */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-2">
          {/* Excel template commented out as we only support CSV now */}
          {/*
          <button
            type="button"
            className="inline-flex h-8 items-center gap-1.5 rounded-md border border-[#dce7f2] bg-[#f8fbff] px-3 text-xs font-medium text-[#587189] hover:bg-[#f0f6fc]"
          >
            <Download className="h-3.5 w-3.5" />
            Download Excel Template
          </button>
          */}
          <button
            type="button"
            className="inline-flex h-8 items-center gap-1.5 rounded-md border border-[#dce7f2] bg-[#f8fbff] px-3 text-xs font-medium text-[#587189] hover:bg-[#f0f6fc]"
          >
            <Download className="h-3.5 w-3.5" />
            Download CSV Template
          </button>
        </div>

        <button
          type="button"
          onClick={onOpenMappingModal}
          className="inline-flex h-8 items-center gap-1.5 rounded-md border border-[#dce7f2] bg-[#f8fbff] px-3 text-xs font-medium text-[#2f86d8] hover:bg-[#f0f6fc]"
        >
          Field Mapping Preview
        </button>
      </div>
    </section>
  );
}
