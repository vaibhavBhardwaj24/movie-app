"use client";

import { useEffect, useState } from "react";
import { SentimentAnalysis, SentimentType } from "@/types/movie";

interface SentimentPanelProps {
  analysis: SentimentAnalysis;
}

const SENTIMENT_CONFIG: Record<
  SentimentType,
  { gradient: string; bg: string; border: string; icon: string; label: string }
> = {
  positive: {
    gradient: "var(--gradient-emerald)",
    bg: "rgba(16, 185, 129, 0.06)",
    border: "rgba(16, 185, 129, 0.2)",
    icon: "😍",
    label: "Positive Reception",
  },
  mixed: {
    gradient: "var(--gradient-gold)",
    bg: "rgba(245, 158, 11, 0.06)",
    border: "rgba(245, 158, 11, 0.2)",
    icon: "😐",
    label: "Mixed Reception",
  },
  negative: {
    gradient: "var(--gradient-rose)",
    bg: "rgba(244, 63, 94, 0.06)",
    border: "rgba(244, 63, 94, 0.2)",
    icon: "😞",
    label: "Negative Reception",
  },
  unknown: {
    gradient: "var(--gradient-primary)",
    bg: "rgba(99, 102, 241, 0.06)",
    border: "rgba(99, 102, 241, 0.2)",
    icon: "🤔",
    label: "Analyzing...",
  },
};

export default function SentimentPanel({ analysis }: SentimentPanelProps) {
  const config = SENTIMENT_CONFIG[analysis.sentiment] ?? SENTIMENT_CONFIG.unknown;
  const [animatedScore, setAnimatedScore] = useState(0);
  const [animatedConfidence, setAnimatedConfidence] = useState(0);

  // Animate the score counters on mount
  useEffect(() => {
    const duration = 1200;
    const steps = 60;
    const stepMs = duration / steps;

    let step = 0;
    const interval = setInterval(() => {
      step++;
      const progress = step / steps;
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setAnimatedScore(Math.round(eased * analysis.audienceScore));
      setAnimatedConfidence(Math.round(eased * analysis.confidence));
      if (step >= steps) clearInterval(interval);
    }, stepMs);

    return () => clearInterval(interval);
  }, [analysis.audienceScore, analysis.confidence]);

  return (
    <div
      className="glass-card p-6 md:p-7 transition-colors duration-300"
      style={{
        background: config.bg,
        borderColor: config.border,
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shrink-0 shadow-[0_4px_16px_rgba(99,102,241,0.3)]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9.663 17h4.673M12 3v1m6.364 1.636-.707.707M21 12h-1M4 12H3m3.343-5.657-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <h3 className="text-[1.1rem] font-bold text-text-primary mb-[0.15rem]">AI Sentiment Analysis</h3>
            <p className="text-[0.75rem] text-text-muted font-medium">Powered by Google Gemini</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-4 py-2 border rounded-full shrink-0" style={{ background: config.bg, borderColor: config.border }}>
          <span className="text-[1.2rem]">{config.icon}</span>
          <span className="text-[0.875rem] font-bold" style={{ background: config.gradient, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            {config.label}
          </span>
        </div>
      </div>

      <div className="divider" />

      {/* Summary */}
      <div className="mb-6">
        <blockquote className="text-[0.975rem] leading-[1.8] text-text-secondary italic pl-4 border-l-[3px] border-accent-primary m-0">
          &ldquo;{analysis.summary}&rdquo;
        </blockquote>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
        {/* Audience Score */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <span className="text-[0.8rem] font-semibold uppercase tracking-[0.08em] text-text-muted">Audience Score</span>
            <span className="text-xl font-extrabold font-heading text-text-primary" style={{ background: config.gradient, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              {animatedScore}%
            </span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${animatedScore}%`,
                background: config.gradient,
              }}
            />
          </div>
        </div>

        {/* AI Confidence */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <span className="text-[0.8rem] font-semibold uppercase tracking-[0.08em] text-text-muted">AI Confidence</span>
            <span className="text-xl font-extrabold font-heading text-text-primary">{animatedConfidence}%</span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${animatedConfidence}%`,
                background: "var(--gradient-primary)",
              }}
            />
          </div>
        </div>
      </div>

      {/* Key Themes */}
      {analysis.keyThemes.length > 0 && (
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-text-muted shrink-0">Key Themes</span>
          <div className="flex flex-wrap gap-2">
            {analysis.keyThemes.map((theme, i) => (
              <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[0.8rem] text-text-secondary font-medium transition-colors duration-200 hover:bg-accent-primary/10 hover:border-accent-primary/30 hover:text-[#818cf8]">
                {theme}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
