// ==========================================
// Component: ProfileForm - edit my profile (/profile)
// Picture, name, username, bio, location, date of birth, and password.
// The email is shown but cannot be changed here (it is the key of the account).
// ==========================================

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, CheckCircle2, KeyRound, Loader2, Mail, Save } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useToast } from "@/components/ui/ToastProvider";
import type { ProfileData } from "@/lib/chat-types";

const inputClass =
  "w-full rounded-xl bg-card border border-line px-4 py-3 text-sm text-strong placeholder:text-slate-500 outline-none transition-all duration-300 focus:border-pink-500/70 focus:ring-4 focus:ring-pink-500/15";
const labelClass = "block text-xs font-semibold text-slate-300 mb-1.5";

interface ProfileFormProps {
  user: { name: string; email: string; image: string | null; verified: boolean };
  profile: ProfileData;
}

export default function ProfileForm({ user, profile }: ProfileFormProps) {
  const router = useRouter();
  const toast = useToast();

  const [name, setName] = useState(user.name);
  const [image, setImage] = useState(user.image ?? "");
  const [username, setUsername] = useState(profile.username);
  const [bio, setBio] = useState(profile.bio);
  const [location, setLocation] = useState(profile.location);
  const [dob, setDob] = useState(profile.dob);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changing, setChanging] = useState(false);

  const onPicture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/upload/avatar", { method: "POST", body: form });
      const data = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
      if (!res.ok || !data.url) throw new Error(data.error ?? "Upload failed.");
      setImage(data.url);
      toast.success("Picture ready. Press Save profile to keep it.", { title: "Uploaded" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const saveProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (name.trim().length < 2) return toast.error("Please enter your name.");
    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, bio, location, dob }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Could not save your profile.");

      // name and picture are stored by the login system
      const updated = await authClient.updateUser({
        name: name.trim(),
        ...(image ? { image } : {}),
      });
      if (updated?.error) throw new Error(updated.error.message ?? "Could not save your name.");

      toast.success("Your profile is up to date.", { title: "Profile saved" });
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save your profile.");
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newPassword.length < 8) return toast.error("The new password needs at least 8 characters.");
    if (newPassword !== confirmPassword) return toast.error("The two new passwords do not match.");
    setChanging(true);
    try {
      const result = await authClient.changePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions: true,
      });
      if (result?.error) {
        toast.error(
          result.error.message ??
            "Could not change the password. If you sign in with GitHub or Google, you have no password to change.",
        );
        return;
      }
      toast.success("Your password was changed.", { title: "Password updated" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      toast.error("Could not change the password.");
    } finally {
      setChanging(false);
    }
  };

  return (
    <div className="space-y-8">
      <form onSubmit={saveProfile} className="spin-border relative rounded-3xl bg-card border border-line p-6 sm:p-8 space-y-6">
        {/* picture */}
        <div className="flex items-center gap-5">
          <span className="relative shrink-0">
            {image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={image} alt="Your profile picture" className="w-24 h-24 rounded-full object-cover ring-4 ring-pink-500/30" />
            ) : (
              <span className="w-24 h-24 rounded-full bg-linear-to-br from-pink-500 to-fuchsia-500 text-white text-3xl font-bold flex items-center justify-center ring-4 ring-pink-500/30">
                {(name || user.email).charAt(0).toUpperCase()}
              </span>
            )}
            <label className="absolute -bottom-1 -right-1 w-9 h-9 rounded-full bg-pink-600 text-white flex items-center justify-center cursor-pointer shadow-lg hover:scale-110 active:scale-90 transition-transform">
              {uploading ? <Loader2 size={16} className="animate-spin" /> : <Camera size={16} />}
              <input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={onPicture} />
            </label>
          </span>
          <div>
            <p className="text-lg font-bold text-strong">{name || "Your name"}</p>
            <p className="text-xs text-slate-400">JPG, PNG or WebP, up to 2 MB</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="block">
            <span className={labelClass}>Name</span>
            <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} maxLength={60} required />
          </label>
          <label className="block">
            <span className={labelClass}>Username</span>
            <input
              className={inputClass}
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase())}
              placeholder="lamia.k"
              maxLength={20}
              autoComplete="off"
            />
          </label>

          <div className="sm:col-span-2">
            <span className={labelClass}>Email</span>
            <div className="flex flex-wrap items-center gap-3 rounded-xl bg-card border border-line px-4 py-3 text-sm text-slate-300">
              <Mail size={16} className="text-pink-400" />
              <span className="break-all">{user.email}</span>
              {user.verified && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-500">
                  <CheckCircle2 size={14} /> Verified
                </span>
              )}
            </div>
            <p className="mt-1.5 text-xs text-slate-500">
              The email is your login. To change it, write to me from your Inbox and I will help.
            </p>
          </div>

          <label className="block">
            <span className={labelClass}>Location</span>
            <input className={inputClass} value={location} onChange={(e) => setLocation(e.target.value)} placeholder="City, Country" maxLength={80} />
          </label>
          <label className="block">
            <span className={labelClass}>Date of birth (private)</span>
            <input type="date" className={inputClass} value={dob} onChange={(e) => setDob(e.target.value)} max={new Date().toISOString().slice(0, 10)} />
          </label>
          <label className="block sm:col-span-2">
            <span className={labelClass}>Bio ({bio.length}/200)</span>
            <textarea className={`${inputClass} resize-y`} rows={3} value={bio} onChange={(e) => setBio(e.target.value)} maxLength={200} placeholder="A few words about you" />
          </label>
        </div>

        <button
          type="submit"
          disabled={saving || uploading}
          className="btn-shine relative overflow-hidden inline-flex items-center gap-2 px-6 py-3 rounded-full bg-linear-to-r from-pink-600 via-fuchsia-500 to-pink-500 text-white text-sm font-semibold shadow-[0_0_25px_rgba(236,72,153,0.5)] hover:scale-105 active:scale-95 disabled:opacity-60 transition-all"
        >
          {saving ? <Loader2 size={16} className="relative z-10 animate-spin" /> : <Save size={16} className="relative z-10" />}
          <span className="relative z-10">Save profile</span>
        </button>
      </form>

      <form onSubmit={changePassword} className="rounded-3xl bg-card border border-line p-6 sm:p-8 space-y-4">
        <h2 className="flex items-center gap-2 text-lg font-bold text-strong">
          <KeyRound size={18} className="text-pink-400" /> Change password
        </h2>
        <p className="text-xs text-slate-500">
          Only for accounts created with an email and password. If you sign in with GitHub or Google, there is no password here.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <input type="password" className={inputClass} placeholder="Current password" autoComplete="current-password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
          <input type="password" className={inputClass} placeholder="New password (8+)" autoComplete="new-password" minLength={8} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
          <input type="password" className={inputClass} placeholder="Repeat new password" autoComplete="new-password" minLength={8} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
        </div>
        <button
          type="submit"
          disabled={changing}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-pink-500/50 bg-pink-500/10 text-sm font-semibold text-strong hover:bg-pink-500/20 active:scale-95 disabled:opacity-60 transition-all"
        >
          {changing && <Loader2 size={16} className="animate-spin" />}
          Update password
        </button>
      </form>
    </div>
  );
}
