import { Suspense } from "react";
import RegisterForm from "@/components/auth/RegisterForm";
import Skeleton from "@/components/ui/Skeleton";

export const metadata = {
  title: "Create an Account",
  description: "Create your STORE. account to shop faster.",
};

/**
 * Server Component wrapper: fast static shell + metadata. The interactive
 * form (state, Zustand, submit) is the RegisterForm client island.
 */
export default function RegisterPage() {
  return (
    <Suspense
      fallback={<Skeleton className="h-96 w-full max-w-md rounded-3xl" />}
    >
      <RegisterForm />
    </Suspense>
  );
}
