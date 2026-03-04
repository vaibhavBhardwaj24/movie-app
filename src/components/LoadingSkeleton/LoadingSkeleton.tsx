"use client";

import styles from "./LoadingSkeleton.module.css";

export default function LoadingSkeleton() {
  return (
    <div className={styles.container} aria-busy="true" aria-label="Loading movie data">
      {/* Top Card Skeleton */}
      <div className={`glass-card ${styles.topCard}`}>
        <div className={`skeleton ${styles.poster}`} />
        <div className={styles.infoSection}>
          <div className={`skeleton ${styles.titleSkeleton}`} />
          <div className={styles.genreRow}>
            {[1, 2, 3].map((i) => (
              <div key={i} className={`skeleton ${styles.genreChip}`} />
            ))}
          </div>
          <div className={styles.ratingsRow}>
            {[1, 2, 3].map((i) => (
              <div key={i} className={styles.ratingBox}>
                <div className={`skeleton ${styles.ratingLabel}`} />
                <div className={`skeleton ${styles.ratingValue}`} />
              </div>
            ))}
          </div>
          <div className={styles.metaGrid}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className={`skeleton ${styles.metaItem}`} />
            ))}
          </div>
        </div>
      </div>

      {/* Plot Skeleton */}
      <div className={`glass-card ${styles.plotCard}`}>
        <div className={`skeleton ${styles.sectionTitle}`} />
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={`skeleton ${styles.plotLine}`}
            style={{ width: i === 3 ? "60%" : "100%" }}
          />
        ))}
      </div>

      {/* Sentiment Skeleton */}
      <div className={`glass-card ${styles.sentimentCard}`}>
        <div className={styles.sentimentHeader}>
          <div className={`skeleton ${styles.aiIconSkeleton}`} />
          <div>
            <div className={`skeleton ${styles.sentTitleSkeleton}`} />
            <div className={`skeleton ${styles.sentSubSkeleton}`} />
          </div>
        </div>
        <div className={styles.divSkeleton} />
        {[1, 2, 3].map((i) => (
          <div key={i} className={`skeleton ${styles.summaryLine}`} style={{ width: i === 3 ? "75%" : "100%" }} />
        ))}
        <div className={styles.progressRow}>
          <div className={styles.progressItem}>
            <div className={`skeleton ${styles.progressLabel}`} />
            <div className={`skeleton ${styles.progressBar}`} />
          </div>
          <div className={styles.progressItem}>
            <div className={`skeleton ${styles.progressLabel}`} />
            <div className={`skeleton ${styles.progressBar}`} />
          </div>
        </div>
      </div>

      {/* Loading Status */}
      <div className={styles.loadingStatus}>
        <div className={styles.loadingDots}>
          <span />
          <span />
          <span />
        </div>
        <p className={styles.loadingText}>
          Fetching movie data &amp; running AI analysis...
        </p>
      </div>
    </div>
  );
}
