"use client";

import Image from "next/image";
import { useState } from "react";
import { MovieAnalysisResult, SentimentType } from "@/types/movie";
import SentimentPanel from "@/components/SentimentPanel/SentimentPanel";
import CastGrid from "@/components/CastGrid/CastGrid";
import ReviewsSection from "@/components/ReviewsSection/ReviewsSection";
import styles from "./MovieCard.module.css";

interface MovieCardProps {
  data: MovieAnalysisResult;
}

// Map sentiment to UI config
const SENTIMENT_CONFIG: Record<
  SentimentType,
  { color: string; icon: string; label: string; badgeClass: string }
> = {
  positive: {
    color: "#10b981",
    icon: "😍",
    label: "Positive",
    badgeClass: "badge-positive",
  },
  mixed: {
    color: "#f59e0b",
    icon: "😐",
    label: "Mixed",
    badgeClass: "badge-mixed",
  },
  negative: {
    color: "#f43f5e",
    icon: "😞",
    label: "Negative",
    badgeClass: "badge-negative",
  },
  unknown: {
    color: "#6366f1",
    icon: "🤔",
    label: "Analyzing...",
    badgeClass: "badge-primary",
  },
};

export default function MovieCard({ data }: MovieCardProps) {
  const { movie, cast, reviews, sentimentAnalysis } = data;
  const [posterError, setPosterError] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "cast" | "reviews">("overview");

  const sentimentConfig = SENTIMENT_CONFIG[sentimentAnalysis.sentiment] ?? SENTIMENT_CONFIG.unknown;

  // Parse IMDb rating into stars (out of 5)
  const imdbRating = parseFloat(movie.imdbRating) || 0;
  const stars = Math.round((imdbRating / 10) * 5);

  // Genre tags
  const genres = movie.Genre?.split(", ") || [];

  const hasPoster =
    !posterError &&
    movie.Poster &&
    movie.Poster !== "N/A" &&
    movie.Poster.startsWith("http");

  return (
    <div className={`${styles.container} animate-fade-in-up`}>
      {/* ── Top Section: Poster + Info ─────────────────────────────────────── */}
      <div className={`glass-card ${styles.topCard}`}>
        <div className={styles.posterSection}>
          {hasPoster ? (
            <div className={styles.posterWrapper}>
              <Image
                src={movie.Poster}
                alt={`${movie.Title} poster`}
                fill
                sizes="(max-width: 768px) 200px, 280px"
                className={styles.posterImg}
                onError={() => setPosterError(true)}
                priority
              />
              <div className={styles.posterGlow} />
            </div>
          ) : (
            <div className={styles.posterFallback}>
              <span>🎬</span>
              <span>No Poster</span>
            </div>
          )}
        </div>

        <div className={styles.infoSection}>
          {/* Title + Year */}
          <div className={styles.titleRow}>
            <h2 className={styles.title}>{movie.Title}</h2>
            <span className={`badge badge-primary ${styles.yearBadge}`}>
              {movie.Year}
            </span>
          </div>

          {/* Genres */}
          <div className={styles.genres}>
            {genres.map((g) => (
              <span key={g} className={`badge badge-primary`}>
                {g}
              </span>
            ))}
          </div>

          {/* Ratings Row */}
          <div className={styles.ratingsRow}>
            {/* IMDb Rating */}
            <div className={styles.ratingBox}>
              <div className={styles.ratingLabel}>IMDb</div>
              <div className={styles.ratingValue}>
                <span className="gradient-text-gold">{movie.imdbRating}</span>
                <span className={styles.ratingMax}>/10</span>
              </div>
              <div className={styles.stars}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className={i < stars ? "star-filled" : "star-empty"}>
                    ★
                  </span>
                ))}
              </div>
            </div>

            {/* Metascore */}
            {movie.Metascore !== "N/A" && (
              <div className={styles.ratingBox}>
                <div className={styles.ratingLabel}>Metascore</div>
                <div className={styles.ratingValue}>
                  <span className="gradient-text">{movie.Metascore}</span>
                  <span className={styles.ratingMax}>/100</span>
                </div>
              </div>
            )}

            {/* Sentiment Badge */}
            <div className={styles.ratingBox}>
              <div className={styles.ratingLabel}>AI Sentiment</div>
              <div className={`badge ${sentimentConfig.badgeClass} ${styles.sentimentBadge}`}>
                {sentimentConfig.icon} {sentimentConfig.label}
              </div>
            </div>
          </div>

          {/* Meta Info Grid */}
          <div className={styles.metaGrid}>
            {movie.Director !== "N/A" && (
              <MetaItem icon="🎬" label="Director" value={movie.Director} />
            )}
            {movie.Runtime !== "N/A" && (
              <MetaItem icon="⏱️" label="Runtime" value={movie.Runtime} />
            )}
            {movie.Rated !== "N/A" && (
              <MetaItem icon="🔞" label="Rated" value={movie.Rated} />
            )}
            {movie.BoxOffice !== "N/A" && movie.BoxOffice && (
              <MetaItem icon="💰" label="Box Office" value={movie.BoxOffice} />
            )}
            {movie.Language !== "N/A" && (
              <MetaItem icon="🌍" label="Language" value={movie.Language} />
            )}
            {movie.Released !== "N/A" && (
              <MetaItem icon="📅" label="Released" value={movie.Released} />
            )}
          </div>

          {/* Awards */}
          {movie.Awards && movie.Awards !== "N/A" && (
            <div className={styles.awards}>
              <span>🏆</span>
              <span>{movie.Awards}</span>
            </div>
          )}
        </div>
      </div>

      {/* ── Plot Summary ────────────────────────────────────────────────────── */}
      <div className={`glass-card ${styles.plotCard}`}>
        <h3 className={styles.sectionTitle}>
          <span>📖</span> Plot Summary
        </h3>
        <p className={styles.plot}>{movie.Plot}</p>
        {movie.Actors !== "N/A" && (
          <div className={styles.actors}>
            <span className={styles.actorsLabel}>Starring:</span>
            <span className={styles.actorsValue}>{movie.Actors}</span>
          </div>
        )}
      </div>

      {/* ── Sentiment Analysis Panel ─────────────────────────────────────────── */}
      <SentimentPanel analysis={sentimentAnalysis} />

      {/* ── Tabs: Cast, Reviews ──────────────────────────────────────────────── */}
      {(cast.length > 0 || reviews.length > 0) && (
        <div className={`glass-card ${styles.tabsCard}`}>
          <div className={styles.tabBar} role="tablist">
            {cast.length > 0 && (
              <button
                id="tab-cast"
                role="tab"
                aria-selected={activeTab === "cast"}
                className={`${styles.tab} ${activeTab === "cast" ? styles.tabActive : ""}`}
                onClick={() => setActiveTab("cast")}
              >
                🎭 Cast ({cast.length})
              </button>
            )}
            {reviews.length > 0 && (
              <button
                id="tab-reviews"
                role="tab"
                aria-selected={activeTab === "reviews"}
                className={`${styles.tab} ${activeTab === "reviews" ? styles.tabActive : ""}`}
                onClick={() => setActiveTab("reviews")}
              >
                💬 Reviews ({reviews.length})
              </button>
            )}
          </div>

          <div className={styles.tabContent}>
            {activeTab === "cast" && cast.length > 0 && <CastGrid cast={cast} />}
            {activeTab === "reviews" && reviews.length > 0 && (
              <ReviewsSection reviews={reviews} />
            )}
          </div>
        </div>
      )}

      {/* ── Ratings Breakdown ────────────────────────────────────────────────── */}
      {movie.Ratings?.length > 0 && (
        <div className={`glass-card ${styles.ratingsCard}`}>
          <h3 className={styles.sectionTitle}>
            <span>⭐</span> Ratings Breakdown
          </h3>
          <div className={styles.ratingsBreakdown}>
            {movie.Ratings.map((r) => (
              <RatingBar key={r.Source} source={r.Source} value={r.Value} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function MetaItem({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className={styles.metaItem}>
      <span className={styles.metaIcon}>{icon}</span>
      <div>
        <div className={styles.metaLabel}>{label}</div>
        <div className={styles.metaValue}>{value}</div>
      </div>
    </div>
  );
}

function RatingBar({ source, value }: { source: string; value: string }) {
  // Parse percentage from various formats (e.g., "8.5/10", "94%", "72/100")
  let percent = 0;
  if (value.includes("%")) {
    percent = parseFloat(value);
  } else if (value.includes("/10")) {
    percent = (parseFloat(value) / 10) * 100;
  } else if (value.includes("/100")) {
    percent = parseFloat(value);
  }

  const getColor = (p: number) => {
    if (p >= 70) return "var(--gradient-emerald)";
    if (p >= 50) return "var(--gradient-gold)";
    return "var(--gradient-rose)";
  };

  return (
    <div className={styles.ratingBarItem}>
      <div className={styles.ratingBarHeader}>
        <span className={styles.ratingSource}>{source}</span>
        <span className={styles.ratingBarValue}>{value}</span>
      </div>
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{
            width: `${Math.min(percent, 100)}%`,
            background: getColor(percent),
          }}
        />
      </div>
    </div>
  );
}
