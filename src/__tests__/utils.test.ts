/**
 * Unit tests for utility logic and IMDb ID validation.
 * Tests the core validation regex used across the app.
 */

describe("IMDb ID Validation", () => {
  // This regex is the same used in SearchForm and the API route
  const IMDB_REGEX = /^tt\d{7,8}$/;

  describe("Valid IMDb IDs", () => {
    const validIds = [
      "tt0133093", // The Matrix
      "tt0111161", // The Shawshank Redemption
      "tt0468569", // The Dark Knight
      "tt1375666", // Inception
      "tt0816692", // Interstellar
      "tt1234567", // 7-digit
      "tt12345678", // 8-digit
    ];

    validIds.forEach((id) => {
      it(`should accept valid ID: ${id}`, () => {
        expect(IMDB_REGEX.test(id)).toBe(true);
      });
    });
  });

  describe("Invalid IMDb IDs", () => {
    const invalidIds = [
      "",
      "0133093",       // Missing tt prefix
      "tt013309",      // Too short (6 digits)
      "tt123456789",   // Too long (9 digits)
      "TT0133093",     // Uppercase TT
      "tt-0133093",    // Hyphen
      "tt 0133093",    // Space
      "abc0133093",    // Wrong prefix
      "tt013309a",     // Contains letter
    ];

    invalidIds.forEach((id) => {
      it(`should reject invalid ID: "${id}"`, () => {
        expect(IMDB_REGEX.test(id)).toBe(false);
      });
    });
  });
});

describe("Sentiment Score Classification", () => {
  const classifySentiment = (rating: number): "positive" | "mixed" | "negative" => {
    if (rating >= 7) return "positive";
    if (rating >= 5) return "mixed";
    return "negative";
  };

  it("classifies 10/10 as positive", () => {
    expect(classifySentiment(10)).toBe("positive");
  });

  it("classifies 7/10 as positive (boundary)", () => {
    expect(classifySentiment(7)).toBe("positive");
  });

  it("classifies 6.9/10 as mixed", () => {
    expect(classifySentiment(6.9)).toBe("mixed");
  });

  it("classifies 5/10 as mixed (boundary)", () => {
    expect(classifySentiment(5)).toBe("mixed");
  });

  it("classifies 4.9/10 as negative", () => {
    expect(classifySentiment(4.9)).toBe("negative");
  });

  it("classifies 1/10 as negative", () => {
    expect(classifySentiment(1)).toBe("negative");
  });
});

describe("Rating Percentage Parser", () => {
  // Logic mirrors RatingBar component
  const parseRatingToPercent = (value: string): number => {
    if (value.includes("%")) return parseFloat(value);
    if (value.includes("/10")) return (parseFloat(value) / 10) * 100;
    if (value.includes("/100")) return parseFloat(value);
    return 0;
  };

  it("parses percentage values correctly", () => {
    expect(parseRatingToPercent("87%")).toBe(87);
  });

  it("parses /10 ratings correctly", () => {
    expect(parseRatingToPercent("8.5/10")).toBeCloseTo(85);
  });

  it("parses /100 ratings correctly", () => {
    expect(parseRatingToPercent("74/100")).toBe(74);
  });

  it("returns 0 for unrecognized format", () => {
    expect(parseRatingToPercent("unknown")).toBe(0);
  });

  it("handles edge case of 10/10", () => {
    expect(parseRatingToPercent("10/10")).toBe(100);
  });
});
