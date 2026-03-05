"use client";

import Image from "next/image";
import { useState } from "react";
import { CastMember } from "@/types/movie";

interface CastGridProps {
  cast: CastMember[];
}

export default function CastGrid({ cast }: CastGridProps) {
  return (
    <div className="grid grid-cols-auto-fill-80 sm:grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-3 sm:gap-4 stagger-children">
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
    <div className="flex flex-col items-center gap-2 cursor-default transition-transform duration-200 hover:-translate-y-1 animate-fade-in-up group">
      <div className="relative w-[60px] h-[60px] sm:w-[72px] sm:h-[72px] rounded-full overflow-hidden border-2 border-border-subtle shrink-0 transition-all duration-200 group-hover:border-accent-primary group-hover:shadow-[0_0_16px_rgba(99,102,241,0.3)]">
        {photoUrl ? (
          <Image
            src={photoUrl}
            alt={member.name}
            fill
            sizes="80px"
            className="object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-primary flex items-center justify-center text-[1.2rem] font-bold text-white font-heading">
            <span>{initials}</span>
          </div>
        )}
      </div>
      <div className="text-center">
        <div className="text-[0.8rem] font-semibold text-text-primary leading-[1.3]">{member.name}</div>
        {member.character && (
          <div className="text-[0.72rem] text-text-muted mt-0.5 italic" title={member.character}>
            {member.character.length > 20
              ? member.character.slice(0, 20) + "…"
              : member.character}
          </div>
        )}
      </div>
    </div>
  );
}
