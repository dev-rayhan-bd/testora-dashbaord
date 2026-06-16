"use client";

import { getErrorMessage } from "@/store/apis";
import { useImportQuestionsCsvMutation } from "@/store/apis/question";
import { X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import FieldMappingSection from "./FieldMappingSection";
import UploadFileSection from "./UploadFileSection";
import ValidationSummarySection, { type ValidationSummaryData } from "./ValidationSummarySection";

type ImportQuestionsResponse = {
  success?: boolean;
  message?: string;
  data?: {
    summary?: ValidationSummaryData | null;
  };
};

export default function ImportQuestionsPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isMappingOpen, setIsMappingOpen] = useState(false);
  const [validationSummary, setValidationSummary] = useState<ValidationSummaryData | null>(null);

  const [importCsv, { isLoading: isImporting }] = useImportQuestionsCsvMutation();

  const handleImport = async (file: File) => {
    try {
      const response = (await importCsv(file).unwrap()) as ImportQuestionsResponse;
      if (response.success) {
        toast.success(response.message || "Test and questions imported successfully.");
        setValidationSummary(null);
        setSelectedFile(null);
      } else {
        if (response.data?.summary) {
          setValidationSummary(response.data.summary);
          toast.error(response.message || "Validation completed with errors.");
        } else {
          toast.error(response.message || "Failed to import questions.");
        }
      }
    } catch (error) {
      console.error("Import error:", error);
      const errorData = error as ImportQuestionsResponse;
      if (errorData.data?.summary) {
        setValidationSummary(errorData.data.summary);
        toast.error(errorData.message || "Validation completed with errors.");
      } else {
        toast.error(getErrorMessage(error, "An unexpected error occurred during import."));
      }
    }
  };

  return (
    <div className="space-y-3">
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <section className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-[#3f5f7a]">Import Questions</h2>
          <p className="text-sm text-[#7e95ab]">
            Import questions from CSV files into the centralized Question Bank
          </p>
        </div>
      </section>

      {/* ── Upload ──────────────────────────────────────────────────────────── */}
      <UploadFileSection
        selectedFile={selectedFile}
        isImporting={isImporting}
        onFileSelect={(file) => {
          setSelectedFile(file);
          setValidationSummary(null);
          if (file) {
            handleImport(file);
          }
        }}
        onOpenMappingModal={() => setIsMappingOpen(true)}
      />

      {/* ── Field mapping ───────────────────────────────────────────────────── */}
      {/* Commented out in initial flow as requested, shown in modal instead */}
      {/* <FieldMappingSection /> */}

      {/* ── Validation ──────────────────────────────────────────────────────── */}
      {validationSummary && <ValidationSummarySection summary={validationSummary} />}

      {/* ── Field Mapping Modal ───────────────────────────────────────────────── */}
      {isMappingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2d4056]/30 p-4">
          <div className="relative max-h-[85vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-[#dce7f2] bg-white p-6 shadow-xl">
            <button
              type="button"
              onClick={() => setIsMappingOpen(false)}
              className="absolute top-4 right-4 rounded-md p-1 text-[#8ea1b5] hover:bg-[#f4f8fc]"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="mt-2">
              <FieldMappingSection />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
