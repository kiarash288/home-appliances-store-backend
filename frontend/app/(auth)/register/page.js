"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/api";
import { useAuthStore } from "@/store/auth";
import { Input } from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";

export default function RegisterPage() {
  return (
    <Suspense fallback={<Skeleton className="h-96 w-full max-w-md rounded-3xl" />}>
      <RegisterForm />
    </Suspense>
  );
}

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next");
  const register = useAuthStore((state) => state.register);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const update = (key) => (event) =>
    setForm((prev) => ({ ...prev, [key]: event.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const data = await register(form);
      toast.success(
        data.message || "Account created! Check your inbox to verify your email."
      );
      router.push(next ? `/login?next=${encodeURIComponent(next)}` : "/login");
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not create your account"));
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full max-w-md rounded-3xl border border-stone-200 bg-white p-8 shadow-sm sm:p-10"
    >
      <h1 className="text-2xl font-semibold tracking-tight">
        Create your account
      </h1>
      <p className="mt-1.5 text-sm text-stone-500">
        Join to track orders, save favorites and check out faster.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <Input
            id="register-first"
            label="First name"
            placeholder="Ali"
            value={form.firstName}
            onChange={update("firstName")}
            required
          />
          <Input
            id="register-last"
            label="Last name"
            placeholder="Rezaei"
            value={form.lastName}
            onChange={update("lastName")}
            required
          />
        </div>
        <Input
          id="register-phone"
          label="Phone"
          type="tel"
          placeholder="09123456789"
          value={form.phone}
          onChange={update("phone")}
          hint="Iranian mobile number starting with 09"
          required
        />
        <Input
          id="register-email"
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={update("email")}
          required
        />
        <Input
          id="register-password"
          label="Password"
          type="password"
          autoComplete="new-password"
          placeholder="••••••••"
          value={form.password}
          onChange={update("password")}
          hint="At least 8 characters with an uppercase letter, lowercase letter and a number"
          required
        />

        <Button type="submit" size="lg" className="w-full" loading={loading}>
          Create account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-stone-500">
        Already have an account?{" "}
        <Link
          href={next ? `/login?next=${encodeURIComponent(next)}` : "/login"}
          className="font-medium text-stone-900 underline underline-offset-4"
        >
          Sign in
        </Link>
      </p>
    </motion.div>
  );
}
