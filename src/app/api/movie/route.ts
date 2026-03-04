import { NextRequest, NextResponse } from "next/server";
import { MovieDetails, CastMember, MovieReview, SentimentAnalysis, MovieAnalysisResult } from "@/types/movie";
import { GoogleGenerativeAI } from "@google/generative-ai";

// ─── Helper: Fetch Movie Details from OMDB ─────────────────────────────────────
async function fetchMovieDetails(imdbId: string): Promise<MovieDetails> {
  const apiKey = process.env.OMDB_API_KEY;
  if (!apiKey) throw new Error("OMDB_API_KEY is not configured");

  const url = `https://www.omdbapi.com/?i=${imdbId}&plot=full&apikey=${apiKey}`;
  const response = await fetch(url, { next: { revalidate: 3600 } });

  if (!response.ok) {
    throw new Error(`OMDB API request failed: ${response.status}`);
  }

  const data: MovieDetails = await response.json();

  if (data.Response === "False") {
    throw new Error(data.Error || "Movie not found. Please check the IMDb ID.");
  }

  return data;
}

// ─── Helper: Fetch Cast from TMDB ─────────────────────────────────────────────
async function fetchCast(imdbId: string): Promise<CastMember[]> {
  const tmdbKey = process.env.TMDB_API_KEY;
  if (!tmdbKey) return []; // gracefully degrade if no TMDB key

  try {
    // First, find the TMDB movie ID using IMDb ID
    const findUrl = `https://api.themoviedb.org/3/find/${imdbId}?api_key=${tmdbKey}&external_source=imdb_id`;
    const findRes = await fetch(findUrl, { next: { revalidate: 3600 } });
    const findData = await findRes.json();
    const tmdbMovie = findData.movie_results?.[0];

    if (!tmdbMovie) return [];

    // Fetch credits
    const creditsUrl = `https://api.themoviedb.org/3/movie/${tmdbMovie.id}/credits?api_key=${tmdbKey}`;
    const creditsRes = await fetch(creditsUrl, { next: { revalidate: 3600 } });
    const creditsData = await creditsRes.json();

    // Return top 10 cast members
    return (creditsData.cast || []).slice(0, 10).map((member: CastMember) => ({
      id: member.id,
      name: member.name,
      character: member.character,
      profile_path: member.profile_path,
      known_for_department: member.known_for_department,
    }));
  } catch {
    return [];
  }
}

// ─── Helper: Fetch Reviews from TMDB ──────────────────────────────────────────
async function fetchReviews(imdbId: string): Promise<MovieReview[]> {
  const tmdbKey = process.env.TMDB_API_KEY;
  if (!tmdbKey) return [];

  try {
    const findUrl = `https://api.themoviedb.org/3/find/${imdbId}?api_key=${tmdbKey}&external_source=imdb_id`;
    const findRes = await fetch(findUrl, { next: { revalidate: 3600 } });
    const findData = await findRes.json();
    const tmdbMovie = findData.movie_results?.[0];

    if (!tmdbMovie) return [];

    // Fetch reviews
    const reviewsUrl = `https://api.themoviedb.org/3/movie/${tmdbMovie.id}/reviews?api_key=${tmdbKey}&language=en-US&page=1`;
    const reviewsRes = await fetch(reviewsUrl, { next: { revalidate: 3600 } });
    const reviewsData = await reviewsRes.json();

    return (reviewsData.results || []).slice(0, 15).map((review: {
      id: string;
      author: string;
      content: string;
      author_details?: { rating?: number };
      created_at: string;
      url: string;
    }) => ({
      id: review.id,
      author: review.author,
      content: review.content,
      rating: review.author_details?.rating,
      created_at: review.created_at,
      url: review.url,
    }));
  } catch {
    return [];
  }
}

