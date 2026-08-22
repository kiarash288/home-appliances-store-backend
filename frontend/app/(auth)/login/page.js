import { Suspense } from "react";
import LoginForm from "@/components/auth/LoginForm";
import Skeleton from "@/components/ui/Skeleton";

export const metadata = {
  title: "Sign in",
  description: "Sign in to your STORE. account.",
};

/**
 * Server Component wrapper: fast static shell + metadata. The interactive
 * form (state, Zustand, submit) is the LoginForm client island.
 */
export default function LoginPage() {
  return (
    <Suspense
      fallback={<Skeleton className="h-96 w-full max-w-md rounded-3xl" />}
    >
      <LoginForm />
    </Suspense>
  );
}
