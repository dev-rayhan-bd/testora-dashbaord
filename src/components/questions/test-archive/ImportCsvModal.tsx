"use client";

import { useState, useRef } from "react";
import { UploadCloud, X, FileSpreadsheet, Loader2, AlertTriangle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { API_BASE_URL } from "@/constants";
import { useAppSelector } from "@/store/hooks";
import { questionApi } from "@/store/apis/question";
import { useDispatch } from "react-redux";

interface ImportCsvModalProps {
  open: boolean;
  onClose: () => void;
}

interface ImportSummary {
  totalRows: number;
  validRows: number;
  warnings: any[];
  errors: { row: number; message: string }[];
}

export default function ImportCsvModal({ open, onClose }: ImportCsvModalProps) {
  const dispatch = useDispatch();
  const token = useAppSelector((state) => state.auth.token);
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [summary, setSummary] = useState<ImportSummary | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!open) return null;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile: File) => {
    const validTypes = [
      "text/csv",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
      "application/vnd.ms-excel", // .xls
    ];
    const extension = selectedFile.name.split(".").pop()?.toLowerCase();
    
    if (validTypes.includes(selectedFile.type) || extension === "csv" || extension === "xlsx" || extension === "xls") {
      setFile(selectedFile);
      setSummary(null); // Reset previous summary
    } else {
      toast.error("Please upload a valid CSV or Excel file (.csv, .xlsx)");
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setSummary(null);

    const formData = new FormData();
    formData.append("csv_file", file);

    try {
      const response = await fetch(`${API_BASE_URL}/admin/questions/import-csv`, {
        method: "POST",
        headers: {
          Authorization: token?.startsWith("Bearer ") ? token : `Bearer ${token}`,
          // Let the browser set Content-Type for multipart/form-data with boundaries
        },
        body: formData,
      });

      const responseData = await response.json();

      if (response.ok && responseData.success) {
        toast.success(responseData.message || "File imported successfully");
        setSummary(responseData.data?.summary);
        dispatch(questionApi.util.invalidateTags(["Questions"]));
      } else {
        // Validation errors returned with non-2xx status
        if (responseData.data?.summary) {
          setSummary(responseData.data.summary);
          toast.error(responseData.message || "Validation completed with errors. No data was imported.");
        } else {
          toast.error(responseData.message || "An error occurred during upload");
        }
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred during upload");
    } finally {
      setIsUploading(false);
    }
  };

  const resetState = () => {
    setFile(null);
    setSummary(null);
    setIsUploading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2d4056]/40 p-4 backdrop-blur-xs">
      <div className="flex w-full max-w-2xl max-h-[90vh] flex-col overflow-hidden rounded-2xl border border-[#dce7f2] bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#e6edf5] px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#edf4fe] text-[#2563eb]">
              <FileSpreadsheet className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#2f4256]">Import Test Data (CSV / Excel)</h3>
              <p className="text-xs text-[#7e95ab]">Upload a CSV or Excel file to batch import questions</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              resetState();
              onClose();
            }}
            disabled={isUploading}
            className="rounded-lg p-1 text-[#8ea1b5] transition-colors hover:bg-[#f4f8fc] hover:text-[#3f5f7a] disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {!summary ? (
            <>
              {/* Upload Area */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={cn(
                  "flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-10 transition-colors",
                  isDragging
                    ? "border-[#2563eb] bg-[#f0f5ff]"
                    : file
                    ? "border-[#8bd2a4] bg-[#f2fcf6]"
                    : "border-[#dce7f2] bg-[#f8fbff] hover:border-[#b4cbe1]"
                )}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                  className="hidden"
                />

                {file ? (
                  <div className="flex flex-col items-center text-center">
                    <FileSpreadsheet className="mb-3 h-12 w-12 text-[#16a34a]" />
                    <p className="text-sm font-semibold text-[#2f4256]">{file.name}</p>
                    <p className="mt-1 text-xs text-[#7e95ab]">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <button
                      type="button"
                      onClick={() => setFile(null)}
                      disabled={isUploading}
                      className="mt-4 text-xs font-semibold text-rose-500 hover:text-rose-600 disabled:opacity-50"
                    >
                      Remove File
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-center">
                    <UploadCloud className="mb-3 h-12 w-12 text-[#9ab0c3]" />
                    <p className="text-sm font-semibold text-[#2f4256]">
                      Drag and drop your file here
                    </p>
                    <p className="mt-1 text-xs text-[#7e95ab]">or click to browse from your computer</p>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="mt-5 rounded-lg bg-white px-4 py-2 text-xs font-semibold text-[#3f5f7a] shadow-sm ring-1 ring-inset ring-[#dce7f2] hover:bg-slate-50"
                    >
                      Select File
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Summary / Report Area */}
              <div className="space-y-5">
                {summary.errors && summary.errors.length > 0 ? (
                  <div className="rounded-xl border border-rose-200 bg-rose-50 p-4">
                    <div className="flex items-center gap-2 text-rose-700">
                      <AlertTriangle className="h-5 w-5" />
                      <h4 className="font-bold">Validation Failed</h4>
                    </div>
                    <p className="mt-1 text-xs text-rose-600">
                      Found {summary.errors.length} error(s) in the file. No data was imported. Please fix these and try again.
                    </p>
                  </div>
                ) : (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                    <div className="flex items-center gap-2 text-emerald-700">
                      <CheckCircle2 className="h-5 w-5" />
                      <h4 className="font-bold">Import Successful</h4>
                    </div>
                    <p className="mt-1 text-xs text-emerald-600">
                      Successfully imported {summary.validRows} valid rows.
                    </p>
                  </div>
                )}

                {/* Validation Error List */}
                {summary.errors && summary.errors.length > 0 && (
                  <div>
                    <h5 className="mb-2 text-xs font-bold uppercase text-[#4f6d87]">Error Report</h5>
                    <div className="overflow-hidden rounded-xl border border-[#dce7f2]">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-[#f8fbff] text-[#6f859b]">
                          <tr>
                            <th className="px-4 py-2 font-semibold">Row</th>
                            <th className="px-4 py-2 font-semibold">Error Message</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#ecf2f8]">
                          {summary.errors.map((err, idx) => (
                            <tr key={idx} className="hover:bg-rose-50/50">
                              <td className="px-4 py-2 font-medium text-rose-600 whitespace-nowrap">
                                Row {err.row}
                              </td>
                              <td className="px-4 py-2 text-[#4f6d87]">
                                {err.message}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-[#e6edf5] px-6 py-4">
          {summary ? (
            <button
              type="button"
              onClick={resetState}
              className="rounded-lg bg-white px-4 py-2 text-xs font-semibold text-[#3f5f7a] shadow-sm ring-1 ring-inset ring-[#dce7f2] hover:bg-slate-50"
            >
              Upload Another File
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={onClose}
                disabled={isUploading}
                className="rounded-lg bg-white px-4 py-2 text-xs font-semibold text-[#3f5f7a] transition-colors hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!file || isUploading}
                onClick={handleUpload}
                className="inline-flex min-w-24 items-center justify-center gap-1.5 rounded-lg bg-[#2563eb] px-4 py-2 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-[#1d4ed8] disabled:bg-[#93b3f2]"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  "Import File"
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
