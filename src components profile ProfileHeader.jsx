import React from "react";

export default function ProfileHeader({ profile }) {
  const initials = (profile.full_name || "You")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  return (
    <div className="rounded-[26px] bg-foreground p-5 text-background">
      <div className="flex items-center gap-3.5">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl brand-gradient font-heading text-[18px] font-black">
          {initials}
        </span>
        <div className="min-w-0">
          <p className="truncate font-heading text-[19px] font-extrabold leading-tight">
            {profile.full_name || "Your name"}
          </p>
          <p className="mt-1 truncate text-sm text-background/55">
            {[profile.department, profile.location].filter(Boolean).join(" · ") || "Add your details"}
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="rounded-xl bg-background/10 px-3 py-2">
          <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-background/35">Email</p>
          <p className="mt-0.5 truncate text-sm font-medium text-background/85">{profile.email}</p>
        </div>
        <div className="rounded-xl bg-background/10 px-3 py-2">
          <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-background/35">Phone</p>
          <p className="mt-0.5 truncate text-sm font-medium text-background/85">
            {profile.phone || "Not added"}
          </p>
        </div>
      </div>
    </div>
  );
}
