"use client";

import { useState, FormEvent } from "react";

interface SearchFormProps {
  onSearch: (imdbId: string) => void;
  isLoading: boolean;
}

// Example movies to show users
const EXAMPLE_IDS = [
  { id: "tt0133093", title: "The Matrix" },
  { id: "tt0111161", title: "Shawshank Redemption" },
  { id: "tt0468569", title: "The Dark Knight" },
  { id: "tt1375666", title: "Inception" },
  { id: "tt0816692", title: "Interstellar" },
];

export default function SearchForm({ onSearch, isLoading }: SearchFormProps) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  const validate = (id: string): string => {
    if (!id.trim()) return "Please enter an IMDb ID";
    if (!/^tt\d{7,8}$/.test(id.trim()))
      return 'Invalid format. IMDb IDs look like "tt0133093"';
    return "";
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    const validationError = validate(trimmed);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError("");
    onSearch(trimmed);
  };

  const handleExampleClick = (id: string) => {
    setValue(id);
    setError("");
    onSearch(id);
  };

  return (
    <div className="text-center pt-20 pb-12 px-0 sm:pt-20 sm:pb-12 px-4">
      {/* Hero Text */}
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-accent-primary/10 border border-accent-primary/25 rounded-full text-[0.8rem] font-medium text-[#818cf8] mb-6 animate-fade-in-up">
          <span>🎬</span>
          <span>AI-Powered Movie Intelligence</span>
        </div>
        <h1 className="text-[clamp(2.5rem,6vw,4rem)] font-extrabold text-text-primary tracking-[-0.03em] mb-4 animate-fade-in-up [animation-delay:100ms] [animation-fill-mode:both]">
          Discover the{" "}
          <span className="gradient-text">Pulse</span> of Any Film
        </h1>
        <p className="text-[1.1rem] text-text-secondary max-w-[560px] mx-auto leading-[1.7] animate-fade-in-up [animation-delay:200ms] [animation-fill-mode:both]">
          Enter an IMDb movie ID to unlock cast details, AI-generated sentiment
          analysis, and deep audience insights — all in seconds.
        </p>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSubmit} className="max-w-[640px] mx-auto mb-6 animate-fade-in-up [animation-delay:300ms] [animation-fill-mode:both]" noValidate>
        <div className="flex flex-col sm:flex-row items-center gap-3 relative w-full font-sans">
          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none z-10 flex items-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </div>
          <input
            id="imdb-search-input"
            type="text"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              if (error) setError(validate(e.target.value));
            }}
            placeholder="Enter IMDb ID (e.g., tt0133093)"
            className={`input-field !pl-12 !rounded-full w-full ${error ? "!border-rose-500/50 !shadow-[0_0_0_3px_rgba(244,63,94,0.1)] focus:!border-rose-500" : ""}`}
            aria-label="IMDb Movie ID"
            aria-describedby={error ? "search-error" : undefined}
            autoComplete="off"
            disabled={isLoading}
          />
          <button
            id="search-button"
            type="submit"
            disabled={isLoading}
            className="btn-primary flex-shrink-0 whitespace-nowrap w-full sm:w-auto mt-2 sm:mt-0"
            aria-label="Analyze movie"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M9.663 17h4.673M12 3v1m6.364 1.636-.707.707M21 12h-1M4 12H3m3.343-5.657-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <span>Analyze</span>
              </>
            )}
          </button>
        </div>

        {/* Validation Error */}
        {error && (
          <p id="search-error" className="flex items-center gap-1.5 text-[#fb7185] text-[0.875rem] mt-2.5 pl-5 text-left animate-fade-in" role="alert">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {error}
          </p>
        )}
      </form>

      {/* Example Movies */}
      <div className="flex items-center justify-center flex-wrap gap-2.5 animate-fade-in-up [animation-delay:400ms] [animation-fill-mode:both]">
        <span className="text-[0.85rem] text-text-muted font-medium">Try an example:</span>
        <div className="flex flex-wrap justify-center gap-2">
          {EXAMPLE_IDS.map((movie) => (
            <button
              key={movie.id}
              onClick={() => handleExampleClick(movie.id)}
              disabled={isLoading}
              className="px-3.5 py-1.5 bg-white/5 border border-white/10 rounded-full text-text-secondary text-[0.8rem] font-medium cursor-pointer transition-all duration-200 font-sans hover:bg-accent-primary/10 hover:border-accent-primary/30 hover:text-[#818cf8] hover:-translate-y-[1px] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:bg-white/5 disabled:hover:border-white/10 disabled:hover:text-text-secondary"
              aria-label={`Search for ${movie.title}`}
            >
              {movie.title}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
