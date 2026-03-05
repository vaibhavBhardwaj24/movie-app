"use client";

export default function Header() {
  return (
    <header className="sticky top-0 z-[100] bg-bg-primary/85 backdrop-blur-[20px] border-b border-border-card py-4">
      <div className="container-custom flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2.5 no-underline">
          <div className="w-9 h-9 bg-[linear-gradient(135deg,rgba(99,102,241,0.2),rgba(168,85,247,0.2))] border border-[rgba(99,102,241,0.3)] rounded-[10px] flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                fill="url(#star-grad)"
              />
              <defs>
                <linearGradient id="star-grad" x1="0" y1="0" x2="24" y2="24">
                  <stop stopColor="#6366f1" />
                  <stop offset="1" stopColor="#a855f7" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span className="font-heading text-2xl font-bold text-text-primary tracking-[-0.02em]">
            Cine<span className="gradient-text">AI</span>
          </span>
        </div>

        {/* Nav Tags */}
        <nav className="flex items-center gap-4">
          <span className="badge badge-primary text-[0.7rem] hidden sm:inline-flex">
            ✦ Powered by Gemini
          </span>
        </nav>
      </div>
    </header>
  );
}
