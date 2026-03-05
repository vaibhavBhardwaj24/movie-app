"use client";

import { useState, useCallback } from "react";
import Header from "@/components/Header/Header";
import SearchForm from "@/components/SearchForm/SearchForm";
import MovieCard from "@/components/MovieCard/MovieCard";
import LoadingSkeleton from "@/components/LoadingSkeleton/LoadingSkeleton";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage";
import { MovieAnalysisResult } from "@/types/movie";

type AppState = "idle" | "loading" | "success" | "error";

export default function HomePage() {
  const [appState, setAppState] = useState<AppState>("idle");
  const [movieData, setMovieData] = useState<MovieAnalysisResult | null>(null);
  const [error, setError] = useState<string>("");
  const [lastSearchedId, setLastSearchedId] = useState<string>("");

  const handleSearch = useCallback(async (imdbId: string) => {
    setAppState("loading");
    setMovieData(null);
    setError("");
    setLastSearchedId(imdbId);

    try {
      const response = await fetch(`/api/movie?id=${encodeURIComponent(imdbId)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch movie data");
      }

      setMovieData(data);
      setAppState("success");

      // Smooth scroll to results
      setTimeout(() => {
        document.getElementById("results-section")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    } catch (err) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred";
      setError(message);
      setAppState("error");
    }
  }, []);

  const handleRetry = useCallback(() => {
    if (lastSearchedId) {
      handleSearch(lastSearchedId);
    }
  }, [lastSearchedId, handleSearch]);

  const isLoading = appState === "loading";

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 pb-8">
        <div className="container-custom">
          {/* Search Section */}
          <section aria-label="Movie Search">
            <SearchForm onSearch={handleSearch} isLoading={isLoading} />
          </section>

          {/* Results Section */}
          {appState !== "idle" && (
            <section id="results-section" className="mt-4 scroll-mt-20" aria-label="Movie Results" aria-live="polite">
              {appState === "loading" && <LoadingSkeleton />}
              {appState === "error" && (
                <ErrorMessage message={error} onRetry={handleRetry} />
              )}
              {appState === "success" && movieData && (
                <MovieCard data={movieData} />
              )}
            </section>
          )}

          {/* Empty State */}
          {appState === "idle" && (
            <section className="py-8 pb-16" aria-label="Getting started">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-auto-fit gap-4 stagger-children">
                {FEATURES.map((feature, i) => (
                  <div key={i} className="glass-card p-7 text-center animate-fade-in-up">
                    <div className="text-[2.25rem] mb-3.5">{feature.icon}</div>
                    <h3 className="text-[1.05rem] font-bold text-text-primary mb-2">{feature.title}</h3>
                    <p className="text-[0.85rem] text-text-secondary leading-relaxed">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <footer className="py-6 border-t border-border-card text-center">
        <div className="container-custom">
          <p className="text-[0.8rem] text-text-muted">
            Built with{" "}
            <span className="gradient-text font-bold">Next.js</span>
            {" "}·{" "}
            Data from{" "}
            <a href="https://www.omdbapi.com" target="_blank" rel="noopener noreferrer" className="text-[#818cf8] no-underline font-medium transition-colors hover:text-accent-secondary">OMDB</a>
            {" "}&amp;{" "}
            <a href="https://www.themoviedb.org" target="_blank" rel="noopener noreferrer" className="text-[#818cf8] no-underline font-medium transition-colors hover:text-accent-secondary">TMDB</a>
            {" "}· AI by{" "}
            <a href="https://deepmind.google/technologies/gemini/" target="_blank" rel="noopener noreferrer" className="text-[#818cf8] no-underline font-medium transition-colors hover:text-accent-secondary">Google Gemini</a>
          </p>
        </div>
      </footer>
    </div>
  );
}

const FEATURES = [
  {
    icon: "🎬",
    title: "Movie Details",
    desc: "Poster, cast, plot, ratings, box office data, and more from OMDB's comprehensive database.",
  },
  {
    icon: "🤖",
    title: "AI Sentiment Analysis",
    desc: "Google Gemini AI analyzes audience reviews to extract sentiment, themes, and insights.",
  },
  {
    icon: "⭐",
    title: "Multi-Source Ratings",
    desc: "IMDb, Rotten Tomatoes, and Metacritic ratings visualized with beautiful progress bars.",
  },
  {
    icon: "🎭",
    title: "Full Cast & Crew",
    desc: "Detailed cast information with photos and character names from TMDB.",
  },
];
