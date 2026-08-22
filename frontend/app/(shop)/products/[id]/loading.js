import Skeleton from "@/components/ui/Skeleton";

export default function ProductDetailLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Skeleton className="h-4 w-52" />
      <div className="mt-8 grid gap-12 lg:grid-cols-2">
        <Skeleton className="aspect-square w-full rounded-3xl" />
        <div className="space-y-4">
          <Skeleton className="h-3.5 w-24" />
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-12 w-64 rounded-full" />
        </div>
      </div>
    </div>
  );
}
