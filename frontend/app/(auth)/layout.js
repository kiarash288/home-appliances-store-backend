import Link from "next/link";

export default function AuthLayout({ children }) {
  return (
    <div className="relative flex min-h-screen flex-col bg-stone-50">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-emerald-100/40 to-transparent" />
      <header className="relative mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="text-lg font-bold tracking-[0.25em] text-stone-950"
        >
          STORE<span className="text-emerald-600">.</span>
        </Link>
      </header>
      <main className="relative flex flex-1 items-start justify-center px-4 pb-20 pt-8 sm:items-center sm:pt-0">
        {children}
      </main>
    </div>
  );
}
