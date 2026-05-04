import {
  ACCESS_OPTIONS,
  CORE_SUBJECTS,
  DEPARTMENTS_BY_FACULTY,
  ELECTIVE_SUBJECTS,
  FACULTIES,
  getClassificationVariant,
  getEntranceSubjectOptions,
  QUESTION_CATEGORIES,
  QUESTION_YEARS,
  SUBJECTS,
  TEST_TYPES,
} from "@/lib/question-system-data";
import { cn } from "@/lib/utils";

// ─── Reusable field primitives ────────────────────────────────────────────────

const inputClass =
  "w-full rounded-md border border-[#dce7f2] bg-[#f8fbff] px-3 py-2 text-sm text-[#3f5f7a] outline-none placeholder:text-[#9ab0c3] focus:border-[#2f86d8] focus:ring-1 focus:ring-[#2f86d8]/20";

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="mb-1.5 block text-xs font-medium text-[#587189]">{children}</label>;
}

function FormSelect({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
  placeholder?: string;
}) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className={inputClass}>
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}

function FormInput({
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={inputClass}
    />
  );
}

// ─── Types ────────────────────────────────────────────────────────────────────

export type ClassificationData = {
  category: string;
  year: string;
  faculty: string;
  department: string;
  subject: string;
  coreSubject: string;
  electiveSubject: string;
  testType: string;
  access: string;
  questionOrder: string;
  passageId: string;
};

type ClassificationSectionProps = {
  data: ClassificationData;
  onChange: (field: keyof ClassificationData, value: string) => void;
};

// ─── Classification section ───────────────────────────────────────────────────

export default function ClassificationSection({ data, onChange }: ClassificationSectionProps) {
  const variant = getClassificationVariant(data.category);
  const departmentOptions =
    data.faculty && DEPARTMENTS_BY_FACULTY[data.faculty]
      ? DEPARTMENTS_BY_FACULTY[data.faculty]
      : [];
  const entranceSubjectOptions = getEntranceSubjectOptions(data.faculty, data.department);

  return (
    <section className="rounded-lg border border-[#dce7f2] bg-white p-4">
      <h3 className="mb-4 text-sm font-semibold text-[#3f5f7a]">Classification</h3>

      <div className={cn("grid gap-4", "md:grid-cols-2")}>
        {/* ── Always visible ── */}
        <div>
          <FieldLabel>Category</FieldLabel>
          <FormSelect
            value={data.category}
            onChange={(v) => onChange("category", v)}
            options={QUESTION_CATEGORIES}
            placeholder="Select category"
          />
        </div>

        <div>
          <FieldLabel>Year</FieldLabel>
          <FormSelect
            value={data.year}
            onChange={(v) => onChange("year", v)}
            options={QUESTION_YEARS}
            placeholder="Select year"
          />
        </div>

        {/* ── Entrance Exam variant ── */}
        {variant === "entrance" && (
          <>
            <div>
              <FieldLabel>Faculty</FieldLabel>
              <FormSelect
                value={data.faculty}
                onChange={(v) => {
                  onChange("faculty", v);
                  onChange("department", "");
                  onChange("subject", "");
                }}
                options={FACULTIES}
                placeholder="Select faculty"
              />
            </div>

            <div>
              <FieldLabel>Department</FieldLabel>
              <FormSelect
                value={data.department}
                onChange={(v) => {
                  onChange("department", v);
                  onChange("subject", "");
                }}
                options={departmentOptions.length > 0 ? departmentOptions : ["—"]}
                placeholder="Select department"
              />
            </div>

            <div>
              <FieldLabel>Subject</FieldLabel>
              <FormSelect
                value={data.subject}
                onChange={(v) => onChange("subject", v)}
                options={entranceSubjectOptions.length > 0 ? entranceSubjectOptions : ["—"]}
                placeholder="Select subject"
              />
            </div>
          </>
        )}

        {/* ── Matura variant ── */}
        {variant === "province" && (
          <>
            <div>
              <FieldLabel>Core Subject</FieldLabel>
              <FormSelect
                value={data.coreSubject}
                onChange={(v) => onChange("coreSubject", v)}
                options={CORE_SUBJECTS}
                placeholder="Select core subject"
              />
            </div>

            <div>
              <FieldLabel>Elective Subject</FieldLabel>
              <FormSelect
                value={data.electiveSubject}
                onChange={(v) => onChange("electiveSubject", v)}
                options={ELECTIVE_SUBJECTS}
                placeholder="Select elective subject"
              />
            </div>
          </>
        )}

        {/* ── Standard + Province: Subject ── */}
        {(variant === "standard" || variant === "province") && (
          <div>
            <FieldLabel>Subject</FieldLabel>
            <FormSelect
              value={data.subject}
              onChange={(v) => onChange("subject", v)}
              options={SUBJECTS}
              placeholder="Select subject"
            />
          </div>
        )}

        {/* ── Always visible (lower) ── */}
        <div>
          <FieldLabel>Test Type</FieldLabel>
          <FormSelect
            value={data.testType}
            onChange={(v) => onChange("testType", v)}
            options={TEST_TYPES}
            placeholder="Select test type"
          />
        </div>

        <div>
          <FieldLabel>Access</FieldLabel>
          <FormSelect
            value={data.access}
            onChange={(v) => onChange("access", v)}
            options={ACCESS_OPTIONS}
            placeholder="Select access"
          />
        </div>

        <div>
          <FieldLabel>Question Order</FieldLabel>
          <FormInput
            value={data.questionOrder}
            onChange={(v) => onChange("questionOrder", v)}
            placeholder="1"
          />
        </div>

        <div>
          <FieldLabel>Passage ID (optional)</FieldLabel>
          <FormInput
            value={data.passageId}
            onChange={(v) => onChange("passageId", v)}
            placeholder="e.g. PSG-01"
          />
        </div>
      </div>
    </section>
  );
}
