"use client";

import { useState } from "react";
import { MovieReview } from "@/types/movie";

interface ReviewsSectionProps {
  reviews: MovieReview[];
}

export default function ReviewsSection({ reviews }: ReviewsSectionProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="flex flex-col gap-4">
      {reviews.map((review, i) => (
        <ReviewItem
          key={review.id}
          review={review}
          index={i}
          isExpanded={expandedId === review.id}
          onToggle={() => toggleExpand(review.id)}
        />
      ))}
    </div>
  );
}

interface ReviewItemProps {
  review: MovieReview;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}

function ReviewItem({ review, index, isExpanded, onToggle }: ReviewItemProps) {
  const SHORT_LENGTH = 280;
  const isLong = review.content.length > SHORT_LENGTH;
  const displayContent = isExpanded || !isLong
    ? review.content
    : review.content.slice(0, SHORT_LENGTH) + "...";

  const formattedDate = new Date(review.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  // Generate initials for avatar
  const initials = review.author
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  // Color rotation for avatars
  const AVATAR_GRADIENTS = [
    "linear-gradient(135deg, #6366f1, #a855f7)",
    "linear-gradient(135deg, #10b981, #06b6d4)",
    "linear-gradient(135deg, #f59e0b, #ef4444)",
    "linear-gradient(135deg, #f43f5e, #ec4899)",
    "linear-gradient(135deg, #3b82f6, #6366f1)",
  ];
  const avatarGradient = AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length];

  return (
    <div className="p-5 bg-white/[0.02] border border-border-card rounded-2xl transition-colors duration-200 hover:bg-white/[0.04] hover:border-border-subtle animate-fade-in-up" style={{ animationDelay: `${index * 80}ms` }}>
      <div className="flex items-center gap-3 mb-3.5">
        <div className="w-10 h-10 rounded-full flex items-center justify-center text-[0.875rem] font-bold text-white font-heading shrink-0" style={{ background: avatarGradient }}>
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <span className="block text-[0.9rem] font-semibold text-text-primary overflow-hidden text-ellipsis whitespace-nowrap">{review.author}</span>
          <span className="block text-[0.75rem] text-text-muted mt-0.5">{formattedDate}</span>
        </div>
        {review.rating !== undefined && review.rating !== null && (
          <div className="flex items-center gap-1 shrink-0">
            <span className="star-filled">★</span>
            <span className="font-bold text-text-primary text-[0.9rem]">{review.rating}</span>
            <span className="text-text-muted text-[0.75rem]">/10</span>
          </div>
        )}
      </div>

      <p className="text-[0.875rem] leading-[1.75] text-text-secondary">{displayContent}</p>

      {isLong && (
        <button className="mt-2.5 bg-transparent border-none text-[#818cf8] text-[0.8rem] font-semibold cursor-pointer font-sans p-0 transition-colors duration-150 hover:text-accent-secondary" onClick={onToggle}>
          {isExpanded ? "Show less ↑" : "Read more ↓"}
        </button>
      )}
    </div>
  );
}
