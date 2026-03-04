"use client";

import { useState } from "react";
import { MovieReview } from "@/types/movie";
import styles from "./ReviewsSection.module.css";

interface ReviewsSectionProps {
  reviews: MovieReview[];
}

export default function ReviewsSection({ reviews }: ReviewsSectionProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className={styles.list}>
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
    <div className={`${styles.review} animate-fade-in-up`} style={{ animationDelay: `${index * 80}ms` }}>
      <div className={styles.reviewHeader}>
        <div className={styles.avatar} style={{ background: avatarGradient }}>
          {initials}
        </div>
        <div className={styles.authorInfo}>
          <span className={styles.authorName}>{review.author}</span>
          <span className={styles.reviewDate}>{formattedDate}</span>
        </div>
        {review.rating !== undefined && review.rating !== null && (
          <div className={styles.rating}>
            <span className="star-filled">★</span>
            <span className={styles.ratingNum}>{review.rating}</span>
            <span className={styles.ratingMax}>/10</span>
          </div>
        )}
      </div>

      <p className={styles.content}>{displayContent}</p>

      {isLong && (
        <button className={styles.toggleBtn} onClick={onToggle}>
          {isExpanded ? "Show less ↑" : "Read more ↓"}
        </button>
      )}
    </div>
  );
}
