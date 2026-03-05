"use client";

export default function LoadingSkeleton() {
  return (
    <div className="flex flex-col gap-5 pb-16" aria-busy="true" aria-label="Loading movie data">
      {/* Top Card Skeleton */}
      <div className="glass-card grid grid-cols-1 md:grid-cols-[220px_1fr] gap-8 p-6 md:p-8">
        <div className="skeleton w-full aspect-[2/3] max-w-[200px] md:max-w-none mx-auto rounded-2xl" />
        <div className="flex flex-col gap-4">
          <div className="skeleton h-10 w-[70%] rounded-xl" />
          <div className="flex gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton h-[26px] w-[80px] rounded-full" />
            ))}
          </div>
          <div className="flex gap-6 mt-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col gap-1.5">
                <div className="skeleton h-3 w-[50px] rounded-md" />
                <div className="skeleton h-9 w-[80px] rounded-md" />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-3 mt-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="skeleton h-[40px] rounded-md" />
            ))}
          </div>
        </div>
      </div>

      {/* Plot Skeleton */}
      <div className="glass-card p-6 md:p-7">
        <div className="skeleton h-6 w-[150px] rounded-md mb-4" />
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="skeleton h-[14px] rounded-md mb-2.5"
            style={{ width: i === 3 ? "60%" : "100%" }}
          />
        ))}
      </div>

      {/* Sentiment Skeleton */}
      <div className="glass-card p-6 md:p-7">
        <div className="flex items-center gap-3.5 mb-4">
          <div className="skeleton w-10 h-10 rounded-xl shrink-0" />
          <div>
            <div className="skeleton h-[18px] w-[200px] rounded-md mb-1.5" />
            <div className="skeleton h-[12px] w-[130px] rounded-md" />
          </div>
        </div>
        <div className="h-px bg-border-card my-4" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="skeleton h-[14px] rounded-md mb-2.5" style={{ width: i === 3 ? "75%" : "100%" }} />
        ))}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
          <div className="flex flex-col gap-2">
            <div className="skeleton h-3 w-[100px] rounded-md" />
            <div className="skeleton h-2 rounded-full" />
          </div>
          <div className="flex flex-col gap-2">
            <div className="skeleton h-3 w-[100px] rounded-md" />
            <div className="skeleton h-2 rounded-full" />
          </div>
        </div>
      </div>

      {/* Loading Status */}
      <div className="flex flex-col items-center gap-3 p-6 text-text-muted text-[0.875rem]">
        <div className="flex gap-[4px]">
          <span className="w-2 h-2 bg-accent-primary rounded-full animate-dot-bounce" />
          <span className="w-2 h-2 bg-accent-primary rounded-full animate-dot-bounce [animation-delay:200ms]" />
          <span className="w-2 h-2 bg-accent-primary rounded-full animate-dot-bounce [animation-delay:400ms]" />
        </div>
        <p className="text-center">
          Fetching movie data &amp; running AI analysis...
        </p>
      </div>
    </div>
  );
}
