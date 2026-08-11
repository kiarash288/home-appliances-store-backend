import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <p className="text-8xl font-bold tracking-tight text-stone-200">404</p>
      <h1 className="mt-4 text-2xl font-semibold tracking-tight">
        This page walked off the shelf
      </h1>
      <p className="mt-2 max-w-sm text-sm text-stone-500">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex h-11 items-center rounded-full bg-stone-900 px-6 text-sm font-medium text-white transition hover:bg-stone-700"
      >
        Back to the store
      </Link>
    </div>
  );
}
