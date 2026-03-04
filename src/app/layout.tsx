import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CineAI — Movie Intelligence Platform",
  description:
    "Enter any IMDb movie ID to get instant movie details, cast information, audience reviews, and AI-powered sentiment analysis. Powered by OMDB, TMDB, and Google Gemini.",
  keywords: ["movie analysis", "IMDb", "AI sentiment", "movie reviews", "film intelligence"],
  authors: [{ name: "CineAI" }],
  openGraph: {
    title: "CineAI — Movie Intelligence Platform",
    description: "AI-powered movie analysis and audience sentiment insights",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  );
}
