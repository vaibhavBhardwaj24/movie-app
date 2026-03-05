/**
 * Unit tests for the SearchForm component.
 * Tests validation logic, user interactions, and example movie clicks.
 */
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SearchForm from "@/components/SearchForm/SearchForm";

// Mock CSS modules to avoid JSDOM styling issues


const mockOnSearch = jest.fn();

const renderSearchForm = (isLoading = false) =>
  render(<SearchForm onSearch={mockOnSearch} isLoading={isLoading} />);

describe("SearchForm Component", () => {
  beforeEach(() => {
    mockOnSearch.mockClear();
  });

  describe("Rendering", () => {
    it("renders the hero title", () => {
      renderSearchForm();
      expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    });

    it("renders the search input", () => {
      renderSearchForm();
      expect(screen.getByLabelText(/IMDb Movie ID/i)).toBeInTheDocument();
    });

    it("renders the analyze button", () => {
      renderSearchForm();
      expect(screen.getByRole("button", { name: /analyze movie/i })).toBeInTheDocument();
    });

    it("renders example movie chips", () => {
      renderSearchForm();
      expect(screen.getByRole("button", { name: /search for The Matrix/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /search for Inception/i })).toBeInTheDocument();
    });
  });

  describe("Validation", () => {
    it("shows error when submitting empty form", async () => {
      renderSearchForm();
      const button = screen.getByRole("button", { name: /analyze movie/i });
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByRole("alert")).toHaveTextContent(/please enter an imdb id/i);
      });
      expect(mockOnSearch).not.toHaveBeenCalled();
    });

    it("shows error for invalid IMDb ID format", async () => {
      renderSearchForm();
      const input = screen.getByLabelText(/IMDb Movie ID/i);
      await userEvent.type(input, "invalid-id");
      fireEvent.click(screen.getByRole("button", { name: /analyze movie/i }));

      await waitFor(() => {
        expect(screen.getByRole("alert")).toHaveTextContent(/invalid format/i);
      });
      expect(mockOnSearch).not.toHaveBeenCalled();
    });

    it("accepts valid IMDb IDs with 7 digits", async () => {
      renderSearchForm();
      const input = screen.getByLabelText(/IMDb Movie ID/i);
      await userEvent.type(input, "tt0133093");
      fireEvent.click(screen.getByRole("button", { name: /analyze movie/i }));

      await waitFor(() => {
        expect(mockOnSearch).toHaveBeenCalledWith("tt0133093");
      });
    });

    it("accepts valid IMDb IDs with 8 digits", async () => {
      renderSearchForm();
      const input = screen.getByLabelText(/IMDb Movie ID/i);
      await userEvent.type(input, "tt12345678");
      fireEvent.click(screen.getByRole("button", { name: /analyze movie/i }));

      await waitFor(() => {
        expect(mockOnSearch).toHaveBeenCalledWith("tt12345678");
      });
    });

    it("rejects IDs without tt prefix", async () => {
      renderSearchForm();
      const input = screen.getByLabelText(/IMDb Movie ID/i);
      await userEvent.type(input, "0133093");
      fireEvent.click(screen.getByRole("button", { name: /analyze movie/i }));

      await waitFor(() => {
        expect(screen.getByRole("alert")).toBeInTheDocument();
      });
      expect(mockOnSearch).not.toHaveBeenCalled();
    });
  });

  describe("Example Movie Chips", () => {
    it("clicking an example chip triggers search with correct ID", async () => {
      renderSearchForm();
      const matrixButton = screen.getByRole("button", { name: /search for The Matrix/i });
      fireEvent.click(matrixButton);

      expect(mockOnSearch).toHaveBeenCalledWith("tt0133093");
    });

    it("clicking an example chip fills the input", async () => {
      renderSearchForm();
      const matrixButton = screen.getByRole("button", { name: /search for The Matrix/i });
      fireEvent.click(matrixButton);

      const input = screen.getByLabelText(/IMDb Movie ID/i) as HTMLInputElement;
      expect(input.value).toBe("tt0133093");
    });
  });

  describe("Loading State", () => {
    it("disables the search button when loading", () => {
      renderSearchForm(true);
      const button = screen.getByRole("button", { name: /analyze movie/i });
      expect(button).toBeDisabled();
    });

    it("disables example chips when loading", () => {
      renderSearchForm(true);
      const chips = screen.getAllByRole("button");
      chips.forEach((chip) => {
        if (chip.getAttribute("id") !== "search-button") {
          expect(chip).toBeDisabled();
        }
      });
    });

    it("shows loading text when isLoading is true", () => {
      renderSearchForm(true);
      expect(screen.getByText(/analyzing/i)).toBeInTheDocument();
    });
  });
});
