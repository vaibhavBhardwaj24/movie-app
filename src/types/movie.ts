/**
 * TypeScript interfaces for the Movie App
 */

export interface MovieDetails {
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  Ratings: Rating[];
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  imdbID: string;
  Type: string;
  DVD: string;
  BoxOffice: string;
  Production: string;
  Website: string;
  Response: string;
  Error?: string;
}

export interface Rating {
  Source: string;
  Value: string;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  known_for_department: string;
}

export interface MovieReview {
  id: string;
  author: string;
  content: string;
  rating?: number;
  created_at: string;
  url: string;
}

export type SentimentType = "positive" | "mixed" | "negative" | "unknown";

export interface SentimentAnalysis {
  sentiment: SentimentType;
  summary: string;
  keyThemes: string[];
  audienceScore: number; // 0-100
  confidence: number; // 0-100
}

export interface MovieAnalysisResult {
  movie: MovieDetails;
  cast: CastMember[];
  reviews: MovieReview[];
  sentimentAnalysis: SentimentAnalysis;
}

export interface ApiError {
  message: string;
  code?: string;
}
