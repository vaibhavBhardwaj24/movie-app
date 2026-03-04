"use client";

import Image from "next/image";
import { useState } from "react";
import { CastMember } from "@/types/movie";
import styles from "./CastGrid.module.css";

interface CastGridProps {
  cast: CastMember[];
}

export default function CastGrid({ cast }: CastGridProps) {
  return (
    <div className={`${styles.grid} stagger-children`}>
      {cast.map((member) => (
        <CastCard key={member.id} member={member} />
      ))}
    </div>
  );
}

function CastCard({ member }: { member: CastMember }) {
  const [imgError, setImgError] = useState(false);
  const hasPhoto = member.profile_path && !imgError;
  const photoUrl = hasPhoto
    ? `https://image.tmdb.org/t/p/w185${member.profile_path}`
    : null;

  // Generate consistent initials for avatar
  const initials = member.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className={`${styles.card} animate-fade-in-up`}>
      <div className={styles.photoWrapper}>
        {photoUrl ? (
          <Image
            src={photoUrl}
            alt={member.name}
            fill
            sizes="80px"
            className={styles.photo}
            onError={() => setImgError(true)}
          />
        ) : (
          <div className={styles.photoFallback}>
            <span>{initials}</span>
          </div>
        )}
      </div>
      <div className={styles.info}>
        <div className={styles.name}>{member.name}</div>
        {member.character && (
          <div className={styles.character} title={member.character}>
            {member.character.length > 20
              ? member.character.slice(0, 20) + "…"
              : member.character}
          </div>
        )}
      </div>
    </div>
  );
}
