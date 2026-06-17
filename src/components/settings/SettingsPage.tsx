/* eslint-disable @next/next/no-img-element */
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
import { useRef, useState } from "react";

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
  const user = useAppSelector((s) => s.auth.user);
  const token = useAppSelector((s) => s.auth.token);
  const refreshToken = useAppSelector((s) => s.auth.refreshToken);

  const [activeTab, setActiveTab] = useState<Tab>("edit");

  /* profile */
  const [fullName, setFullName] = useState(user?.name ?? "");
  const fileRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  /* password */
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  /* feedback */
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  /* RTK mutations */
  const [updateProfile, { isLoading: updatingProfile }] = useUpdateProfileMutation();
  const [updateProfileImage, { isLoading: updatingImage }] = useUpdateProfileImageMutation();
  const [changePassword, { isLoading: changingPw }] = useChangePasswordMutation();

  const showMsg = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setAvatarPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async () => {
    try {
      if (avatarFile) {
        const fd = new FormData();
        fd.append("profile_image", avatarFile);
        const imgRes = await updateProfileImage(fd).unwrap();
        const u = imgRes.data;
        if (u && user) {
          dispatch(
            setCredentials({
              user: {
                id: u.id ?? user.id,
                name: u.fullName ?? user.name,
                email: u.email ?? user.email,
                role: u.role ?? user.role,
                avatar: u.avatar ?? user.avatar,
              },
              token: token ?? "",
              refreshToken,
            })
          );
        }
        setAvatarFile(null);
        setAvatarPreview(null);
      }

      if (fullName.trim()) {
        const res = await updateProfile({ fullName: fullName.trim() }).unwrap();
        const u = res.data;
        if (u && user) {
          dispatch(
            setCredentials({
              user: {
                id: u.id ?? user.id,
                name: u.fullName ?? user.name,
                email: u.email ?? user.email,
                role: u.role ?? user.role,
                avatar: u.avatar ?? user.avatar,
              },
              token: token ?? "",
              refreshToken,
            })
          );
          setFullName(u.fullName ?? fullName);
        }
      }

      showMsg("success", "Profile updated successfully.");
    } catch (err) {
      showMsg("error", getErrorMessage(err, "Failed to update profile."));
    }
  };

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      showMsg("error", "Please fill in all password fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      showMsg("error", "New passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
      showMsg("error", "New password must be at least 6 characters.");
      return;
    }
    try {
      await changePassword({ oldPassword, newPassword }).unwrap();
      showMsg("success", "Password changed successfully.");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      showMsg("error", getErrorMessage(err, "Failed to change password."));
    }
  };

  const displayAvatar = avatarPreview ?? user?.avatar ?? null;
  const displayName = user?.name ?? "Admin";
  const displayRole = user?.role ?? "Administrator";
  const isBusy = updatingProfile || updatingImage || changingPw;

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
                  className="h-full w-full rounded-full border-2 border-[#ecf3fb] object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center rounded-full border-2 border-[#ecf3fb] bg-white/20 text-2xl font-bold text-white">
                  {displayName.charAt(0).toUpperCase()}
                </div>
              )}
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="absolute right-0 bottom-1 flex h-6 w-6 items-center justify-center rounded-full border border-[#9fc4ea] bg-[#e9f3fd] text-[#2f86d8] transition-colors hover:bg-white"
                aria-label="Change profile photo"
              >
                <Camera className="h-3.5 w-3.5" />
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
              <p className="text-4xl leading-tight font-semibold text-white">{displayName}</p>
              <p className="mt-1 text-lg leading-none text-[#deecfa]">{displayRole}</p>
              {avatarFile && <p className="mt-1.5 text-xs text-[#c4e0f7]">📷 {avatarFile.name}</p>}
            </div>
          </div>
        </div>

        {/* Feedback message */}
        {message && (
          <div
            className={cn(
              "mt-4 rounded-md border px-4 py-2.5 text-sm font-medium",
              message.type === "success"
                ? "border-green-200 bg-green-50 text-green-700"
                : "border-red-200 bg-red-50 text-red-700"
            )}
          >
            {message.text}
          </div>
        )}

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
                className="flex h-11 w-full items-center justify-center gap-2 rounded-md bg-linear-to-r from-[#2360A5] to-[#4584CA] text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {(updatingProfile || updatingImage) && <Loader2 className="h-4 w-4 animate-spin" />}
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
                <h2 className="text-2xl font-semibold text-[#2f3f52]">Change Password</h2>
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
                className="flex h-11 w-full items-center justify-center gap-2 rounded-md bg-linear-to-r from-[#2360A5] to-[#4584CA] text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {changingPw && <Loader2 className="h-4 w-4 animate-spin" />}
                Save &amp; Change
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
