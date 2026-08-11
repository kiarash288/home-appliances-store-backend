"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { toast } from "sonner";
import api, { getErrorMessage } from "@/lib/api";
import { useAuthStore } from "@/store/auth";
import { useMounted } from "@/lib/hooks";
import { Textarea } from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";
import { cn, formatDate, getUserDisplayName, getInitials } from "@/lib/utils";

export function Stars({ value, size = 14 }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={cn(
            star <= Math.round(value)
              ? "fill-amber-400 text-amber-400"
              : "text-stone-300"
          )}
        />
      ))}
    </div>
  );
}

export default function ReviewsSection({ itemId }) {
  const mounted = useMounted();
  const user = useAuthStore((state) => state.user);

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    api
      .get(`/reviews/item/${itemId}`)
      .then(({ data }) => {
        if (active) setReviews(Array.isArray(data) ? data : []);
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [itemId]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      const payload = { rating };
      if (comment.trim()) payload.comment = comment.trim();
      await api.post(`/reviews/item/${itemId}`, payload);
      toast.success("Thanks! Your review is pending approval.");
      setComment("");
      setRating(5);
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not submit your review"));
    } finally {
      setSubmitting(false);
    }
  };

  const average =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + Number(review.rating), 0) /
        reviews.length
      : null;

  return (
    <section className="mx-auto mt-20 max-w-3xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold tracking-tight">
          Reviews{" "}
          <span className="text-base font-normal text-stone-400">
            ({reviews.length})
          </span>
        </h2>
        {average != null && (
          <div className="flex items-center gap-2">
            <Stars value={average} size={16} />
            <span className="text-sm font-medium">{average.toFixed(1)}</span>
          </div>
        )}
      </div>

      <div className="mt-6 rounded-3xl border border-stone-200 bg-white p-6">
        {mounted && user ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
                Your rating
              </p>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHovered(star)}
                    onMouseLeave={() => setHovered(0)}
                    onClick={() => setRating(star)}
                    aria-label={`Rate ${star} stars`}
                    className="p-0.5 transition-transform hover:scale-110"
                  >
                    <Star
                      size={22}
                      className={cn(
                        "transition-colors",
                        star <= (hovered || rating)
                          ? "fill-amber-400 text-amber-400"
                          : "text-stone-300"
                      )}
                    />
                  </button>
                ))}
              </div>
            </div>
            <Textarea
              label="Your review"
              placeholder="What did you think of this product? (optional)"
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              rows={3}
            />
            <div className="flex justify-end">
              <Button type="submit" loading={submitting}>
                Submit review
              </Button>
            </div>
          </form>
        ) : (
          <p className="text-sm text-stone-500">
            <Link
              href="/login"
              className="font-medium text-stone-900 underline underline-offset-4"
            >
              Sign in
            </Link>{" "}
            to share your experience with this product.
          </p>
        )}
      </div>

      <div className="mt-8 space-y-6">
        {loading ? (
          <>
            <Skeleton className="h-24 w-full rounded-2xl" />
            <Skeleton className="h-24 w-full rounded-2xl" />
          </>
        ) : reviews.length === 0 ? (
          <p className="py-6 text-center text-sm text-stone-400">
            No reviews yet — be the first to share your thoughts.
          </p>
        ) : (
          reviews.map((review, index) => (
            <motion.article
              key={review.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              className="flex gap-4"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-stone-900 text-xs font-semibold text-white">
                {getInitials(review.user)}
              </div>
              <div className="min-w-0 flex-1 rounded-2xl bg-white p-4 ring-1 ring-stone-100">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-medium">
                    {getUserDisplayName(review.user)}
                  </p>
                  <span className="text-xs text-stone-400">
                    {formatDate(review.createdAt)}
                  </span>
                </div>
                <div className="mt-1">
                  <Stars value={review.rating} />
                </div>
                {review.comment && (
                  <p className="mt-2 text-sm leading-relaxed text-stone-600">
                    {review.comment}
                  </p>
                )}
              </div>
            </motion.article>
          ))
        )}
      </div>
    </section>
  );
}
