"use client";

import Image from "next/image";
import { useState } from "react";
import { MovieAnalysisResult, SentimentType } from "@/types/movie";
import SentimentPanel from "@/components/SentimentPanel/SentimentPanel";
import CastGrid from "@/components/CastGrid/CastGrid";
import ReviewsSection from "@/components/ReviewsSection/ReviewsSection";

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
    <div className="flex flex-col gap-5 pb-16 animate-fade-in-up">
      {/* ── Top Section: Poster + Info ─────────────────────────────────────── */}
      <div className="glass-card grid grid-cols-1 md:grid-cols-[220px_1fr] gap-8 p-6 md:p-8 overflow-hidden">
        <div className="relative shrink-0 max-w-[200px] md:max-w-none mx-auto w-full group">
          {hasPoster ? (
            <div className="relative w-full aspect-[2/3] rounded-2xl overflow-hidden">
              <Image
                src={movie.Poster}
                alt={`${movie.Title} poster`}
                fill
                sizes="(max-width: 768px) 200px, 280px"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                onError={() => setPosterError(true)}
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bg-primary/80 to-transparent rounded-2xl pointer-events-none" />
            </div>
          ) : (
            <div className="w-full aspect-[2/3] bg-white/5 border border-border-card rounded-2xl flex flex-col items-center justify-center gap-2 text-text-muted text-[0.85rem]">
              <span className="text-[2.5rem]">🎬</span>
              <span>No Poster</span>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          {/* Title + Year */}
          <div className="flex items-start gap-3 flex-wrap">
            <h2 className="text-[clamp(1.5rem,3vw,2.25rem)] font-extrabold text-text-primary tracking-[-0.02em] leading-[1.2] flex-1">
              {movie.Title}
            </h2>
            <span className="badge badge-primary shrink-0 mt-1">
              {movie.Year}
            </span>
          </div>

          {/* Genres */}
          <div className="flex flex-wrap gap-1.5">
            {genres.map((g) => (
              <span key={g} className="badge badge-primary">
                {g}
              </span>
            ))}
          </div>

          {/* Ratings Row */}
          <div className="flex flex-wrap gap-4 md:gap-6 mt-2">
            {/* IMDb Rating */}
            <div className="flex flex-col gap-1">
              <div className="text-[0.7rem] font-semibold uppercase tracking-[0.08em] text-text-muted">
                IMDb
              </div>
              <div className="font-heading text-[1.6rem] font-extrabold flex items-baseline gap-0.5">
                <span className="gradient-text-gold">{movie.imdbRating}</span>
                <span className="text-[0.9rem] text-text-muted font-normal">/10</span>
              </div>
              <div className="flex gap-[1px] text-[0.85rem]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className={i < stars ? "star-filled" : "star-empty"}>
                    ★
                  </span>
                ))}
              </div>
            </div>

            {/* Metascore */}
            {movie.Metascore !== "N/A" && (
              <div className="flex flex-col gap-1">
                <div className="text-[0.7rem] font-semibold uppercase tracking-[0.08em] text-text-muted">
                  Metascore
                </div>
                <div className="font-heading text-[1.6rem] font-extrabold flex items-baseline gap-0.5">
                  <span className="gradient-text">{movie.Metascore}</span>
                  <span className="text-[0.9rem] text-text-muted font-normal">/100</span>
                </div>
              </div>
            )}

            {/* Sentiment Badge */}
            <div className="flex flex-col gap-1">
              <div className="text-[0.7rem] font-semibold uppercase tracking-[0.08em] text-text-muted">
                AI Sentiment
              </div>
              <div className={`badge ${sentimentConfig.badgeClass} !text-[0.85rem] !px-3.5 !py-1.5 mt-1`}>
                {sentimentConfig.icon} {sentimentConfig.label}
              </div>
            </div>
          </div>

          {/* Meta Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-3 mt-4">
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
            <div className="flex items-center gap-2 px-4 py-3 bg-accent-gold/10 border border-accent-gold/20 rounded-xl text-[0.85rem] text-[#fbbf24] font-medium mt-2">
              <span>🏆</span>
              <span>{movie.Awards}</span>
            </div>
          )}
        </div>
      </div>

      {/* ── Plot Summary ────────────────────────────────────────────────────── */}
      <div className="glass-card p-6 md:p-7">
        <h3 className="flex items-center gap-2 text-[1.125rem] font-bold text-text-primary mb-4">
          <span>📖</span> Plot Summary
        </h3>
        <p className="text-text-secondary leading-[1.8] text-[0.95rem]">
          {movie.Plot}
        </p>
        {movie.Actors !== "N/A" && (
          <div className="mt-4 pt-4 border-t border-border-card flex gap-2 text-[0.875rem] flex-wrap">
            <span className="text-text-muted font-medium shrink-0">Starring:</span>
            <span className="text-text-secondary">{movie.Actors}</span>
          </div>
        )}
      </div>

      {/* ── Sentiment Analysis Panel ─────────────────────────────────────────── */}
      <SentimentPanel analysis={sentimentAnalysis} />

      {/* ── Tabs: Cast, Reviews ──────────────────────────────────────────────── */}
      {(cast.length > 0 || reviews.length > 0) && (
        <div className="glass-card p-0 overflow-hidden">
          <div className="flex border-b border-border-card px-4 md:px-6 gap-1" role="tablist">
            {cast.length > 0 && (
              <button
                id="tab-cast"
                role="tab"
                aria-selected={activeTab === "cast"}
                className={`px-5 py-4 bg-transparent border-none text-[0.875rem] font-semibold cursor-pointer transition-all duration-200 font-sans border-b-2 -mb-[1px] hover:text-text-secondary ${
                  activeTab === "cast" ? "text-text-primary border-accent-primary" : "text-text-muted border-transparent"
                }`}
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
                className={`px-5 py-4 bg-transparent border-none text-[0.875rem] font-semibold cursor-pointer transition-all duration-200 font-sans border-b-2 -mb-[1px] hover:text-text-secondary ${
                  activeTab === "reviews" ? "text-text-primary border-accent-primary" : "text-text-muted border-transparent"
                }`}
                onClick={() => setActiveTab("reviews")}
              >
                💬 Reviews ({reviews.length})
              </button>
            )}
          </div>

          <div className="p-4 md:p-6">
            {activeTab === "cast" && cast.length > 0 && <CastGrid cast={cast} />}
            {activeTab === "reviews" && reviews.length > 0 && (
              <ReviewsSection reviews={reviews} />
            )}
          </div>
        </div>
      )}

      {/* ── Ratings Breakdown ────────────────────────────────────────────────── */}
      {movie.Ratings?.length > 0 && (
        <div className="glass-card p-6 md:p-7">
          <h3 className="flex items-center gap-2 text-[1.125rem] font-bold text-text-primary mb-4">
            <span>⭐</span> Ratings Breakdown
          </h3>
          <div className="flex flex-col gap-5">
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
    <div className="flex items-start gap-2">
      <span className="text-base shrink-0 mt-[2px]">{icon}</span>
      <div>
        <div className="text-[0.7rem] font-semibold uppercase tracking-[0.08em] text-text-muted">
          {label}
        </div>
        <div className="text-[0.875rem] font-medium text-text-primary leading-[1.3]">
          {value}
        </div>
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
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <span className="text-[0.875rem] font-medium text-text-secondary">{source}</span>
        <span className="text-[0.875rem] font-bold text-text-primary">{value}</span>
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
