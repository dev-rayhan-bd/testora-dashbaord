"use client";

import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import { useMemo } from "react";

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false, loading: () => <div className="h-64 w-full animate-pulse rounded-md bg-gray-100" /> });

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function RichTextEditor({ value, onChange, placeholder, className }: RichTextEditorProps) {
  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ align: [] }],
        ["link", "image"],
        ["clean"],
      ],
    }),
    []
  );

  return (
    <div className={`rich-text-editor-container ${className}`}>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        placeholder={placeholder}
        className="min-h-[400px] h-full"
      />
      <style jsx global>{`
        .rich-text-editor-container .quill {
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        .rich-text-editor-container .ql-container {
          flex: 1;
          min-height: 400px;
          border-bottom-left-radius: 0.375rem;
          border-bottom-right-radius: 0.375rem;
          font-family: inherit;
          font-size: 1rem;
        }
        .rich-text-editor-container .ql-toolbar {
          border-top-left-radius: 0.375rem;
          border-top-right-radius: 0.375rem;
          background-color: #f8fbff;
        }
        .rich-text-editor-container .ql-editor {
          min-height: 400px;
        }
      `}</style>
    </div>
  );
}
