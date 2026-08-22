import { Suspense } from "react";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import Skeleton from "@/components/ui/Skeleton";

export const metadata = {
  title: "Reset Password",
  description: "Reset your STORE. account password with a verification code.",
};

/**
 * Server Component wrapper: fast static shell + metadata. The interactive
 * two-step form is the ForgotPasswordForm client island.
 */
export default function ForgotPasswordPage() {
  return (
    <Suspense
      fallback={<Skeleton className="h-96 w-full max-w-md rounded-3xl" />}
    >
      <ForgotPasswordForm />
    </Suspense>
  );
}
