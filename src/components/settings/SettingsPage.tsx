/* eslint-disable @next/next/no-img-element */
"use client";

import { getErrorMessage } from "@/store/apis/authApi";
import {
  useChangePasswordMutation,
  useUpdateProfileImageMutation,
  useUpdateProfileMutation,
} from "@/store/apis/settingsApi";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setCredentials } from "@/store/slices/authSlice";
import {
  Camera,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  User,
  XCircle,
} from "lucide-react";
import { useRef, useState } from "react";

/* ─────────────────── types ─────────────────── */
type Tab = "profile" | "password";

interface Toast {
  type: "success" | "error";
  message: string;
}

/* ─────────────────── helpers ─────────────────── */
const inputBase =
  "h-11 w-full rounded-xl border bg-white/80 px-4 text-sm text-[#2f3f52] outline-none transition-all duration-200 placeholder:text-[#9ab0c3] focus:border-[#2f86d8] focus:ring-2 focus:ring-[#2f86d8]/20";

const inputClass = `${inputBase} border-[#d0e3f5]`;

/* ─────────────────── Toast ─────────────────── */
function ToastBanner({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  return (
    <div
      className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium shadow-lg ${
        toast.type === "success"
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-red-200 bg-red-50 text-red-700"
      }`}
    >
      {toast.type === "success" ? (
        <CheckCircle2 className="h-4 w-4 shrink-0" />
      ) : (
        <XCircle className="h-4 w-4 shrink-0" />
      )}
      <span className="flex-1">{toast.message}</span>
      <button type="button" onClick={onClose} className="ml-2 opacity-60 hover:opacity-100">
        ✕
      </button>
    </div>
  );
}

/* ─────────────────── Tab Button ─────────────────── */
function TabButton({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ElementType;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative flex items-center gap-2.5 rounded-xl px-6 py-3 text-sm font-semibold transition-all duration-300 ${
        active
          ? "bg-white text-[#2f86d8] shadow-md shadow-[#2f86d8]/10"
          : "text-[#6b8399] hover:bg-white/60 hover:text-[#3f5f7a]"
      }`}
    >
      <Icon
        className={`h-4 w-4 transition-transform duration-200 ${active ? "scale-110" : "group-hover:scale-105"}`}
      />
      {label}
      {active && (
        <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-linear-to-r from-[#2360A5] to-[#4584CA]" />
      )}
    </button>
  );
}

/* ─────────────────── Password Input ─────────────────── */
function PasswordInput({
  value,
  onChange,
  placeholder,
  id,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  id: string;
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
        className={`${inputClass} pr-11`}
      />
      <button
        type="button"
        onClick={() => setShow((p) => !p)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8ba5bd] transition-colors hover:text-[#2f86d8]"
        aria-label={show ? "Hide password" : "Show password"}
      >
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}

/* ─────────────────── Main Component ─────────────────── */
export default function SettingsPage() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const token = useAppSelector((s) => s.auth.token);
  const refreshToken = useAppSelector((s) => s.auth.refreshToken);

  /* tabs */
  const [activeTab, setActiveTab] = useState<Tab>("profile");

  /* profile form */
  const [fullName, setFullName] = useState(user?.name ?? "");
  const [city, setCity] = useState("");

  /* avatar preview */
  const fileRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  /* password form */
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  /* toast */
  const [toast, setToast] = useState<Toast | null>(null);

  /* RTK mutations */
  const [updateProfile, { isLoading: updatingProfile }] = useUpdateProfileMutation();
  const [updateProfileImage, { isLoading: updatingImage }] = useUpdateProfileImageMutation();
  const [changePassword, { isLoading: changingPw }] = useChangePasswordMutation();

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4500);
  };

  /* ── avatar file pick ── */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setAvatarPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  /* ── save profile (image + info) ── */
  const handleSaveProfile = async () => {
    try {
      /* 1) upload image if changed */
      if (avatarFile) {
        const fd = new FormData();
        fd.append("profile_image", avatarFile);
        const imgRes = await updateProfileImage(fd).unwrap();
        const updatedUser = imgRes.data;
        if (updatedUser && user) {
          dispatch(
            setCredentials({
              user: {
                id: updatedUser.id ?? user.id,
                name: updatedUser.fullName ?? user.name,
                email: updatedUser.email ?? user.email,
                role: updatedUser.role ?? user.role,
                avatar: updatedUser.avatar ?? user.avatar,
              },
              token: token ?? "",
              refreshToken,
            })
          );
        }
        setAvatarFile(null);
      }

      /* 2) update text info */
      if (fullName.trim() || city.trim()) {
        const body: { fullName?: string; city?: string } = {};
        if (fullName.trim()) body.fullName = fullName.trim();
        if (city.trim()) body.city = city.trim();

        const res = await updateProfile(body).unwrap();
        const updatedUser = res.data;
        if (updatedUser && user) {
          dispatch(
            setCredentials({
              user: {
                id: updatedUser.id ?? user.id,
                name: updatedUser.fullName ?? user.name,
                email: updatedUser.email ?? user.email,
                role: updatedUser.role ?? user.role,
                avatar: updatedUser.avatar ?? user.avatar,
              },
              token: token ?? "",
              refreshToken,
            })
          );
          setFullName(updatedUser.fullName ?? fullName);
        }
      }

      showToast("success", "Profile updated successfully!");
    } catch (err) {
      showToast("error", getErrorMessage(err, "Failed to update profile."));
    }
  };

  /* ── change password ── */
  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      showToast("error", "Please fill all password fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast("error", "New passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
      showToast("error", "New password must be at least 6 characters.");
      return;
    }
    try {
      await changePassword({ oldPassword, newPassword }).unwrap();
      showToast("success", "Password changed successfully!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      showToast("error", getErrorMessage(err, "Failed to change password."));
    }
  };

  /* current avatar to display */
  const displayAvatar = avatarPreview ?? user?.avatar ?? null;
  const displayName = user?.name ?? "Admin";
  const displayRole = user?.role ?? "Administrator";
  const initials = displayName.charAt(0).toUpperCase();

  const isBusy = updatingProfile || updatingImage || changingPw;

  return (
    <div className="min-h-full rounded-2xl bg-[#edf4fb] p-4 md:p-8">
      <div className="mx-auto w-full max-w-2xl space-y-6">

        {/* ── Toast ── */}
        {toast && (
          <div className="animate-in slide-in-from-top-2 duration-300">
            <ToastBanner toast={toast} onClose={() => setToast(null)} />
          </div>
        )}

        {/* ── Hero / Profile Banner ── */}
        <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-[#2360A5] via-[#2f86d8] to-[#4ac8f8] p-6 text-white shadow-xl">
          {/* decorative blobs */}
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-white/10 blur-xl" />

          <div className="relative flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:gap-6">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-white/40 shadow-xl ring-2 ring-white/20">
                {displayAvatar ? (
                  <img
                    src={displayAvatar}
                    alt={displayName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-white/20 text-3xl font-bold text-white">
                    {initials}
                  </div>
                )}
              </div>

              {/* Camera button */}
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="absolute bottom-0.5 right-0.5 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-[#2f86d8] text-white shadow-lg transition-all hover:scale-110 hover:bg-[#2360A5]"
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

            {/* Name / Role */}
            <div className="text-center sm:text-left">
              <p className="text-2xl font-bold leading-tight tracking-tight">{displayName}</p>
              <p className="mt-1 text-sm font-medium uppercase tracking-widest text-white/70">
                {displayRole}
              </p>
              {user?.email && (
                <p className="mt-1 text-xs text-white/60">{user.email}</p>
              )}
            </div>

            {/* Preview badge */}
            {avatarPreview && (
              <div className="ml-auto hidden items-center gap-2 rounded-full bg-white/20 px-3 py-1.5 text-xs font-semibold backdrop-blur-sm sm:flex">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-300" />
                Preview mode
              </div>
            )}
          </div>
        </div>

        {/* ── Tab Bar ── */}
        <div className="flex gap-2 rounded-2xl bg-[#dce9f5] p-1.5 shadow-inner">
          <TabButton
            active={activeTab === "profile"}
            onClick={() => setActiveTab("profile")}
            icon={User}
            label="Edit Profile"
          />
          <TabButton
            active={activeTab === "password"}
            onClick={() => setActiveTab("password")}
            icon={KeyRound}
            label="Change Password"
          />
        </div>

        {/* ── Panel ── */}
        <div className="rounded-2xl border border-[#d0e3f5] bg-white/80 p-6 shadow-sm backdrop-blur-sm">
          {activeTab === "profile" ? (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-bold text-[#1e3248]">Edit Profile</h2>
                <p className="mt-0.5 text-xs text-[#7f9ab3]">
                  Update your name, city, or profile photo.
                </p>
              </div>

              {/* Full Name */}
              <div className="space-y-1.5">
                <label htmlFor="fullName" className="text-xs font-semibold uppercase tracking-wider text-[#5a7a96]">
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

              {/* City */}
              <div className="space-y-1.5">
                <label htmlFor="city" className="text-xs font-semibold uppercase tracking-wider text-[#5a7a96]">
                  City
                </label>
                <input
                  id="city"
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Dhaka"
                  className={inputClass}
                />
              </div>

              {/* Profile image picker (inline) */}
              <div className="space-y-1.5">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#5a7a96]">
                  Profile Photo
                </p>
                <div
                  onClick={() => fileRef.current?.click()}
                  className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-[#b8d4ed] bg-[#f0f7ff] px-4 py-3 transition-colors hover:border-[#2f86d8] hover:bg-[#e6f2ff]"
                >
                  <Camera className="h-4 w-4 shrink-0 text-[#2f86d8]" />
                  <span className="text-sm text-[#5a7a96]">
                    {avatarFile ? avatarFile.name : "Click to select a new photo…"}
                  </span>
                  {avatarPreview && (
                    <img
                      src={avatarPreview}
                      alt="preview"
                      className="ml-auto h-10 w-10 rounded-full object-cover ring-2 ring-[#2f86d8]/30"
                    />
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={handleSaveProfile}
                disabled={isBusy}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#2360A5] to-[#4584CA] text-sm font-bold text-white shadow-md shadow-[#2360A5]/20 transition-all hover:opacity-90 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
              >
                {(updatingProfile || updatingImage) && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                Save Changes
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-bold text-[#1e3248]">Change Password</h2>
                <p className="mt-0.5 text-xs text-[#7f9ab3]">
                  Use a strong password you haven&apos;t used before.
                </p>
              </div>

              {/* Old password */}
              <div className="space-y-1.5">
                <label htmlFor="oldPassword" className="text-xs font-semibold uppercase tracking-wider text-[#5a7a96]">
                  Current Password
                </label>
                <PasswordInput
                  id="oldPassword"
                  value={oldPassword}
                  onChange={setOldPassword}
                  placeholder="Enter current password"
                />
              </div>

              {/* New password */}
              <div className="space-y-1.5">
                <label htmlFor="newPassword" className="text-xs font-semibold uppercase tracking-wider text-[#5a7a96]">
                  New Password
                </label>
                <PasswordInput
                  id="newPassword"
                  value={newPassword}
                  onChange={setNewPassword}
                  placeholder="Enter new password"
                />
              </div>

              {/* Confirm new password */}
              <div className="space-y-1.5">
                <label htmlFor="confirmPassword" className="text-xs font-semibold uppercase tracking-wider text-[#5a7a96]">
                  Confirm New Password
                </label>
                <PasswordInput
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                  placeholder="Re-enter new password"
                />
                {confirmPassword && newPassword !== confirmPassword && (
                  <p className="flex items-center gap-1 text-xs text-red-500">
                    <XCircle className="h-3 w-3" /> Passwords do not match
                  </p>
                )}
                {confirmPassword && newPassword === confirmPassword && confirmPassword.length > 0 && (
                  <p className="flex items-center gap-1 text-xs text-emerald-600">
                    <CheckCircle2 className="h-3 w-3" /> Passwords match
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={handleChangePassword}
                disabled={changingPw}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#2360A5] to-[#4584CA] text-sm font-bold text-white shadow-md shadow-[#2360A5]/20 transition-all hover:opacity-90 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
              >
                {changingPw && <Loader2 className="h-4 w-4 animate-spin" />}
                Update Password
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
