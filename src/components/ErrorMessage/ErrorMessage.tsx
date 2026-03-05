"use client";

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

const ERROR_HINTS: Record<string, string> = {
  "Movie not found": 'Double-check the IMDb ID format. It should look like "tt0133093".',
  "not found": 'This movie might not be in the OMDB database. Try a different IMDb ID.',
  "OMDB_API_KEY": "The OMDB API key is not configured. Please add it to your .env.local file.",
  "GEMINI_API_KEY": "The Gemini AI key is not configured. Sentiment analysis will use fallback mode.",
  "fetch failed": "Network error. Please check your internet connection.",
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
    <div className="glass-card flex flex-col items-center text-center p-10 gap-4 border-rose-500/20 bg-rose-500/5 animate-bounce-in" role="alert">
      <div className="w-[60px] h-[60px] bg-rose-500/10 border border-rose-500/25 rounded-full flex items-center justify-center text-[#fb7185] shrink-0">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>

      <div className="flex flex-col gap-2 max-w-[480px]">
        <h3 className="text-xl font-bold text-text-primary">Something went wrong</h3>
        <p className="text-[0.9rem] text-text-secondary leading-[1.6]">{message}</p>
        {hint && (
          <div className="flex items-start gap-1.5 mt-2 px-3.5 py-2.5 bg-accent-gold/10 border border-accent-gold/20 rounded-xl text-[0.825rem] text-[#fbbf24] text-left">
            <span>💡</span>
            <span>{hint}</span>
          </div>
        )}
      </div>

      {onRetry && (
        <button
          id="retry-button"
          onClick={onRetry}
          className="btn-primary mt-2"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
