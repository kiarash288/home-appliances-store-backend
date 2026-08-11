"use client";

import { cn } from "@/lib/utils";

const FIELD_STYLES =
  "w-full rounded-xl border border-stone-200 bg-white px-3.5 text-sm text-stone-900 placeholder:text-stone-400 transition focus:border-stone-900 focus:outline-none focus:ring-4 focus:ring-stone-900/5 disabled:cursor-not-allowed disabled:bg-stone-50";

export function Field({ label, error, hint, htmlFor, children }) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={htmlFor}
          className="block text-xs font-medium uppercase tracking-wide text-stone-500"
        >
          {label}
        </label>
      )}
      {children}
      {hint && !error && <p className="text-xs text-stone-400">{hint}</p>}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

export function Input({ label, error, hint, className, id, ...props }) {
  return (
    <Field label={label} error={error} hint={hint} htmlFor={id}>
      <input
        id={id}
        className={cn(
          FIELD_STYLES,
          "h-11",
          error && "border-red-400 focus:border-red-500 focus:ring-red-500/10",
          className
        )}
        {...props}
      />
    </Field>
  );
}

export function Textarea({ label, error, hint, className, id, rows = 4, ...props }) {
  return (
    <Field label={label} error={error} hint={hint} htmlFor={id}>
      <textarea
        id={id}
        rows={rows}
        className={cn(
          FIELD_STYLES,
          "resize-none py-3",
          error && "border-red-400 focus:border-red-500 focus:ring-red-500/10",
          className
        )}
        {...props}
      />
    </Field>
  );
}

export function Select({ label, error, hint, className, id, children, ...props }) {
  return (
    <Field label={label} error={error} hint={hint} htmlFor={id}>
      <select
        id={id}
        className={cn(FIELD_STYLES, "h-11 appearance-none pr-8", className)}
        {...props}
      >
        {children}
      </select>
    </Field>
  );
}
