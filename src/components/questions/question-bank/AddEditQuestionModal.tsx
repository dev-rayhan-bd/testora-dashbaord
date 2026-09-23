"use client";

import {
  useAddQuestionMutation,
  useGetMetaFiltersQuery,
  useGetPassagesQuery,
  useUpdateQuestionMutation,
  type QuestionListItem,
  type QuestionOption,
} from "@/store/apis";
import {
  CheckCircle2,
  FileText,
  Loader2,
  Plus,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { toast } from "sonner";

interface Props {
  open: boolean;
  questionToEdit: QuestionListItem | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AddEditQuestionModal({
  open,
  questionToEdit,
  onClose,
  onSuccess,
}: Props) {
  if (!open) return null;

  return (
    <QuestionModalDialog
      key={questionToEdit?._id ?? "new"}
      questionToEdit={questionToEdit}
      onClose={onClose}
      onSuccess={onSuccess}
    />
  );
}

function QuestionModalDialog({
  questionToEdit,
  onClose,
  onSuccess,
}: {
  questionToEdit: QuestionListItem | null;
  onClose: () => void;
  onSuccess?: () => void;
}) {
  const isEditing = !!questionToEdit;
  const { data: metaFilters } = useGetMetaFiltersQuery();
  const { data: passagesData } = useGetPassagesQuery();
  const [addQuestion, { isLoading: isAdding }] = useAddQuestionMutation();
  const [updateQuestion, { isLoading: isUpdating }] = useUpdateQuestionMutation();
  const isSubmitting = isAdding || isUpdating;

  const [draftQuestions, setDraftQuestions] = useState<any[]>([]);

  // Form State
  const [examType, setExamType] = useState<string>(() => questionToEdit?.examType || "matura");
  const [year, setYear] = useState<number>(() => questionToEdit?.year || new Date().getFullYear());
  const [questionText, setQuestionText] = useState(() => questionToEdit?.questionText || "");
  const [options, setOptions] = useState<QuestionOption[]>(() => {
    if (questionToEdit?.options && questionToEdit.options.length > 0) {
      return questionToEdit.options.map((opt) => ({ text: opt.text }));
    }
    return [{ text: "" }, { text: "" }, { text: "" }, { text: "" }];
  });
  const [correctOptionIndex, setCorrectOptionIndex] = useState<number>(() => questionToEdit?.correctOptionIndex ?? 0);
  const [access, setAccess] = useState<string>(() => questionToEdit?.access || "free");
  const [difficultyLevel, setDifficultyLevel] = useState<string>(() => questionToEdit?.difficultyLevel || "medium");
  const [status, setStatus] = useState<string>(() => questionToEdit?.status || "published");
  const [subject, setSubject] = useState<string>(() => {
    if (!questionToEdit) return "";
    const subj = (questionToEdit as unknown as { subject?: string | { _id?: string } })?.subject;
    return typeof subj === "object" ? subj?._id || "" : subj || "";
  });
  const [faculty, setFaculty] = useState<string>(() => {
    if (!questionToEdit) return "";
    const fac = (questionToEdit as unknown as { faculty?: string | { _id?: string } })?.faculty;
    return typeof fac === "object" ? fac?._id || "" : fac || "";
  });
  const [departments, setDepartments] = useState<string[]>(() => {
    if (!questionToEdit) return [];
    const depts = (questionToEdit as unknown as { departments?: Array<string | { _id: string }> })?.departments;
    if (!depts) return [];
    return depts.map((d) => (typeof d === "object" ? d._id : d));
  });
  const [passage, setPassage] = useState<string>(() => {
    if (!questionToEdit) return "";
    const pass = (questionToEdit as unknown as { passage?: string | { _id?: string } })?.passage;
    return typeof pass === "object" ? pass?._id || "" : pass || "";
  });
  const [explanation, setExplanation] = useState(() => questionToEdit?.explanation || "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(() => questionToEdit?.questionImageUrl || null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const subjects = metaFilters?.data?.subjects ?? [];
  const faculties = metaFilters?.data?.faculties ?? [];
  const allDepartments = metaFilters?.data?.departments ?? [];
  const passages = passagesData?.data ?? [];

  // Filter subjects for current examType
  const filteredSubjects = subjects.filter((s) => s.examType === examType);

  // Filter departments for selected faculty
  const filteredDepartments = allDepartments.filter(
    (d) => !faculty || d.faculty === faculty
  );

  const handleOptionChange = (index: number, text: string) => {
    setOptions((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], text };
      return next;
    });
  };

  const handleAddOption = () => {
    if (options.length < 4) {
      setOptions((prev) => [...prev, { text: "" }]);
    }
  };

  const handleRemoveOption = (index: number) => {
    if (options.length > 2) {
      setOptions((prev) => prev.filter((_, i) => i !== index));
      if (correctOptionIndex >= index && correctOptionIndex > 0) {
        setCorrectOptionIndex((prev) => Math.max(0, prev - 1));
      }
    }
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("image/")) {
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
      } else {
        toast.error("Please upload an image file (PNG, JPG, WEBP)");
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const validateForm = () => {
    if (!questionText.trim()) {
      toast.error("Please enter the question text");
      return false;
    }

    const filledOptions = options.filter((o) => o.text.trim().length > 0);
    if (filledOptions.length < 2) {
      toast.error("Please provide at least 2 options");
      return false;
    }

    if (examType === "provime") {
      if (!faculty) {
        toast.error("Please select a faculty for entrance exam (provime)");
        return false;
      }
      if (departments.length === 0) {
        toast.error("Please select at least one department");
        return false;
      }
    } else {
      if (!subject && filteredSubjects.length > 0) {
        toast.error("Please select a subject");
        return false;
      }
    }
    return true;
  };

  const buildCurrentPayload = () => {
    return {
      examType,
      year,
      questionText: questionText.trim(),
      options: options.map((o) => ({ text: o.text.trim() })),
      correctOptionIndex,
      access,
      difficultyLevel,
      status,
      subject: examType !== "provime" ? subject : undefined,
      faculty: examType === "provime" ? faculty : undefined,
      departments: examType === "provime" ? departments : undefined,
      passage: passage || undefined,
      explanation: explanation.trim() || undefined,
      question_image: imageFile,
    };
  };

  const handleQueueQuestion = () => {
    if (!validateForm()) return;
    const payload = buildCurrentPayload();
    setDraftQuestions((prev) => [...prev, payload]);
    
    // Reset specific fields for next question
    setQuestionText("");
    setOptions([{ text: "" }, { text: "" }, { text: "" }, { text: "" }]);
    setCorrectOptionIndex(0);
    setExplanation("");
    handleRemoveImage();
  };

  const handleSaveAll = async () => {
    // If the current form has text but wasn't queued, optionally queue it or throw error.
    // We'll queue it if valid.
    let finalDrafts = [...draftQuestions];
    if (questionText.trim()) {
      if (!validateForm()) return;
      finalDrafts.push(buildCurrentPayload());
    }

    if (finalDrafts.length === 0) {
      toast.error("Please add at least one question");
      return;
    }

    try {
      if (isEditing && questionToEdit) {
        // Editing a single question
        const payload = finalDrafts[0];
        await updateQuestion({
          questionId: questionToEdit._id,
          ...payload,
        }).unwrap();
        toast.success("Question updated successfully");
      } else {
        const imagesToUpload: File[] = [];
        const payloadQuestions = finalDrafts.map((draft) => {
          const draftPayload = { ...draft };
          if (draftPayload.question_image) {
            imagesToUpload.push(draftPayload.question_image);
            draftPayload.imageName = draftPayload.question_image.name;
            delete draftPayload.question_image;
          }
          return draftPayload;
        });

        // The global base payload pulled from the first draft
        // (which represents the global Classification Grid state)
        const basePayload = {
          examType: finalDrafts[0].examType,
          year: finalDrafts[0].year,
          access: finalDrafts[0].access,
          difficultyLevel: finalDrafts[0].difficultyLevel,
          status: finalDrafts[0].status,
          subject: finalDrafts[0].subject,
          faculty: finalDrafts[0].faculty,
          departments: finalDrafts[0].departments,
          passage: finalDrafts[0].passage,
        };

        if (payloadQuestions.length === 1) {
          await addQuestion({
            ...basePayload,
            ...payloadQuestions[0],
            question_image: imagesToUpload.length > 0 ? imagesToUpload[0] : undefined,
          }).unwrap();
        } else {
          await addQuestion({
            ...basePayload,
            questions: payloadQuestions,
            question_image: imagesToUpload.length > 0 ? imagesToUpload : undefined,
          }).unwrap();
        }
        toast.success(finalDrafts.length === 1 ? "Question created successfully" : `${finalDrafts.length} Questions created successfully`);
      }
      onSuccess?.();
      onClose();
    } catch (err: unknown) {
      const errorMsg =
        (err as { data?: { message?: string } })?.data?.message ||
        "Failed to save question. Please verify all inputs.";
      toast.error(errorMsg);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2d4056]/40 p-4 backdrop-blur-xs">
      <div className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-[#dce7f2] bg-white shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#e6edf5] px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#edf4fe] text-[#2563eb]">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#2f4256]">
                {isEditing ? "Edit Question" : "Add New Question"}
              </h3>
              <p className="text-xs text-[#7e95ab]">
                {isEditing
                  ? `Editing question #${questionToEdit?._id.slice(-6)}`
                  : "Create a question in the centralized question database"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-lg p-1 text-[#8ea1b5] transition-colors hover:bg-[#f4f8fc] hover:text-[#3f5f7a] disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={(e) => { e.preventDefault(); handleSaveAll(); }} className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Classification Grid */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs font-semibold text-[#4f6d87]">
                Exam Type <span className="text-rose-500">*</span>
              </label>
              <select
                value={examType}
                onChange={(e) => {
                  setExamType(e.target.value);
                  setSubject("");
                  setFaculty("");
                  setDepartments([]);
                }}
                className="h-9 w-full rounded-lg border border-[#dce7f2] bg-[#f8fbff] px-3 text-xs font-medium text-[#3f5f7a] outline-none transition-colors focus:border-[#7fb3e8] focus:bg-white"
              >
                <option value="matura">Matura</option>
                <option value="semi_matura">Semimatura</option>
                <option value="provime">Entrance Exam (Provime)</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-[#4f6d87]">
                Year <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min={2000}
                max={new Date().getFullYear() + 2}
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="h-9 w-full rounded-lg border border-[#dce7f2] bg-[#f8fbff] px-3 text-xs font-medium text-[#3f5f7a] outline-none transition-colors focus:border-[#7fb3e8] focus:bg-white"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-[#4f6d87]">
                Access &amp; Difficulty
              </label>
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={access}
                  onChange={(e) => setAccess(e.target.value)}
                  className="h-9 rounded-lg border border-[#dce7f2] bg-[#f8fbff] px-2 text-xs font-medium text-[#3f5f7a] outline-none transition-colors focus:border-[#7fb3e8] focus:bg-white"
                >
                  <option value="free">Free</option>
                  <option value="premium">Premium</option>
                </select>
                <select
                  value={difficultyLevel}
                  onChange={(e) => setDifficultyLevel(e.target.value)}
                  className="h-9 rounded-lg border border-[#dce7f2] bg-[#f8fbff] px-2 text-xs font-medium text-[#3f5f7a] outline-none transition-colors focus:border-[#7fb3e8] focus:bg-white"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>
          </div>

          {/* Dynamic Subject vs Faculty/Departments */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {examType === "provime" ? (
              <>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-[#4f6d87]">
                    Faculty <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={faculty}
                    onChange={(e) => {
                      setFaculty(e.target.value);
                      setDepartments([]);
                    }}
                    className="h-9 w-full rounded-lg border border-[#dce7f2] bg-[#f8fbff] px-3 text-xs font-medium text-[#3f5f7a] outline-none transition-colors focus:border-[#7fb3e8] focus:bg-white"
                  >
                    <option value="">Select Faculty...</option>
                    {faculties.map((f) => (
                      <option key={f._id} value={f._id}>
                        {f.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-[#4f6d87]">
                    Departments <span className="text-rose-500">*</span>
                  </label>
                  <select
                    multiple
                    value={departments}
                    onChange={(e) =>
                      setDepartments(
                        Array.from(e.target.selectedOptions, (option) => option.value)
                      )
                    }
                    className="min-h-16 w-full rounded-lg border border-[#dce7f2] bg-[#f8fbff] p-2 text-xs text-[#3f5f7a] outline-none transition-colors focus:border-[#7fb3e8] focus:bg-white"
                  >
                    {filteredDepartments.map((d) => (
                      <option key={d._id} value={d._id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                  <p className="mt-0.5 text-[10px] text-[#8ea1b5]">
                    Hold Ctrl/Cmd to select multiple departments.
                  </p>
                </div>
              </>
            ) : (
              <div>
                <label className="mb-1 block text-xs font-semibold text-[#4f6d87]">
                  Subject <span className="text-rose-500">*</span>
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="h-9 w-full rounded-lg border border-[#dce7f2] bg-[#f8fbff] px-3 text-xs font-medium text-[#3f5f7a] outline-none transition-colors focus:border-[#7fb3e8] focus:bg-white"
                >
                  <option value="">Select Subject...</option>
                  {filteredSubjects.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Optional Passage Link */}
            <div>
              <label className="mb-1 block text-xs font-semibold text-[#4f6d87]">
                Linked Passage (Optional)
              </label>
              <select
                value={passage}
                onChange={(e) => setPassage(e.target.value)}
                className="h-9 w-full rounded-lg border border-[#dce7f2] bg-[#f8fbff] px-3 text-xs font-medium text-[#3f5f7a] outline-none transition-colors focus:border-[#7fb3e8] focus:bg-white"
              >
                <option value="">None (Independent Question)</option>
                {passages.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.passageCode} — {p.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {draftQuestions.length > 0 && !isEditing && (
            <div className="rounded-xl bg-[#f0f6fc] p-4 border border-[#e6edf5]">
              <div className="mb-2 text-xs font-bold text-[#3f5f7a]">
                Batch Queue ({draftQuestions.length} Questions)
              </div>
              <div className="flex flex-wrap gap-2 items-center">
                {draftQuestions.map((q, idx) => (
                  <div key={idx} className="flex items-center gap-1 rounded bg-white border border-[#cbe1f5] px-2 py-1 text-[11px] font-semibold text-[#2563eb] shadow-sm">
                    <span>Q{idx + 1}: {q.questionText.substring(0, 15)}...</span>
                    <button 
                      type="button" 
                      onClick={() => setDraftQuestions(draftQuestions.filter((_, i) => i !== idx))} 
                      className="ml-1 text-[#8ea1b5] hover:text-rose-500 transition-colors"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Question Text */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-[#4f6d87]">
              Question Text <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder="Enter the question prompt or equation..."
              className="w-full resize-none rounded-xl border border-[#dce7f2] bg-[#f8fbff] p-3 text-xs text-[#3f5f7a] outline-none transition-colors focus:border-[#7fb3e8] focus:bg-white placeholder:text-[#9ab0c3]"
            />
          </div>

          {/* Drag & Drop Question Image Dropzone */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-[#4f6d87]">
              Question Diagram / Image (Optional)
            </label>
            {imagePreview ? (
              <div className="relative inline-block overflow-hidden rounded-xl border border-[#dce7f2]">
                <Image
                  src={imagePreview}
                  alt="Question Diagram"
                  width={240}
                  height={140}
                  className="max-h-36 w-auto object-contain bg-slate-50"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-1.5 right-1.5 rounded-full bg-rose-500 p-1 text-white shadow-md transition-transform hover:scale-110"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleFileDrop}
                onClick={() => fileInputRef.current?.click()}
                className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#cddfee] bg-[#f8fbff] p-4 text-center transition-colors hover:border-[#7fb3e8] hover:bg-[#edf6fe]"
              >
                <UploadCloud className="h-6 w-6 text-[#7baad8]" />
                <p className="mt-1.5 text-xs font-semibold text-[#405f7d]">
                  Drag and drop question diagram, or <span className="text-[#2563eb]">browse</span>
                </p>
                <p className="text-[10px] text-[#90a2b5]">PNG, JPG, or WEBP up to 5MB</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            )}
          </div>

          {/* Dynamic Options Builder */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <div>
                <label className="text-xs font-semibold text-[#4f6d87]">
                  Answer Options (2 to 4) <span className="text-rose-500">*</span>
                </label>
                <p className="text-[11px] text-[#8ea1b5]">
                  Select the radio button beside the correct answer.
                </p>
              </div>
              {options.length < 4 && (
                <button
                  type="button"
                  onClick={handleAddOption}
                  className="inline-flex items-center gap-1 rounded-lg border border-[#cbe1f5] bg-[#edf5fc] px-2.5 py-1 text-xs font-semibold text-[#2563eb] transition-colors hover:bg-[#deeeff]"
                >
                  <Plus className="h-3 w-3" />
                  Add Option
                </button>
              )}
            </div>

            <div className="space-y-2">
              {options.map((option, idx) => {
                const isCorrect = correctOptionIndex === idx;
                return (
                  <div
                    key={idx}
                    className={`flex items-center gap-2.5 rounded-xl border p-2.5 transition-all ${
                      isCorrect
                        ? "border-[#8bd2a4] bg-[#f0f9f3] ring-1 ring-[#8bd2a4]/40"
                        : "border-[#dce7f2] bg-[#f8fbff]"
                    }`}
                  >
                    <label className="flex cursor-pointer items-center gap-1.5 pl-1">
                      <input
                        type="radio"
                        name="correctOption"
                        checked={isCorrect}
                        onChange={() => setCorrectOptionIndex(idx)}
                        className="h-4 w-4 cursor-pointer text-[#16a34a] accent-[#16a34a]"
                      />
                      <span className="text-xs font-bold text-[#4f6d87]">
                        {String.fromCharCode(65 + idx)}
                      </span>
                    </label>

                    <input
                      type="text"
                      value={option.text}
                      onChange={(e) => handleOptionChange(idx, e.target.value)}
                      placeholder={`Option ${String.fromCharCode(65 + idx)} text...`}
                      className="h-8 flex-1 bg-transparent px-2 text-xs text-[#3f5f7a] outline-none placeholder:text-[#9ab0c3]"
                    />

                    {isCorrect && (
                      <span className="inline-flex items-center gap-1 rounded-md bg-[#e3f4e8] px-2 py-0.5 text-[10px] font-bold text-[#16a34a]">
                        <CheckCircle2 className="h-3 w-3" />
                        Correct
                      </span>
                    )}

                    {options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveOption(idx)}
                        className="rounded p-1 text-[#9ab0c3] transition-colors hover:bg-[#fdeeee] hover:text-rose-500"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Explanation */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-[#4f6d87]">
              Explanation / Solution (Optional)
            </label>
            <textarea
              rows={2}
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              placeholder="Add step-by-step reasoning or formula breakdown for students..."
              className="w-full resize-none rounded-xl border border-[#dce7f2] bg-[#f8fbff] p-3 text-xs text-[#3f5f7a] outline-none transition-colors focus:border-[#7fb3e8] focus:bg-white placeholder:text-[#9ab0c3]"
            />
          </div>

          {/* Status Selection */}
          <div className="flex items-center justify-between rounded-xl border border-[#dce7f2] bg-[#f8fbff] p-3">
            <div>
              <p className="text-xs font-semibold text-[#3f5f7a]">Publishing Status</p>
              <p className="text-[11px] text-[#8ea1b5]">
                Draft questions remain hidden from active student quiz sessions.
              </p>
            </div>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="h-8 rounded-lg border border-[#dce7f2] bg-white px-3 text-xs font-bold text-[#3f5f7a] outline-none"
            >
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-2.5 border-t border-[#e6edf5] pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-lg px-4 py-2 text-xs font-semibold text-[#6f8194] transition-colors hover:bg-[#f5f9fd] disabled:opacity-50"
            >
              Cancel
            </button>
            {!isEditing && (
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); handleQueueQuestion(); }}
                disabled={isSubmitting}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#cbe1f5] bg-[#edf5fc] px-4 py-2 text-xs font-semibold text-[#2563eb] transition-colors hover:bg-[#deeeff] active:scale-95 disabled:opacity-50"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Another Question
              </button>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#2563eb] px-5 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-[#1d4ed8] active:scale-95 disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Saving...
                </>
              ) : isEditing ? (
                "Save Changes"
              ) : (
                draftQuestions.length > 0 ? `Save All (${draftQuestions.length + (questionText.trim() ? 1 : 0)})` : "Create Question"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
