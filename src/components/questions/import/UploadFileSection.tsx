"use client";

import { Download, FileSpreadsheet, Loader2, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

type Props = {
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
  onOpenMappingModal: () => void;
  isImporting?: boolean;
};

export default function UploadFileSection({
  onFileSelect,
  selectedFile,
  onOpenMappingModal,
  isImporting,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const isValidFormat = (name: string) => {
    const lower = name.toLowerCase();
    return lower.endsWith(".csv") || lower.endsWith(".xlsx");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (isImporting) return;
    setDragging(false);
    const file = e.dataTransfer.files[0] ?? null;
    if (file && !isValidFormat(file.name)) {
      toast.error("Only CSV (.csv) or Excel (.xlsx) files are supported.");
      return;
    }
    onFileSelect(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isImporting) return;
    const file = e.target.files?.[0] ?? null;
    if (file && !isValidFormat(file.name)) {
      toast.error("Only CSV (.csv) or Excel (.xlsx) files are supported.");
      return;
    }
    onFileSelect(file);
  };

  const handleDownloadCsvTemplate = () => {
    const csvHeader =
      "examType,year,subject,faculty,department,questionText,optionA,optionB,optionC,optionD,correctOptionIndex,difficultyLevel,access,explanation\n";
    const sampleRow =
      'matura,2026,"Gjuhë Shqipe",,"","Cila është figura kryesore stilistike në vargjet e Kadaresë?","Metafora","Simboli","Alegoria","Personifikimi",0,medium,free,"Metafora përdoret për të krijuar imazhe të thella figurative."\n';
    const blob = new Blob([csvHeader + sampleRow], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "testora_question_import_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("CSV template downloaded!");
  };

  return (
    <section className="rounded-xl border border-[#dce7f2] bg-white p-5 shadow-xs">
      {/* Title */}
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-[#273d52]">Upload Spreadsheet File</h3>
          <p className="text-xs text-[#71889e]">
            Drag &amp; drop your prepared .csv or .xlsx question file below
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="rounded-md border border-blue-200 bg-blue-50 px-2 py-0.5 font-mono text-[10px] font-semibold text-blue-700">
            .csv
          </span>
          <span className="rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 font-mono text-[10px] font-semibold text-emerald-700">
            .xlsx
          </span>
        </div>
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
        className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed py-10 px-4 text-center transition-all ${
          isImporting
            ? "cursor-not-allowed border-[#c0d8ee] bg-[#f8fbff]/60"
            : dragging
            ? "cursor-pointer border-[#2563eb] bg-[#eff6ff] scale-[0.99]"
            : "cursor-pointer border-[#d0e1f0] bg-[#f9fcff] hover:border-[#2563eb] hover:bg-[#f2f7fc]"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, .xlsx"
          className="hidden"
          disabled={isImporting}
          onChange={handleFileChange}
        />
        {isImporting ? (
          <div className="flex flex-col items-center justify-center space-y-3">
            <Loader2 className="h-9 w-9 animate-spin text-[#2563eb]" />
            <div>
              <p className="text-sm font-bold text-[#273d52]">Uploading and validating questions...</p>
              <p className="text-xs text-[#71889e]">
                Parsing spreadsheet rows, checking schemas, and verifying linked subjects
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#edf4fd] text-[#2563eb] shadow-2xs">
              <Upload className="h-6 w-6" />
            </div>
            {selectedFile ? (
              <div className="mt-3 space-y-1">
                <div className="flex items-center justify-center gap-2 text-sm font-bold text-[#273d52]">
                  <FileSpreadsheet className="h-4 w-4 text-[#2563eb]" />
                  {selectedFile.name}
                </div>
                <p className="text-xs text-[#71889e]">
                  {(selectedFile.size / 1024).toFixed(1)} KB · Click or drag to replace
                </p>
              </div>
            ) : (
              <>
                <p className="mt-3 text-sm font-bold text-[#273d52]">
                  Drop your file here, or click to browse
                </p>
                <p className="mt-1 text-xs text-[#71889e]">
                  Accepts standard CSV or Excel files with question headers
                </p>
              </>
            )}
          </>
        )}
      </div>

      {/* Template downloads and Modal trigger */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-[#eaf0f7] pt-3">
        <button
          type="button"
          onClick={handleDownloadCsvTemplate}
          className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-[#dce7f2] bg-[#f8fbff] px-3 text-xs font-medium text-[#48637e] transition-colors hover:bg-[#eef5fc] hover:text-[#1e6fbe]"
        >
          <Download className="h-3.5 w-3.5" />
          Download CSV Template
        </button>

        <button
          type="button"
          onClick={onOpenMappingModal}
          className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-[#dce7f2] bg-white px-3 text-xs font-semibold text-[#1e6fbe] shadow-2xs transition-colors hover:bg-[#f0f6fc]"
        >
          Field Mapping Guide
        </button>
      </div>
    </section>
  );
}
