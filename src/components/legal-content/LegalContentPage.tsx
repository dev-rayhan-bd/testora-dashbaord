"use client";

import { cn } from "@/lib/utils";
import { getErrorMessage } from "@/store/apis/authApi";
import {
  useRetrieveContentQuery,
  useCreateOrUpdateContentMutation,
} from "@/store/apis/contentApi";
import { FileText, Loader2, ShieldCheck, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import RichTextEditor from "@/components/ui/RichTextEditor";

type Tab = "privacy-policy" | "terms-and-condition";

export default function LegalContentPage() {
  const [activeTab, setActiveTab] = useState<Tab>("privacy-policy");
  
  // Local state for the editor
  const [editorContent, setEditorContent] = useState("");
  
  // RTK Query hooks
  const { 
    data: contentResponse, 
    isLoading: isLoadingContent, 
    isFetching: isFetchingContent,
    refetch 
  } = useRetrieveContentQuery(activeTab);
  
  const [updateContent, { isLoading: isUpdating }] = useCreateOrUpdateContentMutation();

  // Sync RTK query data to local state
  useEffect(() => {
    if (contentResponse?.data?.content) {
      setEditorContent(contentResponse.data.content);
    } else {
      setEditorContent("");
    }
  }, [contentResponse, activeTab]);

  const handleSave = async () => {
    if (!editorContent.trim()) {
      toast.error("Content cannot be empty.");
      return;
    }

    try {
      await updateContent({
        type: activeTab,
        content: editorContent,
      }).unwrap();
      
      toast.success(
        `${activeTab === "privacy-policy" ? "Privacy Policy" : "Terms & Conditions"} updated successfully!`
      );
      refetch();
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to update content."));
    }
  };

  const isBusy = isLoadingContent || isFetchingContent;

  return (
    <div className="space-y-6 pb-12">
      {/* Header section */}
      <section className="flex flex-col items-start justify-between gap-4 rounded-xl border border-[#c6d8ea] bg-white p-5 shadow-[0_2px_10px_rgb(0,0,0,0.03)] sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1e293b]">Legal & Policy Content</h1>
          <p className="mt-1 text-sm text-[#64748b]">
            Manage your application's legal documents and user policies.
          </p>
        </div>
      </section>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Tabs */}
        <div className="w-full lg:w-64 shrink-0 flex flex-col gap-2">
          <button
            onClick={() => setActiveTab("privacy-policy")}
            className={cn(
              "flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg border font-medium transition-all duration-200",
              activeTab === "privacy-policy" 
                ? "bg-[#e8f1fa] border-[#a0c5e8] text-[#1e40af] shadow-sm" 
                : "bg-white border-[#dce7f2] text-[#475569] hover:bg-slate-50 hover:border-[#cbd5e1]"
            )}
          >
            <ShieldCheck className={cn("h-5 w-5", activeTab === "privacy-policy" ? "text-[#1e40af]" : "text-[#94a3b8]")} />
            Privacy Policy
          </button>
          
          <button
            onClick={() => setActiveTab("terms-and-condition")}
            className={cn(
              "flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg border font-medium transition-all duration-200",
              activeTab === "terms-and-condition" 
                ? "bg-[#e8f1fa] border-[#a0c5e8] text-[#1e40af] shadow-sm" 
                : "bg-white border-[#dce7f2] text-[#475569] hover:bg-slate-50 hover:border-[#cbd5e1]"
            )}
          >
            <FileText className={cn("h-5 w-5", activeTab === "terms-and-condition" ? "text-[#1e40af]" : "text-[#94a3b8]")} />
            Terms & Conditions
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 rounded-xl border border-[#dce7f2] bg-white p-1 shadow-sm overflow-hidden flex flex-col">
          {/* Editor Header */}
          <div className="border-b border-[#e2e8f0] px-5 py-4 flex items-center justify-between bg-slate-50 rounded-t-lg">
            <div>
              <h2 className="text-lg font-semibold text-[#334155]">
                {activeTab === "privacy-policy" ? "Edit Privacy Policy" : "Edit Terms & Conditions"}
              </h2>
              <p className="text-xs text-[#64748b] mt-0.5">Last updated content will be immediately visible to users.</p>
            </div>
            
            <button
              onClick={handleSave}
              disabled={isUpdating || isBusy}
              className="inline-flex items-center gap-2 rounded-md bg-[#2f86d8] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#2360a5] focus:outline-none focus:ring-2 focus:ring-[#2f86d8] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save Changes
            </button>
          </div>
          
          {/* Editor Body */}
          <div className="p-4 flex-1 bg-white relative min-h-[500px]">
            {isBusy ? (
              <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10 backdrop-blur-sm">
                <div className="flex flex-col items-center gap-2 text-[#64748b]">
                  <Loader2 className="h-8 w-8 animate-spin text-[#2f86d8]" />
                  <span className="text-sm font-medium">Loading content...</span>
                </div>
              </div>
            ) : null}
            
            <RichTextEditor 
              value={editorContent} 
              onChange={setEditorContent} 
              placeholder={`Write your ${activeTab.replace(/-/g, " ")} here...`} 
              className="h-[500px] mb-12"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
