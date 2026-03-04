# 🎬 CineAI — Movie Intelligence Platform

> An AI-powered movie analysis app that lets you enter any IMDb movie ID and instantly get rich movie details, cast information, audience reviews, and a **Google Gemini AI-generated sentiment analysis**.

![CineAI Screenshot](./public/screenshot.png)

## ✨ Features

- 🔍 **IMDb ID Lookup** — Enter any IMDb ID (e.g., `tt0133093`) to fetch full movie details
- 🎭 **Movie Details** — Title, poster, cast list, release year, genre, runtime, box office, and more
- ⭐ **Multi-Source Ratings** — IMDb, Rotten Tomatoes, and Metacritic ratings with animated progress bars
- 📖 **Plot Summary** — Full and short plot summaries from OMDB
- 🤖 **AI Sentiment Analysis** — Google Gemini AI analyzes audience reviews to generate:
  - Overall sentiment classification: **Positive / Mixed / Negative**
  - Audience score (0–100)
  - Key audience themes
  - Natural language summary of audience opinion
- 👥 **Full Cast Grid** — Profile photos and character names from TMDB
- 💬 **Audience Reviews** — Real user reviews from TMDB with expandable text
- 📱 **Responsive Design** — Works beautifully on desktop, tablet, and mobile
- ✅ **Input Validation** — IMDb ID format validation with helpful error messages
- ⚡ **Example Movies** — Quick-access buttons for famous films

---

## 🧑‍💻 Tech Stack

### Frontend
- **[Next.js 15](https://nextjs.org/)** (App Router) — React framework with server-side capabilities and file-based routing
- **TypeScript** — End-to-end type safety
- **CSS Modules** — Scoped, maintainable styles without build overhead of utility frameworks
- **No Tailwind** — Vanilla CSS gives maximum design flexibility for premium aesthetics

### Backend (via Next.js API Routes)
- **Next.js API Routes** — Serverless handler at `/api/movie` that orchestrates 3 external APIs
- **Server-side API calls** — API keys never exposed to the browser

### Data Sources
| Service | Purpose | Cost |
|---------|---------|------|
| [OMDB API](https://www.omdbapi.com) | Movie details, ratings, plot, cast metadata | Free (1,000 req/day) |
| [TMDB API](https://www.themoviedb.org/settings/api) | Cast photos, character names, audience reviews | Free |
| [Google Gemini](https://aistudio.google.com) | AI sentiment analysis generation | Free tier available |

### Testing
- **[Jest](https://jestjs.io/)** — Test runner
- **[React Testing Library](https://testing-library.com/)** — Component testing (user-centric)
- **[@testing-library/user-event](https://testing-library.com/docs/user-event/intro)** — Realistic user interaction simulation

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- API keys (free tiers available for all)

### 1. Clone & Install Dependencies

```bash
git clone <your-repo-url>
cd movie-app
npm install
```

### 2. Get API Keys (all free)

#### OMDB API Key
1. Go to [https://www.omdbapi.com/apikey.aspx](https://www.omdbapi.com/apikey.aspx)
2. Select **Free** plan
3. Enter your email and check your inbox

#### TMDB API Key
1. Create an account at [https://www.themoviedb.org](https://www.themoviedb.org)
2. Go to **Settings → API**
3. Click **Create** and fill in the form
4. Copy your **API Key (v3 auth)**

#### Google Gemini API Key
1. Go to [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
2. Click **Create API Key**
3. Copy the key

### 3. Configure Environment Variables

Create a `.env.local` file in the project root:

```env
OMDB_API_KEY=your_omdb_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
TMDB_API_KEY=your_tmdb_api_key_here
```

> ⚠️ **Important**: Never commit `.env.local` to version control. It's already in `.gitignore`.

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Run Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run with coverage report
npm run test:coverage
```

---

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── movie/
│   │       └── route.ts        # Main API route (OMDB + TMDB + Gemini)
│   ├── globals.css             # Global styles & design system
│   ├── layout.tsx              # Root layout with SEO metadata
│   ├── page.tsx                # Main page (state management)
│   └── page.module.css
├── components/
│   ├── Header/                 # Sticky navigation header
│   ├── SearchForm/             # Hero section + search input + validation
│   ├── MovieCard/              # Main result display (poster, info, tabs)
│   ├── SentimentPanel/         # AI analysis with animated score counters
│   ├── CastGrid/               # Cast member cards with TMDB photos
│   ├── ReviewsSection/         # Expandable audience reviews
│   ├── LoadingSkeleton/        # Shimmer loading skeleton
│   └── ErrorMessage/           # Error display with context hints
├── types/
│   └── movie.ts                # TypeScript interfaces
└── __tests__/
    ├── SearchForm.test.tsx     # SearchForm unit tests
    ├── SentimentPanel.test.tsx # SentimentPanel unit tests
    └── utils.test.ts           # Validation & utility logic tests
```

---

## 🎨 Design Decisions

### Dark Theme with Glassmorphism
The app uses a deep navy/dark background (`#080b14`) with glassmorphic cards that have `backdrop-filter: blur(20px)` for a premium feel aligned with modern design trends like Linear, Vercel, and Raycast.

### Animated Gradient Orbs
Background orbs animate on CSS keyframe loops to create a sense of depth and make the page feel "alive" without JavaScript overhead.

### Skeleton Loading States
Rather than a spinner, the loading state renders a pixel-perfect skeleton of the final result layout, dramatically improving perceived performance.

### Fallback Graceful Degradation
- If **TMDB key** is missing: Cast and reviews sections are hidden (not broken)
- If **Gemini key** is missing: Sentiment analysis falls back to IMDb rating-based classification
- If **movie poster** fails: A styled emoji placeholder is shown

---

## 🔧 Assumptions

1. **API Key Availability** — The app assumes users will obtain free API keys from the mentioned services. All three services have sufficient free tiers for development and demo use.

2. **TMDB-OMDB Linking** — Cast photos and reviews rely on TMDB finding the movie via its IMDb ID. A small number of obscure films may not appear in TMDB's database.

3. **Gemini API** — The AI sentiment analysis uses `gemini-1.5-flash`, which has a generous free tier of 1M tokens/day. Each analysis request uses approximately 500-1000 tokens.

4. **Review Availability** — Not all movies on TMDB have user reviews. When no reviews exist, Gemini falls back to analyzing the movie's IMDb/Metascore ratings.

5. **IMDb ID Format** — The app validates for the standard `tt` + 7-8 digits format (e.g., `tt0133093`, `tt12345678`).

---

## 📊 API Rate Limits

| Service | Free Limit | Strategy Used |
|---------|-----------|---------------|
| OMDB | 1,000 req/day | Server-side caching with `next: { revalidate: 3600 }` |
| TMDB | 40 req/10s | Parallel fetches (2 requests per movie lookup) |
| Gemini | 15 req/min | 1 request per movie analysis |

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

Add the three environment variables in your Vercel project settings before deploying.

### Build for Production

```bash
npm run build
npm start
```

---

## 📜 License

MIT — Free to use for educational and portfolio purposes.

---

## 🍿 Fun Fact

> 🎬 **Did you know?** The IMDb identifier format (`tt` followed by numbers) that this app uses stands for **"title"** in IMDb's internal database system. The `tt` prefix has been used since IMDb launched in **1990** — making it one of the oldest consistent identifier schemes still in active use on the modern web! For example, `tt0111161` maps to *The Shawshank Redemption*, which has held the **#1 spot** on IMDb's Top 250 list for over **15 years**. 🏆

---

*Built with ❤️ using Next.js, TypeScript, and Google Gemini AI*
