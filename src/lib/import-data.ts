// ─── Field mapping rows ───────────────────────────────────────────────────────

export type FieldMappingStatus = "Mapped" | "Optional" | "Missing";

export type FieldMappingRow = {
  systemField: string;
  description: string;
  excelColumn: string;
  fileColumn: string;
  status: FieldMappingStatus;
  required: boolean;
};

export const fieldMappingRows: FieldMappingRow[] = [
  {
    systemField: "question_text",
    description: "Question body text (supports LaTeX math e.g. $\\frac{a}{b}$)",
    excelColumn: "Column A",
    fileColumn: "Question Text",
    status: "Mapped",
    required: true,
  },
  {
    systemField: "option_a",
    description: "Answer option A (supports LaTeX math)",
    excelColumn: "Column B",
    fileColumn: "Option A",
    status: "Mapped",
    required: true,
  },
  {
    systemField: "option_b",
    description: "Answer option B (supports LaTeX math)",
    excelColumn: "Column C",
    fileColumn: "Option B",
    status: "Mapped",
    required: true,
  },
  {
    systemField: "option_c",
    description: "Answer option C (supports LaTeX math)",
    excelColumn: "Column D",
    fileColumn: "Option C",
    status: "Mapped",
    required: true,
  },
  {
    systemField: "option_d",
    description: "Answer option D (supports LaTeX math)",
    excelColumn: "Column E",
    fileColumn: "Option D",
    status: "Mapped",
    required: true,
  },
  {
    systemField: "correct_answer",
    description: "Correct option (A/B/C/D)",
    excelColumn: "Column F",
    fileColumn: "Correct Answer",
    status: "Mapped",
    required: true,
  },
  {
    systemField: "category",
    description: "Question category",
    excelColumn: "Column G",
    fileColumn: "Category",
    status: "Mapped",
    required: true,
  },
  {
    systemField: "year",
    description: "Exam year",
    excelColumn: "Column H",
    fileColumn: "Year",
    status: "Mapped",
    required: true,
  },
  {
    systemField: "subject",
    description: "Subject name",
    excelColumn: "Column I",
    fileColumn: "Subject",
    status: "Mapped",
    required: true,
  },
  {
    systemField: "faculty",
    description: "Faculty (Entrance Exam)",
    excelColumn: "Column J",
    fileColumn: "Faculty",
    status: "Mapped",
    required: false,
  },
  {
    systemField: "department",
    description: "Department",
    excelColumn: "Column K",
    fileColumn: "Department",
    status: "Mapped",
    required: false,
  },
  {
    systemField: "test_type",
    description: "Official / Additional",
    excelColumn: "Column L",
    fileColumn: "Test Type",
    status: "Mapped",
    required: true,
  },
  {
    systemField: "access",
    description: "Free or Premium",
    excelColumn: "Column M",
    fileColumn: "Access",
    status: "Mapped",
    required: true,
  },
  {
    systemField: "passage_id",
    description: "Link to an existing passage",
    excelColumn: "Column N",
    fileColumn: "Passage ID",
    status: "Optional",
    required: false,
  },
  {
    systemField: "question_order",
    description: "Position in the test",
    excelColumn: "Column O",
    fileColumn: "Question Order",
    status: "Mapped",
    required: true,
  },
];

// ─── Validation summary ───────────────────────────────────────────────────────

export const validationSummary = {
  total: 48,
  valid: 43,
  warnings: 3,
  errors: 2,
};

// ─── Validation issues ────────────────────────────────────────────────────────

export type ValidationIssue = {
  row: number;
  field: string;
  message: string;
  severity: "warning" | "error";
};

export const validationIssues: ValidationIssue[] = [
  {
    row: 7,
    field: "correct_answer",
    message: "Value 'E' is not a valid option (expected A–D)",
    severity: "error",
  },
  {
    row: 19,
    field: "question_order",
    message: "Duplicate question order '12' detected",
    severity: "error",
  },
  {
    row: 3,
    field: "passage_id",
    message: "Passage 'PSG-99' not found in the system",
    severity: "warning",
  },
  {
    row: 11,
    field: "faculty",
    message: "Faculty left blank for Entrance Exam category",
    severity: "warning",
  },
  {
    row: 24,
    field: "access",
    message: "Unrecognised value 'Freemium' — defaulting to Free",
    severity: "warning",
  },
];
