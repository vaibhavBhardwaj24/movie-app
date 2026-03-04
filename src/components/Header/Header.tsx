"use client";

import styles from "./Header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        {/* Logo */}
        <div className={styles.logo}>
          <div className={styles.logoIcon}>
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
          <span className={styles.logoText}>
            Cine<span className="gradient-text">AI</span>
          </span>
        </div>

        {/* Nav Tags */}
        <nav className={styles.nav}>
          <span className={`badge badge-primary ${styles.navBadge}`}>
            ✦ Powered by Gemini
          </span>
        </nav>
      </div>
    </header>
  );
}
