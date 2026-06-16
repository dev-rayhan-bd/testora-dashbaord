import type { ApiEnvelope } from "./authApi";
import { baseApi } from "./baseApi";

export interface QuestionListItem {
  _id: string;
  examType: string;
  year: number;
  questionText: string;
  access: string;
  difficultyLevel: string;
  correctOptionIndex: number;
  status: string;
  createdAt: string;
  subjectName: string;
  facultyName: string;
  passageCode: string | null;
}

export interface QuestionListResponse {
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  questions: QuestionListItem[];
}

export interface QuestionOption {
  text: string;
}

export interface SingleQuestionResponse {
  questionId: string;
  examType: string;
  year: number;
  questionText: string;
  questionImageUrl: string | null;
  options: QuestionOption[];
  correctOptionIndex: number;
  explanation: string;
  difficultyLevel: string;
  access: string;
  status: string;
  createdAt: string;
  subjectName: string;
  facultyName: string;
  departments: string[];
  passage: string | null;
  testIds: string[];
  stats: {
    totalAttempts: number;
    correctCount: number;
    wrongCount: number;
    correctPercentage: number;
  };
}

export interface QuestionListParams {
  page?: number;
  limit?: number;
  examType?: string;
  searchTerm?: string;
}

export interface QuestionOverviewData {
  [key: string]: number;
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
  totalQuestions: number;
  access: string;
  status: string;
  createdAt: string;
  subjectName: string | null;
  facultyName: string;
  departments: string[];
}

export interface TestArchiveResponse {
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  tests: TestArchiveItem[];
}

export interface TestArchiveParams {
  page?: number;
  limit?: number;
  testType?: string;
}

export interface CreatePassageRequest {
  passageCode: string;
  title: string;
  content: string;
  passageImage?: File | null;
}

function buildQuery(params?: QuestionListParams) {
  if (!params) return "";

  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set("page", String(params.page));
  if (params.limit) searchParams.set("limit", String(params.limit));
  if (params.examType) searchParams.set("examType", params.examType);
  if (params.searchTerm) searchParams.set("searchTerm", params.searchTerm);

  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

function buildArchiveQuery(params?: TestArchiveParams) {
  if (!params) return "";

  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set("page", String(params.page));
  if (params.limit) searchParams.set("limit", String(params.limit));
  if (params.testType) searchParams.set("testType", params.testType);

  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

function buildPassageFormData(body: CreatePassageRequest) {
  const formData = new FormData();
  formData.append(
    "data",
    JSON.stringify({
      passageCode: body.passageCode,
      title: body.title,
      content: body.content,
    })
  );

  if (body.passageImage) {
    formData.append("passage_image", body.passageImage);
  }

  return formData;
}

export const questionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getQuestions: builder.query<ApiEnvelope<QuestionListResponse>, QuestionListParams | void>({
      query: (params) => `/admin/questions${buildQuery(params ?? undefined)}`,
      providesTags: ["Auth"],
    }),
    getSingleQuestion: builder.query<ApiEnvelope<SingleQuestionResponse>, string>({
      query: (questionId) => `/admin/questions/single/${questionId}`,
      providesTags: ["Auth"],
    }),
    getQuestionOverview: builder.query<ApiEnvelope<QuestionOverviewData>, void>({
      query: () => "/admin/questions/overview",
      providesTags: ["Questions"],
    }),
    getTestArchive: builder.query<ApiEnvelope<TestArchiveResponse>, TestArchiveParams | void>({
      query: (params) => `/admin/questions/test-archive${buildArchiveQuery(params ?? undefined)}`,
      providesTags: ["Questions"],
    }),
    createPassage: builder.mutation<ApiEnvelope<unknown>, CreatePassageRequest>({
      query: (body) => ({
        url: "/admin/questions/passage/add",
        method: "POST",
        body: buildPassageFormData(body),
      }),
      invalidatesTags: ["Questions"],
    }),
    importQuestionsCsv: builder.mutation<ApiEnvelope<unknown>, File>({
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
  }),
});

export const { useGetQuestionsQuery, useGetSingleQuestionQuery, useLazyGetSingleQuestionQuery } =
  questionApi;
export const {
  useGetQuestionOverviewQuery,
  useGetTestArchiveQuery,
  useCreatePassageMutation,
  useImportQuestionsCsvMutation,
} = questionApi;
