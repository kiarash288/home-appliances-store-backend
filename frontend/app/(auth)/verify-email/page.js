"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import api, { getErrorMessage } from "@/lib/api";
import { useAuthStore } from "@/store/auth";
import Button from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<Skeleton className="h-72 w-full max-w-md rounded-3xl" />}>
      <VerifyEmail />
    </Suspense>
  );
}

function VerifyEmail() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState(token ? "verifying" : "error");
  const [message, setMessage] = useState(
    token ? "" : "The verification link is missing its token."
  );
  const startedRef = useRef(false);

  useEffect(() => {
    if (!token || startedRef.current) return;
    startedRef.current = true;

    (async () => {
      try {
        await api.post("/auth/verify-email", { token });

        // If a session exists, refresh the token + profile so the
        // is_verified claim is updated for checkout.
        const { accessToken, refreshToken, refreshProfile } =
          useAuthStore.getState();
        if (accessToken) {
          try {
            await refreshToken();
            await refreshProfile();
          } catch (_) {
            // Session refresh is best-effort here
          }
        }
        setStatus("success");
      } catch (error) {
        setStatus("error");
        setMessage(getErrorMessage(error, "This link is invalid or expired."));
      }
    })();
  }, [token]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-md rounded-3xl border border-stone-200 bg-white p-10 text-center shadow-sm"
    >
      {status === "verifying" && (
        <>
          <Loader2 size={40} className="mx-auto animate-spin text-stone-400" />
          <h1 className="mt-6 text-xl font-semibold tracking-tight">
            Verifying your email…
          </h1>
          <p className="mt-2 text-sm text-stone-500">
            Hold on a moment while we confirm your address.
          </p>
        </>
      )}

      {status === "success" && (
        <>
          <motion.div
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
          >
            <CheckCircle2 size={52} className="mx-auto text-emerald-600" />
          </motion.div>
          <h1 className="mt-6 text-xl font-semibold tracking-tight">
            Email verified!
          </h1>
          <p className="mt-2 text-sm text-stone-500">
            Your account is fully activated — you can now place orders.
          </p>
          <div className="mt-8 flex flex-col gap-3">
            <Link href="/products">
              <Button size="lg" className="w-full">
                Start shopping
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="secondary" size="lg" className="w-full">
                Sign in
              </Button>
            </Link>
          </div>
        </>
      )}

      {status === "error" && (
        <>
          <XCircle size={52} className="mx-auto text-red-500" />
          <h1 className="mt-6 text-xl font-semibold tracking-tight">
            Verification failed
          </h1>
          <p className="mt-2 text-sm text-stone-500">{message}</p>
          <p className="mt-3 text-xs text-stone-400">
            You can request a new link from your account page after signing in.
          </p>
          <div className="mt-8">
            <Link href="/login">
              <Button size="lg" className="w-full">
                Go to sign in
              </Button>
            </Link>
          </div>
        </>
      )}
    </motion.div>
  );
}
