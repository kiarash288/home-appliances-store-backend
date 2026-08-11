"use client";

import { cn } from "@/lib/utils";
import Skeleton from "@/components/ui/Skeleton";

export function Table({ columns = [], children, className }) {
  return (
    <div
      className={cn(
        "overflow-x-auto rounded-2xl border border-stone-200 bg-white",
        className
      )}
    >
      <table className="w-full min-w-max text-sm">
        <thead>
          <tr className="border-b border-stone-100 bg-stone-50/70">
            {columns.map((column) => (
              <th
                key={column}
                className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-stone-500"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100">{children}</tbody>
      </table>
    </div>
  );
}

export function TableSkeleton({ columns = 5, rows = 5 }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
      <div className="border-b border-stone-100 bg-stone-50/70 px-5 py-3.5">
        <Skeleton className="h-3.5 w-1/3" />
      </div>
      <div className="divide-y divide-stone-100">
        {Array.from({ length: rows }).map((_, index) => (
          <div key={index} className="flex items-center gap-6 px-5 py-4">
            {Array.from({ length: columns }).map((_, cell) => (
              <Skeleton
                key={cell}
                className="h-4"
                style={{ width: `${100 / columns}%` }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