// ─── Helper: AI Sentiment Analysis via Gemini ─────────────────────────────────
async function analyzeSentiment(
  movie: MovieDetails,
  reviews: MovieReview[]
): Promise<SentimentAnalysis> {
  const geminiKey = process.env.GEMINI_API_KEY;

  // Fallback sentiment when no Gemini key or no reviews
  if (!geminiKey) {
    return generateFallbackSentiment(movie);
  }

  try {
    const genAI = new GoogleGenerativeAI(geminiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Build context from movie info + reviews
    const reviewText = reviews.length > 0
      ? reviews.map((r) => `- "${r.content.slice(0, 300)}"`).join("\n")
      : `IMDb Rating: ${movie.imdbRating}/10 (${movie.imdbVotes} votes). Metascore: ${movie.Metascore}.`;

    const prompt = `
You are a movie sentiment analysis AI. Analyze the audience sentiment for the movie "${movie.Title}" (${movie.Year}).

Movie Info:
- Genre: ${movie.Genre}
- IMDb Rating: ${movie.imdbRating}/10 (${movie.imdbVotes} votes)
- Metascore: ${movie.Metascore}
- Awards: ${movie.Awards}
- Box Office: ${movie.BoxOffice}

Audience Reviews/Data:
${reviewText}

Provide a JSON response with:
1. "sentiment": one of "positive", "mixed", or "negative"
2. "summary": 2-3 sentence AI summary of what audiences think (80-120 words, engaging and insightful)
3. "keyThemes": array of 3-5 key themes audiences mention (e.g. "Stunning visuals", "Weak plot")
4. "audienceScore": number 0-100 representing overall audience approval
5. "confidence": number 0-100 representing your confidence in the analysis

Respond ONLY with valid JSON, no markdown, no extra text.
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    // Clean potential markdown code fences
    const jsonText = text.replace(/```json\n?|\n?```/g, "").trim();
    const parsed = JSON.parse(jsonText);

    return {
      sentiment: parsed.sentiment || "mixed",
      summary: parsed.summary || "Sentiment analysis unavailable.",
      keyThemes: parsed.keyThemes || [],
      audienceScore: parsed.audienceScore ?? 50,
      confidence: parsed.confidence ?? 70,
    };
  } catch (error) {
    console.error("Gemini sentiment analysis failed:", error);
    return generateFallbackSentiment(movie);
  }
}

/**
 * Fallback sentiment derived from IMDb rating when AI is unavailable
 */
function generateFallbackSentiment(movie: MovieDetails): SentimentAnalysis {
  const rating = parseFloat(movie.imdbRating) || 5;
  let sentiment: "positive" | "mixed" | "negative";
  let audienceScore: number;

  if (rating >= 7) {
    sentiment = "positive";
    audienceScore = Math.round((rating / 10) * 100);
  } else if (rating >= 5) {
    sentiment = "mixed";
    audienceScore = Math.round((rating / 10) * 100);
  } else {
    sentiment = "negative";
    audienceScore = Math.round((rating / 10) * 100);
  }

  return {
    sentiment,
    summary: `Based on an IMDb rating of ${movie.imdbRating}/10 from ${movie.imdbVotes} voters, audiences have given this film a ${sentiment} reception. The film ${rating >= 7 ? "has been well-received" : rating >= 5 ? "has received mixed reactions" : "has not resonated strongly"} with general viewers.`,
    keyThemes: movie.Genre.split(", ").slice(0, 3),
    audienceScore,
    confidence: 60,
  };
}

// ─── Main Route Handler ────────────────────────────────────────────────────────
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const imdbId = searchParams.get("id")?.trim();

  // Validate IMDb ID format
  if (!imdbId) {
    return NextResponse.json({ error: "IMDb ID is required" }, { status: 400 });
  }

  if (!/^tt\d{7,8}$/.test(imdbId)) {
    return NextResponse.json(
      { error: "Invalid IMDb ID format. Expected format: tt1234567" },
      { status: 400 }
    );
  }

  try {
    // Fetch all data in parallel where possible
    const movie = await fetchMovieDetails(imdbId);

    // Fetch cast and reviews in parallel
    const [cast, reviews] = await Promise.all([
      fetchCast(imdbId),
      fetchReviews(imdbId),
    ]);

    // Analyze sentiment using AI
    const sentimentAnalysis = await analyzeSentiment(movie, reviews);

    const result: MovieAnalysisResult = {
      movie,
      cast,
      reviews,
      sentimentAnalysis,
    };

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "An unexpected error occurred";
    console.error("Movie analysis error:", error);

    // Return appropriate status codes
    if (message.includes("not found") || message.includes("Movie not found")) {
      return NextResponse.json({ error: message }, { status: 404 });
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
