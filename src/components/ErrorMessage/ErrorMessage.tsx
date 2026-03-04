"use client";

import styles from "./ErrorMessage.module.css";

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

const ERROR_HINTS: Record<string, string> = {
  "Movie not found": 'Double-check the IMDb ID format. It should look like "tt0133093".',
  "not found": 'This movie might not be in the OMDB database. Try a different IMDb ID.',
  "OMDB_API_KEY": "The OMDB API key is not configured. Please add it to your .env.local file.",
  "GEMINI_API_KEY": "The Gemini AI key is not configured. Sentiment analysis will use fallback mode.",
};

function getHint(message: string): string | null {
  for (const [key, hint] of Object.entries(ERROR_HINTS)) {
    if (message.toLowerCase().includes(key.toLowerCase())) {
      return hint;
    }
  }
  return null;
}

export default function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  const hint = getHint(message);

  return (
    <div className={`glass-card ${styles.container} animate-bounce-in`} role="alert">
      <div className={styles.iconWrapper}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>

      <div className={styles.content}>
        <h3 className={styles.title}>Something went wrong</h3>
        <p className={styles.message}>{message}</p>
        {hint && (
          <div className={styles.hint}>
            <span>💡</span>
            <span>{hint}</span>
          </div>
        )}
      </div>

      {onRetry && (
        <button
          id="retry-button"
          onClick={onRetry}
          className={`btn-primary ${styles.retryBtn}`}
        >
          Try Again
        </button>
      )}
    </div>
  );
}
