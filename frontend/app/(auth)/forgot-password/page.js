"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import api, { getErrorMessage } from "@/lib/api";
import { Input } from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState("request");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRequest = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/users/password-reset/request", {
        email,
      });
      toast.success(data.message || "Verification code sent to your email");
      setStep("verify");
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not send the reset code"));
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.put("/users/password-reset/verify", {
        email,
        otp,
        newPassword,
      });
      toast.success(data.message || "Password reset successfully");
      router.push("/login");
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not reset your password"));
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-md rounded-3xl border border-stone-200 bg-white p-8 shadow-sm sm:p-10"
    >
      <h1 className="text-2xl font-semibold tracking-tight">
        Reset your password
      </h1>
      <p className="mt-1.5 text-sm text-stone-500">
        {step === "request"
          ? "Enter your account email and we will send you a verification code."
          : `We sent a 5-digit code to ${email}.`}
      </p>

      {step === "request" ? (
        <form onSubmit={handleRequest} className="mt-8 space-y-5">
          <Input
            id="forgot-email"
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          <Button type="submit" size="lg" className="w-full" loading={loading}>
            Send reset code
          </Button>
        </form>
      ) : (
        <form onSubmit={handleVerify} className="mt-8 space-y-5">
          <Input
            id="forgot-otp"
            label="Verification code"
            inputMode="numeric"
            placeholder="12345"
            maxLength={5}
            value={otp}
            onChange={(event) => setOtp(event.target.value)}
            required
          />
          <Input
            id="forgot-new-password"
            label="New password"
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            hint="At least 8 characters with an uppercase letter, lowercase letter and a number"
            required
          />
          <Button type="submit" size="lg" className="w-full" loading={loading}>
            Reset password
          </Button>
          <button
            type="button"
            onClick={() => setStep("request")}
            className="w-full text-center text-xs font-medium text-stone-500 underline-offset-4 hover:text-stone-900 hover:underline"
          >
            Use a different email
          </button>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-stone-500">
        Remembered it?{" "}
        <Link
          href="/login"
          className="font-medium text-stone-900 underline underline-offset-4"
        >
          Back to sign in
        </Link>
      </p>
    </motion.div>
  );
}
