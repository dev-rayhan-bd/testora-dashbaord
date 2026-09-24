"use client";

import { cn } from "@/lib/utils";
import { getErrorMessage } from "@/store/apis/authApi";
import {
  useChangePasswordMutation,
  useUpdateProfileImageMutation,
  useUpdateProfileMutation,
} from "@/store/apis/settingsApi";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setCredentials } from "@/store/slices/authSlice";
import { Camera, Eye, EyeOff, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

type Tab = "edit" | "password";

const inputClass =
  "h-10 w-full rounded-md border border-[#9fb3c6] bg-white px-3 text-sm text-[#3f5f7a] outline-none placeholder:text-[#9ab0c3] focus:border-[#2f86d8] focus:ring-2 focus:ring-[#2f86d8]/10 transition-all";

function PasswordInput({
  id,
  value,
  onChange,
  placeholder,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        id={id}
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(inputClass, "pr-10")}
      />
      <button
        type="button"
        onClick={() => setShow((p) => !p)}
        className="absolute top-1/2 right-3 -translate-y-1/2 text-[#7087a0] hover:text-[#2f86d8]"
        aria-label={show ? "Hide password" : "Show password"}
      >
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}

export default function SettingsPage() {
  const dispatch = useAppDispatch();
  const token = useAppSelector((s) => s.auth.token);
  const refreshToken = useAppSelector((s) => s.auth.refreshToken);
  const reduxUser = useAppSelector((s) => s.auth.user);

  const [activeTab, setActiveTab] = useState<Tab>("edit");

  /* RTK Queries & Mutations */
  const [updateProfile, { isLoading: updatingProfile }] = useUpdateProfileMutation();
  const [updateProfileImage, { isLoading: updatingImage }] = useUpdateProfileImageMutation();
  const [changePassword, { isLoading: changingPw }] = useChangePasswordMutation();

  /* profile state */
  const [fullName, setFullName] = useState(reduxUser?.name || "");
  const fileRef = useRef<HTMLInputElement>(null);

  /* password state */
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const fd = new FormData();
      fd.append("profile_image", file);
      const imgRes = await updateProfileImage(fd).unwrap();
      const u = imgRes.data;
      
      if (u) {
        dispatch(
          setCredentials({
            user: {
              id: u.id ?? reduxUser?.id ?? "",
              name: u.fullName ?? reduxUser?.name ?? "",
              email: u.email ?? reduxUser?.email ?? "",
              role: u.role ?? reduxUser?.role ?? "",
              avatar: u.profileImage ?? u.avatar ?? reduxUser?.avatar,
            },
            token: token ?? "",
            refreshToken,
          })
        );
        toast.success("Profile image updated successfully");
      }
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to upload profile image"));
    }
    
    // Reset file input
    if (fileRef.current) {
      fileRef.current.value = "";
    }
  };

  const handleSaveProfile = async () => {
    if (!fullName.trim()) {
      toast.error("Full name cannot be empty");
      return;
    }
    
    try {
      const res = await updateProfile({ fullName: fullName.trim() }).unwrap();
      const u = res.data;
      
      if (u) {
        dispatch(
          setCredentials({
            user: {
              id: u.id ?? reduxUser?.id ?? "",
              name: u.fullName ?? reduxUser?.name ?? "",
              email: u.email ?? reduxUser?.email ?? "",
              role: u.role ?? reduxUser?.role ?? "",
              avatar: u.profileImage ?? u.avatar ?? reduxUser?.avatar,
            },
            token: token ?? "",
            refreshToken,
          })
        );
      }

      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to update profile"));
    }
  };

  const validatePassword = (pw: string) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    return regex.test(pw);
  };

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }
    if (!validatePassword(newPassword)) {
      toast.error("New password must be at least 6 characters, contain 1 uppercase, 1 lowercase, 1 number, and 1 special character.");
      return;
    }
    
    try {
      await changePassword({ oldPassword, newPassword }).unwrap();
      toast.success("Password changed successfully.");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to change password."));
    }
  };

  const displayAvatar = reduxUser?.avatar;
  const displayName = reduxUser?.name ?? "Admin";
  const displayRole = reduxUser?.role ?? "Administrator";
  const isBusy = updatingProfile || changingPw;

  return (
    <div className="rounded-lg border border-[#dce7f2] bg-[#e5e6e8] p-4 md:p-10">
      <div className="mx-auto w-full max-w-2xl">
        {/* Profile banner */}
        <div className="rounded-2xl bg-linear-to-r from-[#4a9bd7] to-[#4398dc] px-5 py-5">
          <div className="flex items-center justify-center gap-5">
            {/* Avatar */}
            <div className="relative h-22 w-22 shrink-0">
              {displayAvatar ? (
                <img
                  src={displayAvatar}
                  alt={displayName}
                  className="h-full w-full rounded-full border-2 border-[#ecf3fb] object-cover bg-white"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center rounded-full border-2 border-[#ecf3fb] bg-white/20 text-2xl font-bold text-white uppercase">
                  {displayName.charAt(0)}
                </div>
              )}
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={updatingImage}
                className="absolute right-0 bottom-1 flex h-7 w-7 items-center justify-center rounded-full border border-[#9fc4ea] bg-[#e9f3fd] text-[#2f86d8] shadow-sm transition-colors hover:bg-white disabled:opacity-50 cursor-pointer"
                aria-label="Change profile photo"
              >
                {updatingImage ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Camera className="h-3.5 w-3.5" />}
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            <div>
              <p className="text-4xl leading-tight font-semibold text-white capitalize">{displayName}</p>
              <p className="mt-1 text-lg leading-none text-[#deecfa] capitalize">{displayRole}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mx-auto mt-8 max-w-xl">
          <div className="mb-6 flex items-center justify-center gap-8 border-b border-[#c9dbee] text-[18px]">
            <button
              type="button"
              onClick={() => setActiveTab("edit")}
              className={cn(
                "pb-2 font-medium transition-colors",
                activeTab === "edit"
                  ? "border-b-2 border-[#2f86d8] text-[#2f86d8]"
                  : "border-b-2 border-transparent text-[#557089] hover:text-[#3f5f7a]"
              )}
            >
              Edit Profile
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("password")}
              className={cn(
                "pb-2 font-medium transition-colors",
                activeTab === "password"
                  ? "border-b-2 border-[#2f86d8] text-[#2f86d8]"
                  : "border-b-2 border-transparent text-[#557089] hover:text-[#3f5f7a]"
              )}
            >
              Change Password
            </button>
          </div>

          {activeTab === "edit" ? (
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveProfile();
              }}
            >
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-[#2f3f52]">Edit Your Profile</h2>
              </div>

              <div className="space-y-1">
                <label htmlFor="fullName" className="text-sm font-medium text-[#4f6d87]">
                  Full Name
                </label>
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  className={inputClass}
                />
              </div>

              <button
                type="submit"
                disabled={isBusy}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-md bg-linear-to-r from-[#2360A5] to-[#4584CA] text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 mt-6"
              >
                {updatingProfile && <Loader2 className="h-4 w-4 animate-spin" />}
                Save &amp; Change
              </button>
            </form>
          ) : (
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                handleChangePassword();
              }}
            >
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-[#2f3f52]">Change Your Password</h2>
              </div>

              <div className="space-y-1">
                <label htmlFor="oldPassword" className="text-sm font-medium text-[#4f6d87]">
                  Current Password
                </label>
                <PasswordInput
                  id="oldPassword"
                  value={oldPassword}
                  onChange={setOldPassword}
                  placeholder="Enter current password"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="newPassword" className="text-sm font-medium text-[#4f6d87]">
                  New Password
                </label>
                <PasswordInput
                  id="newPassword"
                  value={newPassword}
                  onChange={setNewPassword}
                  placeholder="Enter new password"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-[#4f6d87]">
                  Confirm New Password
                </label>
                <PasswordInput
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                  placeholder="Re-enter new password"
                />
              </div>

              <button
                type="submit"
                disabled={changingPw}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-md bg-linear-to-r from-[#2360A5] to-[#4584CA] text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 mt-6"
              >
                {changingPw && <Loader2 className="h-4 w-4 animate-spin" />}
                Update Password
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
