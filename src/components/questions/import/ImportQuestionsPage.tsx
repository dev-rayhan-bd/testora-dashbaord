"use client";

import { getErrorMessage, useImportQuestionsCsvMutation } from "@/store/apis";
import { ArrowRight, CheckCircle2, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import FieldMappingSection from "./FieldMappingSection";
import UploadFileSection from "./UploadFileSection";
import ValidationSummarySection, { type ValidationSummaryData } from "./ValidationSummarySection";

export default function ImportQuestionsPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isMappingOpen, setIsMappingOpen] = useState(false);
  const [validationSummary, setValidationSummary] = useState<ValidationSummaryData | null>(null);
  const [successInfo, setSuccessInfo] = useState<{
    message: string;
    totalCreated?: number;
    totalProcessed?: number;
  } | null>(null);

  const [importCsv, { isLoading: isImporting }] = useImportQuestionsCsvMutation();

  const handleImport = async (file: File) => {
    setSuccessInfo(null);
    setValidationSummary(null);

    try {
      const response = await importCsv(file).unwrap();
      if (response.success) {
        const totalCreated = response.data?.totalCreated;
        const totalProcessed = response.data?.totalProcessed;
        const issues = response.data?.issues;

        if (issues && issues.length > 0) {
          setValidationSummary({
            totalRows: totalProcessed,
            validRows: totalCreated,
            issues: issues,
          });
        }

        setSuccessInfo({
          message: response.message || "Spreadsheet questions successfully parsed and imported!",
          totalCreated,
          totalProcessed,
        });

        toast.success(
          response.message || `Successfully imported ${totalCreated ?? ""} questions!`
        );
      } else {
        const issues = response.data?.issues;
        if (issues && issues.length > 0) {
          setValidationSummary({
            totalRows: response.data?.totalProcessed,
            validRows: response.data?.totalCreated,
            issues: issues,
          });
        }
        toast.error(response.message || "Validation issues found during import.");
      }
    } catch (error: unknown) {
      console.error("Import error:", error);
      const errorData = error as {
        data?: {
          message?: string;
          data?: {
            issues?: Array<{ rowNumber?: number; field?: string; message: string }>;
            totalProcessed?: number;
            totalCreated?: number;
            summary?: ValidationSummaryData;
          };
        };
      };

      const respData = errorData?.data?.data;
      if (respData?.summary) {
        setValidationSummary(respData.summary);
      } else if (respData?.issues && respData.issues.length > 0) {
        setValidationSummary({
          totalRows: respData.totalProcessed,
          validRows: respData.totalCreated,
          issues: respData.issues,
        });
      }

      toast.error(getErrorMessage(error, "An error occurred while uploading questions file."));
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <section className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-[#273d52]">Import Questions</h2>
          <p className="text-xs text-[#6e859b]">
            Batch import questions and answer keys from CSV or Excel (.xlsx) files
          </p>
        </div>

        <Link
          href="/questions/question-bank"
          className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#dce7f2] bg-white px-3 text-xs font-semibold text-[#1e6fbe] shadow-xs hover:bg-[#f6faff]"
        >
          View Question Bank
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </section>

      {/* Success Notification Banner */}
      {successInfo && (
        <section className="flex items-center justify-between rounded-xl border border-emerald-200 bg-[#eefaf3] p-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-emerald-900">{successInfo.message}</p>
              <p className="text-xs text-emerald-700">
                {successInfo.totalCreated !== undefined && (
                  <span>
                    <strong>{successInfo.totalCreated}</strong> questions saved to Question Bank.{" "}
                  </span>
                )}
                Available immediately for tests and student quizzes.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/questions/question-bank"
              className="inline-flex h-8 items-center gap-1 rounded-lg bg-emerald-700 px-3 text-xs font-semibold text-white hover:bg-emerald-800"
            >
              Browse Questions
            </Link>
            <button
              type="button"
              onClick={() => setSuccessInfo(null)}
              className="rounded p-1 text-emerald-600 hover:bg-emerald-100"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </section>
      )}

      {/* Upload Box */}
      <UploadFileSection
        selectedFile={selectedFile}
        isImporting={isImporting}
        onFileSelect={(file) => {
          setSelectedFile(file);
          if (file) {
            handleImport(file);
          }
        }}
        onOpenMappingModal={() => setIsMappingOpen(true)}
      />

      {/* Validation Summary if issues occurred */}
      {validationSummary && <ValidationSummarySection summary={validationSummary} />}

      {/* Field Mapping Guide Modal */}
      {isMappingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1e293b]/45 p-4 backdrop-blur-xs">
          <div className="relative max-h-[85vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-[#dce7f2] bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#e9eff6] pb-3 mb-4">
              <div>
                <h3 className="text-base font-bold text-[#273d52]">Spreadsheet Field Mapping</h3>
                <p className="text-xs text-[#71889e]">
                  Header names and expected values for CSV / XLSX columns
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsMappingOpen(false)}
                className="rounded-lg p-1 text-[#8ea1b5] hover:bg-[#f4f8fc]"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <FieldMappingSection />
          </div>
        </div>
      )}
    </div>
  );
}
