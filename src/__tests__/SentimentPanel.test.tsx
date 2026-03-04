/**
 * Unit tests for the SentimentPanel component.
 * Tests rendering of sentiment data, color variants, and progress display.
 */
import React from "react";
import { render, screen } from "@testing-library/react";
import SentimentPanel from "@/components/SentimentPanel/SentimentPanel";
import { SentimentAnalysis } from "@/types/movie";

jest.mock("@/components/SentimentPanel/SentimentPanel.module.css", () => ({}));

const mockPositiveSentiment: SentimentAnalysis = {
  sentiment: "positive",
  summary: "Audiences have loved this film with outstanding visuals and storytelling.",
  keyThemes: ["Stunning Visuals", "Strong Acting", "Compelling Story"],
  audienceScore: 87,
  confidence: 92,
};

const mockNegativeSentiment: SentimentAnalysis = {
  sentiment: "negative",
  summary: "Many viewers found this film disappointing with weak plot development.",
  keyThemes: ["Weak Plot", "Poor Pacing"],
  audienceScore: 32,
  confidence: 75,
};

const mockMixedSentiment: SentimentAnalysis = {
  sentiment: "mixed",
  summary: "Reviews are split, with some praising visuals but criticizing the story.",
  keyThemes: ["Divisive", "Visual Spectacle"],
  audienceScore: 55,
  confidence: 80,
};

describe("SentimentPanel Component", () => {
  describe("Rendering", () => {
    it("renders the AI Sentiment Analysis heading", () => {
      render(<SentimentPanel analysis={mockPositiveSentiment} />);
      expect(screen.getByText(/AI Sentiment Analysis/i)).toBeInTheDocument();
    });

    it("renders Powered by Google Gemini subtitle", () => {
      render(<SentimentPanel analysis={mockPositiveSentiment} />);
      expect(screen.getByText(/Powered by Google Gemini/i)).toBeInTheDocument();
    });

    it("renders the sentiment summary", () => {
      render(<SentimentPanel analysis={mockPositiveSentiment} />);
      expect(screen.getByText(/Audiences have loved this film/i)).toBeInTheDocument();
    });

    it("renders key themes", () => {
      render(<SentimentPanel analysis={mockPositiveSentiment} />);
      expect(screen.getByText("Stunning Visuals")).toBeInTheDocument();
      expect(screen.getByText("Strong Acting")).toBeInTheDocument();
      expect(screen.getByText("Compelling Story")).toBeInTheDocument();
    });

    it("renders Key Themes label", () => {
      render(<SentimentPanel analysis={mockPositiveSentiment} />);
      expect(screen.getByText(/Key Themes/i)).toBeInTheDocument();
    });

    it("renders metric labels", () => {
      render(<SentimentPanel analysis={mockPositiveSentiment} />);
      expect(screen.getByText(/Audience Score/i)).toBeInTheDocument();
      expect(screen.getByText(/AI Confidence/i)).toBeInTheDocument();
    });
  });

  describe("Sentiment Variants", () => {
    it("shows Positive Reception for positive sentiment", () => {
      render(<SentimentPanel analysis={mockPositiveSentiment} />);
      expect(screen.getByText(/Positive Reception/i)).toBeInTheDocument();
    });

    it("shows Negative Reception for negative sentiment", () => {
      render(<SentimentPanel analysis={mockNegativeSentiment} />);
      expect(screen.getByText(/Negative Reception/i)).toBeInTheDocument();
    });

    it("shows Mixed Reception for mixed sentiment", () => {
      render(<SentimentPanel analysis={mockMixedSentiment} />);
      expect(screen.getByText(/Mixed Reception/i)).toBeInTheDocument();
    });

    it("shows the negative summary text", () => {
      render(<SentimentPanel analysis={mockNegativeSentiment} />);
      expect(screen.getByText(/Many viewers found this film disappointing/i)).toBeInTheDocument();
    });
  });

  describe("Theme Handling", () => {
    it("handles empty key themes gracefully", () => {
      const noThemes: SentimentAnalysis = {
        ...mockPositiveSentiment,
        keyThemes: [],
      };
      render(<SentimentPanel analysis={noThemes} />);
      // Should not crash and should not show Key Themes label
      expect(screen.queryByText(/Key Themes/i)).not.toBeInTheDocument();
    });

    it("renders all provided themes", () => {
      render(<SentimentPanel analysis={mockMixedSentiment} />);
      expect(screen.getByText("Divisive")).toBeInTheDocument();
      expect(screen.getByText("Visual Spectacle")).toBeInTheDocument();
    });
  });
});
