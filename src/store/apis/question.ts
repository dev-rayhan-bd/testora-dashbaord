import type { ApiEnvelope } from "./authApi";
import { baseApi } from "./baseApi";

export interface MetaFilterOption {
  label: string;
  value: string;
}

export interface MetaFilterSubject {
  _id: string;
  name: string;
  examType: string;
}

export interface MetaFilterFaculty {
  _id: string;
  name: string;
}

export interface MetaFilterDepartment {
  _id: string;
  name: string;
  faculty: string;
}

export interface MetaFiltersData {
  examTypes: MetaFilterOption[];
  years: number[];
  subjects: MetaFilterSubject[];
  faculties: MetaFilterFaculty[];
  departments: MetaFilterDepartment[];
  difficultyLevels: MetaFilterOption[];
  accessTypes: MetaFilterOption[];
  statuses: MetaFilterOption[];
}

export interface QuestionOption {
  text: string;
  imageUrl?: string;
}

export interface QuestionListItem {
  _id: string;
  examType: string;
  year: number;
  questionText: string;
  questionImageUrl?: string | null;
  options: QuestionOption[];
  correctOptionIndex: number;
  correctAnswer?: string;
  access: string;
  difficultyLevel: string;
  status: string;
  subjectName?: string | null;
  facultyName?: string | null;
  departmentName?: string | null;
  passageCode?: string | null;
  passage?: string | null;
  explanation?: string;
  createdAt: string;
}

export interface QuestionListResponse {
  success: boolean;
  message: string;
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  data: QuestionListItem[];
}

export interface SingleQuestionResponse {
  _id?: string;
  questionId?: string;
  examType: string;
  year: number;
  questionText: string;
  questionImageUrl: string | null;
  options: QuestionOption[];
  correctOptionIndex: number;
  correctAnswer?: string;
  explanation: string;
  difficultyLevel: string;
  access: string;
  status: string;
  createdAt: string;
  subjectName?: string | null;
  subject?: string | { _id: string; name: string } | null;
  facultyName?: string | null;
  faculty?: string | { _id: string; name: string } | null;
  departments?: string[] | { _id: string; name: string }[];
  passage?: string | { _id: string; passageCode: string; title?: string } | null;
  passageCode?: string | null;
  testIds?: string[];
  stats?: {
    totalAttempts: number;
    correctCount: number;
    wrongCount: number;
    correctPercentage: number;
  };
}

export interface QuestionListParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
  examType?: string;
  year?: number | string;
  subjectName?: string;
  facultyName?: string;
  departmentName?: string;
  passageId?: string;
  access?: string;
  difficultyLevel?: string;
  status?: string;
}

export interface CreateQuestionPayload {
  examType: string;
  year: number;
  questionText: string;
  options: QuestionOption[];
  correctOptionIndex: number;
  access?: string;
  difficultyLevel?: string;
  status?: string;
  subject?: string;
  faculty?: string;
  departments?: string[];
  passage?: string;
  explanation?: string;
  question_image?: File | null;
}

export interface UpdateQuestionPayload {
  questionId: string;
  examType?: string;
  year?: number;
  questionText?: string;
  options?: QuestionOption[];
  correctOptionIndex?: number;
  access?: string;
  difficultyLevel?: string;
  status?: string;
  subject?: string;
  faculty?: string;
  departments?: string[];
  passage?: string;
  explanation?: string;
  question_image?: File | null;
}

export interface QuestionOverviewData {
  totalQuestions: number;
  publishedTests: number;
  totalPassages: number;
  activeStudents: number;
  totalQuizSessions: number;
}

export interface TestArchiveItem {
  _id: string;
  title: string;
  testCode: string;
  testType: string;
  examType: string;
  year: number;
  totalQuestions?: number;
  questionIds?: string[];
  access: string;
  status: string;
  createdAt: string;
  subjectName?: string | null;
  subject?: string | { _id: string; name: string } | null;
  facultyName?: string | null;
  faculty?: string | { _id: string; name: string } | null;
  departments?: string[];
}

export interface TestArchiveResponse {
  success: boolean;
  message: string;
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  data: TestArchiveItem[];
}

export interface TestArchiveParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
  examType?: string;
  year?: number | string;
  testType?: string;
  access?: string;
  status?: string;
}

export interface CreateTestPayload {
  title: string;
  testCode: string;
  examType: string;
  year: number;
  testType: "official" | "additional" | string;
  access: "free" | "premium" | string;
  status?: "published" | "draft" | "hidden" | string;
  subject?: string;
  faculty?: string;
  departments?: string[];
  questionIds?: string[];
}

export interface UpdateTestPayload extends Partial<CreateTestPayload> {
  testId: string;
}

