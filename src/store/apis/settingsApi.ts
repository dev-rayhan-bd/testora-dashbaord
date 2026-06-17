import type { ApiEnvelope } from "./authApi";
import { baseApi } from "./baseApi";

export interface UpdateProfileRequest {
  fullName?: string;
  city?: string;
}

export interface UpdateProfileData {
  id: string;
  fullName: string;
  email: string;
  city?: string;
  avatar?: string;
  role: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export const settingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    updateProfile: builder.mutation<ApiEnvelope<UpdateProfileData>, UpdateProfileRequest>({
      query: (body) => ({
        url: "/user/update-profile",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Auth"],
    }),
    updateProfileImage: builder.mutation<ApiEnvelope<UpdateProfileData>, FormData>({
      query: (formData) => ({
        url: "/user/update-profile-image",
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: ["Auth"],
    }),
    changePassword: builder.mutation<ApiEnvelope<unknown>, ChangePasswordRequest>({
      query: (body) => ({
        url: "/auth/change-password",
        method: "PATCH",
        body,
      }),
    }),
  }),
});

export const {
  useUpdateProfileMutation,
  useUpdateProfileImageMutation,
  useChangePasswordMutation,
} = settingsApi;
