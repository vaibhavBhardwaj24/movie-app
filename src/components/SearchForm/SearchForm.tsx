"use client";

import { useState, FormEvent } from "react";
import styles from "./SearchForm.module.css";

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
    <div className={styles.wrapper}>
      {/* Hero Text */}
      <div className={styles.hero}>
        <div className={styles.heroBadge}>
          <span>🎬</span>
          <span>AI-Powered Movie Intelligence</span>
        </div>
        <h1 className={styles.heroTitle}>
          Discover the{" "}
          <span className="gradient-text">Pulse</span> of Any Film
        </h1>
        <p className={styles.heroSubtitle}>
          Enter an IMDb movie ID to unlock cast details, AI-generated sentiment
          analysis, and deep audience insights — all in seconds.
        </p>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSubmit} className={styles.form} noValidate>
        <div className={styles.inputWrapper}>
          <div className={styles.inputIcon}>
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
            className={`input-field ${styles.input} ${error ? styles.inputError : ""}`}
            aria-label="IMDb Movie ID"
            aria-describedby={error ? "search-error" : undefined}
            autoComplete="off"
            disabled={isLoading}
          />
          <button
            id="search-button"
            type="submit"
            disabled={isLoading}
            className={`btn-primary ${styles.searchBtn}`}
            aria-label="Analyze movie"
          >
            {isLoading ? (
              <>
                <div className={`${styles.spinner} animate-spin`} />
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
          <p id="search-error" className={styles.errorMsg} role="alert">
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
      <div className={styles.examples}>
        <span className={styles.examplesLabel}>Try an example:</span>
        <div className={styles.exampleChips}>
          {EXAMPLE_IDS.map((movie) => (
            <button
              key={movie.id}
              onClick={() => handleExampleClick(movie.id)}
              disabled={isLoading}
              className={styles.chip}
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
