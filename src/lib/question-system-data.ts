// ─── Category types ───────────────────────────────────────────────────────────

export const QUESTION_CATEGORIES = ["Entrance Exam", "Semimatura", "Matura"] as const;
export type QuestionCategory = (typeof QUESTION_CATEGORIES)[number];

/**
 * Determines which classification field variant to render.
 * - "entrance"  → Category, Year, Faculty, Department, Subject, Test Type, Access, Order, Passage
 * - "standard"  → Category, Year, Subject, Test Type, Access, Order, Passage
 * - "province"  → Category, Year, Core Subject, Elective Subject, Subject, Test Type, Access, Order, Passage
 */
export function getClassificationVariant(category: string): "entrance" | "standard" | "province" {
  if (category === "Entrance Exam") return "entrance";
  if (category === "Matura") return "province";
  return "standard";
}

// ─── Dropdown options ─────────────────────────────────────────────────────────

export const QUESTION_YEARS = ["2020", "2021", "2022", "2023", "2024", "2025", "2026"] as const;

export const FACULTIES = [
  "Medicine",
  "Law",
  "Economics",
  "Electrical and Computer Engineering (FIEK)",
  "Architecture",
  "Civil Engineering / Construction",
  "Mathematical and Natural Sciences",
  "Mechanical Engineering",
  "Philology",
  "Philosophy",
  "Education",
] as const;

export const DEPARTMENTS_BY_FACULTY: Record<string, string[]> = {
  Medicine: ["General Medicine", "Dentistry", "Pharmacy", "Nursing", "Physiotherapy"],
  Law: ["Law"],
  Economics: [
    "Banking and Finance",
    "Management",
    "Marketing",
    "Economics",
    "Accounting",
    "Applied Economics and Management (English Program) BSc",
  ],
  "Electrical and Computer Engineering (FIEK)": [
    "Electrical Engineering",
    "Computer Engineering",
    "Computer Science and Engineering",
  ],
  Architecture: ["Architecture"],
  "Civil Engineering / Construction": ["Civil Engineering", "Construction"],
  "Mathematical and Natural Sciences": [
    "Mathematics",
    "Computer Science",
    "Financial Mathematics in Banking and Insurance",
    "Physics",
    "Chemistry",
    "Chemical Engineering",
    "Food Chemistry",
    "Biology",
    "Ecology and Environmental Protection",
    "Molecular Biology",
    "Geography",
  ],
  "Mechanical Engineering": [
    "Industrial Production and Engineering",
    "Thermal Engineering and Renewable Energy",
    "Traffic and Transport",
    "Mechatronics",
    "Engineering Design and Automobiles",
  ],
  Philology: [
    "Albanian Language",
    "Albanian Literature",
    "English Language and Literature",
    "German Language and Literature",
    "French Language and Literature",
    "Journalism",
    "Turkish Language and Literature",
    "Oriental Studies",
  ],
  Philosophy: [
    "Philosophy",
    "Social Work",
    "History",
    "Political Science",
    "Sociology",
    "Psychology",
    "Anthropology",
  ],
  Education: ["Education"],
};

const ENTRANCE_SUBJECTS_BY_FACULTY: Record<string, readonly string[]> = {
  Medicine: ["Chemistry", "Biology"],
  Law: ["Introduction to Law", "Constitutional Law", "Albanian Language"],
  Economics: ["Introduction to Economics", "Mathematics"],
  "Electrical and Computer Engineering (FIEK)": ["Mathematics"],
  Architecture: ["Mathematics", "Spatial Perception", "Free Drawing"],
  "Civil Engineering / Construction": ["Mathematics"],
  "Mathematical and Natural Sciences": [
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "Geography",
  ],
  "Mechanical Engineering": ["Mathematics"],
  Philology: [
    "Albanian Language",
    "Albanian Literature",
    "English Language",
    "German Language",
    "French Language",
    "Turkish Language",
    "Arabic Language",
  ],
  Philosophy: ["Philosophy", "Sociology", "Civic Education", "Psychology", "History", "Literature"],
  Education: ["Albanian Language and Literature", "Mathematics", "Psychology", "Analytical Skills"],
};

const ENTRANCE_SUBJECTS_BY_DEPARTMENT: Record<string, Record<string, readonly string[]>> = {
  Economics: {
    "Applied Economics and Management (English Program) BSc": [
      "Introduction to Economics",
      "Mathematics",
      "English Language",
    ],
  },
  "Mathematical and Natural Sciences": {
    Mathematics: ["Mathematics"],
    "Computer Science": ["Mathematics"],
    "Financial Mathematics in Banking and Insurance": ["Mathematics"],
    Physics: ["Physics", "Mathematics"],
    Chemistry: ["Chemistry", "Physics", "Mathematics"],
    "Chemical Engineering": ["Chemistry", "Physics", "Mathematics"],
    "Food Chemistry": ["Chemistry", "Physics", "Mathematics"],
    Biology: ["Biology", "Chemistry"],
    "Ecology and Environmental Protection": ["Biology", "Chemistry"],
    "Molecular Biology": ["Biology", "Chemistry"],
    Geography: ["Geography"],
  },
  Philology: {
    Journalism: [
      "Albanian Language",
      "Albanian Literature",
      "Albanian Civilization",
      "World Civilization",
      "Essay",
    ],
    "Oriental Studies": [
      "Turkish Language",
      "Arabic Language",
      "Islamic Civilization",
      "Oriental Culture",
    ],
  },
  Philosophy: {
    Philosophy: ["Philosophy", "Sociology"],
    "Social Work": ["Civic Education", "Psychology", "Sociology"],
    History: ["World History", "History of Albanian People", "Civic Education"],
    "Political Science": ["Sociology", "Philosophy", "History", "Civic Education"],
    Sociology: ["Sociology", "Philosophy"],
    Psychology: ["Psychology", "Philosophy"],
    Anthropology: ["History", "Literature", "Sociology"],
  },
};

