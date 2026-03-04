"use client";

import { useEffect, useState } from "react";
import { SentimentAnalysis, SentimentType } from "@/types/movie";
import styles from "./SentimentPanel.module.css";

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
      className={`glass-card ${styles.panel}`}
      style={{
        background: config.bg,
        borderColor: config.border,
      }}
    >
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.aiIcon}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9.663 17h4.673M12 3v1m6.364 1.636-.707.707M21 12h-1M4 12H3m3.343-5.657-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <h3 className={styles.title}>AI Sentiment Analysis</h3>
            <p className={styles.subtitle}>Powered by Google Gemini</p>
          </div>
        </div>
        <div className={styles.sentimentBadge} style={{ background: config.bg, borderColor: config.border }}>
          <span className={styles.sentimentIcon}>{config.icon}</span>
          <span className={styles.sentimentLabel} style={{ background: config.gradient, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            {config.label}
          </span>
        </div>
      </div>

      <div className="divider" />

      {/* Summary */}
      <div className={styles.summary}>
        <blockquote className={styles.summaryText}>
          &ldquo;{analysis.summary}&rdquo;
        </blockquote>
      </div>

      {/* Metrics Row */}
      <div className={styles.metricsRow}>
        {/* Audience Score */}
        <div className={styles.metric}>
          <div className={styles.metricTop}>
            <span className={styles.metricLabel}>Audience Score</span>
            <span className={styles.metricValue} style={{ background: config.gradient, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
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
        <div className={styles.metric}>
          <div className={styles.metricTop}>
            <span className={styles.metricLabel}>AI Confidence</span>
            <span className={styles.metricValue}>{animatedConfidence}%</span>
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
        <div className={styles.themes}>
          <span className={styles.themesLabel}>Key Themes</span>
          <div className={styles.themeChips}>
            {analysis.keyThemes.map((theme, i) => (
              <span key={i} className={styles.themeChip}>
                {theme}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