export interface DuplicateTestPayload {
  testId: string;
  newTestCode?: string;
  newTitle?: string;
  newYear?: number;
}

export interface CopyYearPayload {
  sourceTestId: string;
  targetTestId: string;
}

export interface PassageItem {
  _id: string;
  passageCode: string;
  title: string;
  content: string;
  passageImageUrl: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  questionCount?: number;
}

export interface PassageListResponse {
  statusCode?: number;
  success: boolean;
  message: string;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  data: PassageItem[];
}

export interface PassageListParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
}

export interface CreatePassagePayload {
  passageCode: string;
  title: string;
  content: string;
  passage_image?: File | null;
}

export interface UpdatePassagePayload {
  passageId: string;
  passageCode?: string;
  title?: string;
  content?: string;
  passage_image?: File | null;
}

export interface SubjectItem {
  _id: string;
  name: string;
  nameInEnglish?: string;
  nameInAlbanian?: string;
  slug?: string;
  examType: "matura" | "semi_matura" | "provime" | string;
  isElective?: boolean;
  isActive?: boolean;
  questionCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface SubjectListParams {
  examType?: string;
  searchTerm?: string;
}

export interface CreateSubjectPayload {
  name: string;
  examType: string;
  nameInEnglish?: string;
  nameInAlbanian?: string;
  isElective?: boolean;
}

export interface UpdateSubjectPayload {
  id: string;
  name?: string;
  examType?: string;
  nameInEnglish?: string;
  nameInAlbanian?: string;
  isElective?: boolean;
}

export interface ImportCsvIssue {
  rowNumber?: number;
  field?: string;
  message: string;
}

export interface ImportCsvResponse {
  success: boolean;
  message: string;
  data?: {
    totalProcessed?: number;
    totalCreated?: number;
    issues?: ImportCsvIssue[];
  };
}

function buildQuestionQuery(params?: QuestionListParams) {
  if (!params) return "";
  const searchParams = new URLSearchParams();
  if (params.page !== undefined) searchParams.set("page", String(params.page));
  if (params.limit !== undefined) searchParams.set("limit", String(params.limit));
  if (params.searchTerm) searchParams.set("searchTerm", params.searchTerm.trim());
  if (params.examType && params.examType !== "All") searchParams.set("examType", params.examType);
  if (params.year && params.year !== "All") searchParams.set("year", String(params.year));
  if (params.subjectName && params.subjectName !== "All") searchParams.set("subjectName", params.subjectName);
  if (params.facultyName && params.facultyName !== "All") searchParams.set("facultyName", params.facultyName);
  if (params.departmentName && params.departmentName !== "All") searchParams.set("departmentName", params.departmentName);
  if (params.passageId && params.passageId !== "All") searchParams.set("passageId", params.passageId);
  if (params.access && params.access !== "All") searchParams.set("access", params.access);
  if (params.difficultyLevel && params.difficultyLevel !== "All") searchParams.set("difficultyLevel", params.difficultyLevel);
  if (params.status && params.status !== "All") searchParams.set("status", params.status);

  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

function buildArchiveQuery(params?: TestArchiveParams) {
  if (!params) return "";
  const searchParams = new URLSearchParams();
  if (params.page !== undefined) searchParams.set("page", String(params.page));
  if (params.limit !== undefined) searchParams.set("limit", String(params.limit));
  if (params.searchTerm) searchParams.set("searchTerm", params.searchTerm.trim());
  if (params.examType && params.examType !== "All") searchParams.set("examType", params.examType);
  if (params.year && params.year !== "All") searchParams.set("year", String(params.year));
  if (params.testType && params.testType !== "All") searchParams.set("testType", params.testType);
  if (params.access && params.access !== "All") searchParams.set("access", params.access);
  if (params.status && params.status !== "All") searchParams.set("status", params.status);

  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

function buildPassageQuery(params?: PassageListParams) {
  if (!params) return "";
  const searchParams = new URLSearchParams();
  if (params.page !== undefined) searchParams.set("page", String(params.page));
  if (params.limit !== undefined) searchParams.set("limit", String(params.limit));
  if (params.searchTerm) searchParams.set("searchTerm", params.searchTerm.trim());

  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

function buildSubjectQuery(params?: SubjectListParams) {
  if (!params) return "";
  const searchParams = new URLSearchParams();
  if (params.examType && params.examType !== "all" && params.examType !== "All") {
    searchParams.set("examType", params.examType);
  }
  if (params.searchTerm) {
    searchParams.set("searchTerm", params.searchTerm.trim());
  }
  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

function buildQuestionFormData(payload: CreateQuestionPayload | UpdateQuestionPayload) {
  const formData = new FormData();
  if (payload.examType) formData.append("examType", payload.examType);
  if (payload.year) formData.append("year", String(payload.year));
  if (payload.questionText) formData.append("questionText", payload.questionText);
  if (payload.options) formData.append("options", JSON.stringify(payload.options));
  if (payload.correctOptionIndex !== undefined) {
    formData.append("correctOptionIndex", String(payload.correctOptionIndex));
  }
  if (payload.access) formData.append("access", payload.access);
  if (payload.difficultyLevel) formData.append("difficultyLevel", payload.difficultyLevel);
  if (payload.status) formData.append("status", payload.status);
  if (payload.subject) formData.append("subject", payload.subject);
  if (payload.faculty) formData.append("faculty", payload.faculty);
  if (payload.departments && payload.departments.length > 0) {
    formData.append("departments", JSON.stringify(payload.departments));
  }
  if (payload.passage) formData.append("passage", payload.passage);
  if (payload.explanation) formData.append("explanation", payload.explanation);
  if (payload.question_image) formData.append("question_image", payload.question_image);

  return formData;
}

function buildPassageFormData(payload: CreatePassagePayload | UpdatePassagePayload) {
  const formData = new FormData();
  formData.append(
    "data",
    JSON.stringify({
      passageCode: payload.passageCode,
      title: payload.title,
      content: payload.content,
    })
  );
  if (payload.passage_image) {
    formData.append("passage_image", payload.passage_image);
  }
  return formData;
}

export const questionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // 1. Overview & Meta Filters
    getQuestionOverview: builder.query<ApiEnvelope<QuestionOverviewData>, void>({
      query: () => "/admin/questions/overview",
      providesTags: ["Questions"],
    }),
    getMetaFilters: builder.query<ApiEnvelope<MetaFiltersData>, void>({
      query: () => "/admin/questions/meta-filters",
      providesTags: ["Questions"],
    }),

    // 2. Question Bank
    getQuestions: builder.query<QuestionListResponse, QuestionListParams | void>({
      query: (params) => `/admin/questions${buildQuestionQuery(params ?? undefined)}`,
      providesTags: ["Questions"],
    }),
    getSingleQuestion: builder.query<ApiEnvelope<SingleQuestionResponse>, string>({
      query: (questionId) => `/admin/questions/single/${questionId}`,
      providesTags: (_res, _err, id) => [{ type: "Questions", id }],
    }),
    addQuestion: builder.mutation<ApiEnvelope<QuestionListItem>, CreateQuestionPayload>({
      query: (payload) => ({
        url: "/admin/questions/add",
        method: "POST",
        body: buildQuestionFormData(payload),
      }),
      invalidatesTags: ["Questions"],
    }),
    updateQuestion: builder.mutation<ApiEnvelope<QuestionListItem>, UpdateQuestionPayload>({
      query: ({ questionId, ...payload }) => ({
        url: `/admin/questions/${questionId}`,
        method: "PATCH",
        body: buildQuestionFormData(payload as CreateQuestionPayload),
      }),
      invalidatesTags: ["Questions"],
    }),
    updateQuestionStatus: builder.mutation<
      ApiEnvelope<QuestionListItem>,
      { questionId: string; status: "published" | "draft" | "hidden" | "archived" | string }
    >({
      query: ({ questionId, status }) => ({
        url: `/admin/questions/${questionId}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Questions"],
    }),
    deleteQuestion: builder.mutation<ApiEnvelope<unknown>, string>({
      query: (questionId) => ({
        url: `/admin/questions/${questionId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Questions"],
    }),

    // 3. Test Archive
    getTestArchive: builder.query<TestArchiveResponse, TestArchiveParams | void>({
      query: (params) => `/admin/questions/test-archive${buildArchiveQuery(params ?? undefined)}`,
      providesTags: ["Questions"],
    }),
    getSingleTest: builder.query<ApiEnvelope<TestArchiveItem & { questions?: QuestionListItem[] }>, string>({
      query: (testId) => `/admin/questions/test-archive/${testId}`,
      providesTags: (_res, _err, id) => [{ type: "Questions", id }],
    }),
    createTest: builder.mutation<ApiEnvelope<TestArchiveItem>, CreateTestPayload>({
      query: (payload) => ({
        url: "/admin/questions/test-archive/create",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Questions"],
    }),
    updateTest: builder.mutation<ApiEnvelope<TestArchiveItem>, UpdateTestPayload>({
      query: ({ testId, ...payload }) => ({
        url: `/admin/questions/test-archive/${testId}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["Questions"],
    }),
    updateTestStatus: builder.mutation<
      ApiEnvelope<TestArchiveItem>,
      { testId: string; status: "published" | "draft" | "hidden" | string }
    >({
      query: ({ testId, status }) => ({
        url: `/admin/questions/test-archive/${testId}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Questions"],
    }),
    deleteTest: builder.mutation<ApiEnvelope<unknown>, string>({
      query: (testId) => ({
        url: `/admin/questions/test-archive/${testId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Questions"],
    }),
    duplicateTest: builder.mutation<ApiEnvelope<TestArchiveItem>, DuplicateTestPayload>({
      query: ({ testId, ...body }) => ({
        url: `/admin/questions/test-archive/${testId}/duplicate`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Questions"],
    }),
    copyYearQuestions: builder.mutation<ApiEnvelope<unknown>, CopyYearPayload>({
      query: (body) => ({
        url: "/admin/questions/test-archive/copy-year",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Questions"],
    }),

    // 4. Passages
    getPassages: builder.query<PassageListResponse, PassageListParams | void>({
      query: (params) => `/admin/questions/passages${buildPassageQuery(params ?? undefined)}`,
      providesTags: ["Questions"],
    }),
    getSinglePassage: builder.query<ApiEnvelope<PassageItem>, string>({
      query: (passageId) => `/admin/questions/passage/${passageId}`,
      providesTags: (_res, _err, id) => [{ type: "Questions", id }],
    }),
    createPassage: builder.mutation<ApiEnvelope<PassageItem>, CreatePassagePayload>({
      query: (payload) => ({
        url: "/admin/questions/passage/add",
        method: "POST",
        body: buildPassageFormData(payload),
      }),
      invalidatesTags: ["Questions"],
    }),
    updatePassage: builder.mutation<ApiEnvelope<PassageItem>, UpdatePassagePayload>({
      query: ({ passageId, ...payload }) => ({
        url: `/admin/questions/passage/${passageId}`,
        method: "PATCH",
        body: buildPassageFormData(payload as CreatePassagePayload),
      }),
      invalidatesTags: ["Questions"],
    }),
    togglePassageStatus: builder.mutation<ApiEnvelope<PassageItem>, string>({
      query: (passageId) => ({
        url: `/admin/questions/passage/${passageId}/status`,
        method: "PATCH",
      }),
      invalidatesTags: ["Questions"],
    }),
    deletePassage: builder.mutation<ApiEnvelope<unknown>, string>({
      query: (passageId) => ({
        url: `/admin/questions/passage/${passageId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Questions"],
    }),

    // 5. Import CSV / XLSX
    importQuestionsCsv: builder.mutation<ImportCsvResponse, File>({
      query: (file) => {
        const formData = new FormData();
        formData.append("csv_file", file);
        return {
          url: "/admin/questions/import-csv",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Questions"],
    }),

    // 6. Subjects
    getSubjects: builder.query<ApiEnvelope<SubjectItem[]>, SubjectListParams | void>({
      query: (params) => `/admin/questions/subjects${buildSubjectQuery(params ?? undefined)}`,
      providesTags: ["Questions"],
    }),
    createSubject: builder.mutation<ApiEnvelope<SubjectItem>, CreateSubjectPayload>({
      query: (payload) => ({
        url: "/admin/questions/subjects/add",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Questions"],
    }),
    updateSubject: builder.mutation<ApiEnvelope<SubjectItem>, UpdateSubjectPayload>({
      query: ({ id, ...body }) => ({
        url: `/admin/questions/subjects/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Questions"],
    }),
    deleteSubject: builder.mutation<ApiEnvelope<unknown>, string>({
      query: (id) => ({
        url: `/admin/questions/subjects/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Questions"],
    }),
  }),
});

export const {
  // Overview & Meta
  useGetQuestionOverviewQuery,
  useGetMetaFiltersQuery,

  // Question Bank
  useGetQuestionsQuery,
  useGetSingleQuestionQuery,
  useLazyGetSingleQuestionQuery,
  useAddQuestionMutation,
  useUpdateQuestionMutation,
  useUpdateQuestionStatusMutation,
  useDeleteQuestionMutation,

  // Test Archive
  useGetTestArchiveQuery,
  useGetSingleTestQuery,
  useLazyGetSingleTestQuery,
  useCreateTestMutation,
  useUpdateTestMutation,
  useUpdateTestStatusMutation,
  useDeleteTestMutation,
  useDuplicateTestMutation,
  useCopyYearQuestionsMutation,

  // Passages
  useGetPassagesQuery,
  useGetSinglePassageQuery,
  useLazyGetSinglePassageQuery,
  useCreatePassageMutation,
  useUpdatePassageMutation,
  useTogglePassageStatusMutation,
  useDeletePassageMutation,

  // Import
  useImportQuestionsCsvMutation,

  // Subjects
  useGetSubjectsQuery,
  useCreateSubjectMutation,
  useUpdateSubjectMutation,
  useDeleteSubjectMutation,
} = questionApi;