export function getEntranceSubjectOptions(faculty: string, department?: string) {
  if (!faculty) return [];

  const departmentSubjects = department
    ? ENTRANCE_SUBJECTS_BY_DEPARTMENT[faculty]?.[department]
    : undefined;
  if (departmentSubjects) return [...departmentSubjects];

  const facultySubjects = ENTRANCE_SUBJECTS_BY_FACULTY[faculty];
  return facultySubjects ? [...facultySubjects] : [];
}

export const SUBJECTS = [
  "Albanian Language",
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "English Language",
  "French Language",
  "History",
  "Geography",
  "Literature",
  "Computer Science",
  "Art",
  "Physical Education",
] as const;

export const CORE_SUBJECTS = [
  "Albanian Language",
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "History",
  "Literature",
] as const;

export const ELECTIVE_SUBJECTS = [
  "English Language",
  "French Language",
  "German Language",
  "Art",
  "Music",
  "Physical Education",
  "Computer Science",
  "Economics",
] as const;

export const TEST_TYPES = ["Official", "Additional", "Full Simulation"] as const;

export const ACCESS_OPTIONS = ["Free", "Premium"] as const;

export const QUESTION_STATUSES = ["Published", "Draft", "Hidden", "Archived"] as const;
export type QuestionStatus = (typeof QUESTION_STATUSES)[number];

// ─── Question Bank sample data ────────────────────────────────────────────────

export type QuestionRow = {
  id: string;
  category: string;
  year: string;
  subject: string;
  faculty: string;
  dept: string;
  type: string;
  access: string;
  order: string;
  passage: string;
  text: string;
  correct: string;
  status: QuestionStatus;
};

export const questionBankRows: QuestionRow[] = [
  {
    id: "Q-001",
    category: "Semimatura",
    year: "2025",
    subject: "Mathematics",
    faculty: "—",
    dept: "—",
    type: "Official",
    access: "Free",
    order: "A1",
    passage: "—",
    text: "What is the derivative of x²?",
    correct: "B",
    status: "Published",
  },
  {
    id: "Q-002",
    category: "Semimatura",
    year: "2025",
    subject: "Mathematics",
    faculty: "—",
    dept: "—",
    type: "Official",
    access: "Free",
    order: "A2",
    passage: "—",
    text: "Solve the equation: 2x + 5 = 1",
    correct: "A",
    status: "Published",
  },
  {
    id: "Q-003",
    category: "Semimatura",
    year: "2025",
    subject: "Albanian",
    faculty: "—",
    dept: "—",
    type: "Official",
    access: "Premium",
    order: "A3",
    passage: "PSG-01",
    text: "Based on the passage, what is...",
    correct: "C",
    status: "Published",
  },
  {
    id: "Q-004",
    category: "Entrance Exam",
    year: "2024",
    subject: "—",
    faculty: "Medicine",
    dept: "General Med",
    type: "Official",
    access: "Premium",
    order: "A1",
    passage: "—",
    text: "Which organ produces insulin?",
    correct: "D",
    status: "Published",
  },
  {
    id: "Q-005",
    category: "Matura",
    year: "2023",
    subject: "Physics",
    faculty: "—",
    dept: "—",
    type: "Additional",
    access: "Free",
    order: "A5",
    passage: "—",
    text: "Calculate the velocity of an object",
    correct: "A",
    status: "Draft",
  },
  {
    id: "Q-006",
    category: "Entrance Exam",
    year: "2024",
    subject: "—",
    faculty: "Engineering",
    dept: "CS",
    type: "Official",
    access: "Free",
    order: "A6",
    passage: "—",
    text: "What is the binary representation?",
    correct: "B",
    status: "Published",
  },
  {
    id: "Q-007",
    category: "Semimatura",
    year: "2024",
    subject: "English",
    faculty: "—",
    dept: "—",
    type: "Official",
    access: "Free",
    order: "A8",
    passage: "PSG-02",
    text: "According to the text, what is...",
    correct: "C",
    status: "Hidden",
  },
  {
    id: "Q-008",
    category: "Matura",
    year: "2023",
    subject: "Chemistry",
    faculty: "—",
    dept: "—",
    type: "Official",
    access: "Premium",
    order: "A12",
    passage: "—",
    text: "What is the molecular formula?",
    correct: "A",
    status: "Published",
  },
];
