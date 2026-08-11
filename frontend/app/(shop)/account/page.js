"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BadgeCheck, KeyRound, MailWarning } from "lucide-react";
import { toast } from "sonner";
import api, { getErrorMessage } from "@/lib/api";
import { useAuthStore } from "@/store/auth";
import { Input } from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { getInitials } from "@/lib/utils";

export default function ProfilePage() {
  const user = useAuthStore((state) => state.user);
  const refreshProfile = useAuthStore((state) => state.refreshProfile);

  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [savingProfile, setSavingProfile] = useState(false);
  const [resending, setResending] = useState(false);

  // Password change via email OTP
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordBusy, setPasswordBusy] = useState(false);

  if (!user) return null;

  const handleProfileSave = async (event) => {
    event.preventDefault();
    setSavingProfile(true);
    try {
      await api.put("/users/profile", { firstName, lastName });
      await refreshProfile();
      toast.success("Profile updated");
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not update your profile"));
    } finally {
      setSavingProfile(false);
    }
  };

  const handleResendVerification = async () => {
    setResending(true);
    try {
      const { data } = await api.post("/auth/resend-verification");
      toast.success(data.message || "Verification email sent — check your inbox");
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not send the email"));
    } finally {
      setResending(false);
    }
  };

  const handleSendOtp = async () => {
    setPasswordBusy(true);
    try {
      const { data } = await api.post("/users/password-reset/request", {
        email: user.email,
      });
      toast.success(data.message || "Verification code sent to your email");
      setOtpSent(true);
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not send the code"));
    } finally {
      setPasswordBusy(false);
    }
  };

  const handlePasswordChange = async (event) => {
    event.preventDefault();
    setPasswordBusy(true);
    try {
      const { data } = await api.put("/users/password-reset/verify", {
        email: user.email,
        otp,
        newPassword,
      });
      toast.success(data.message || "Password changed successfully");
      setOtpSent(false);
      setOtp("");
      setNewPassword("");
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not change your password"));
    } finally {
      setPasswordBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Identity card */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap items-center gap-5 rounded-3xl border border-stone-200 bg-white p-6"
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-stone-900 text-lg font-semibold text-white">
          {getInitials(user)}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-lg font-semibold tracking-tight">
            {user.firstName} {user.lastName}
          </p>
          <p className="truncate text-sm text-stone-500">{user.email}</p>
          {user.phone && (
            <p className="text-sm text-stone-400">{user.phone}</p>
          )}
        </div>
        {user.isVerified ? (
          <Badge tone="emerald">
            <BadgeCheck size={13} /> Verified
          </Badge>
        ) : (
          <Badge tone="amber">Unverified</Badge>
        )}
      </motion.section>

      {/* Verify email banner */}
      {!user.isVerified && (
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="flex flex-wrap items-center gap-4 rounded-3xl border border-amber-200 bg-amber-50 p-6"
        >
          <MailWarning size={22} className="shrink-0 text-amber-600" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-amber-900">
              Verify your email to place orders
            </p>
            <p className="mt-0.5 text-xs text-amber-700">
              We sent a verification link to {user.email}. Didn&apos;t get it?
            </p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            loading={resending}
            onClick={handleResendVerification}
          >
            Resend email
          </Button>
        </motion.section>
      )}

      {/* Edit profile */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-3xl border border-stone-200 bg-white p-6"
      >
        <h2 className="font-semibold tracking-tight">Personal details</h2>
        <form onSubmit={handleProfileSave} className="mt-5 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              id="profile-first"
              label="First name"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              required
            />
            <Input
              id="profile-last"
              label="Last name"
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              required
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit" loading={savingProfile}>
              Save changes
            </Button>
          </div>
        </form>
      </motion.section>

      {/* Change password */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="rounded-3xl border border-stone-200 bg-white p-6"
      >
        <div className="flex items-center gap-2.5">
          <KeyRound size={17} className="text-stone-400" />
          <h2 className="font-semibold tracking-tight">Change password</h2>
        </div>

        {!otpSent ? (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm text-stone-500">
              We&apos;ll email a 5-digit verification code to{" "}
              <span className="font-medium text-stone-700">{user.email}</span>.
            </p>
            <Button
              variant="secondary"
              loading={passwordBusy}
              onClick={handleSendOtp}
            >
              Email me a code
            </Button>
          </div>
        ) : (
          <form onSubmit={handlePasswordChange} className="mt-5 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                id="password-otp"
                label="Verification code"
                inputMode="numeric"
                maxLength={5}
                placeholder="12345"
                value={otp}
                onChange={(event) => setOtp(event.target.value)}
                required
              />
              <Input
                id="password-new"
                label="New password"
                type="password"
                autoComplete="new-password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                hint="8+ chars, uppercase, lowercase and a number"
                required
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setOtpSent(false)}
              >
                Cancel
              </Button>
              <Button type="submit" loading={passwordBusy}>
                Update password
              </Button>
            </div>
          </form>
        )}
      </motion.section>
    </div>
  );
}
