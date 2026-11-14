import React from "react";

const LEVELS = [
  { label: "Too Weak", text: "text-[#C0392B]", bar: "bg-[#C0392B]" },
  { label: "Weak", text: "text-[#EE5C2B]", bar: "bg-[#EE5C2B]" },
  { label: "Good", text: "text-[#2E5AA8]", bar: "bg-[#2E5AA8]" },
  { label: "Strong", text: "text-[#2C7A4B]", bar: "bg-[#2C7A4B]" },
];

export function passwordStrength(password) {
  if (!password) return -1;
  if (password.length < 8) return 0;
  let variety = 0;
  if (/[a-z]/.test(password)) variety += 1;
  if (/[A-Z]/.test(password)) variety += 1;
  if (/\d/.test(password)) variety += 1;
  if (/[^A-Za-z0-9]/.test(password)) variety += 1;
  if (variety >= 4 || (variety >= 3 && password.length >= 12)) return 3;
  if (variety >= 2) return 2;
  return 1;
}

export default function PasswordStrength({ password }) {
  if (!password) return null;
  const level = Math.max(0, passwordStrength(password));
  const meta = LEVELS[level];
  const missing = 8 - password.length;

  return (
    <div className="mt-2 px-1" aria-live="polite">
      <div className="flex gap-1.5">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
              i <= level ? meta.bar : "bg-muted"
            }`}
          />
        ))}
      </div>
      <div className="mt-1.5 flex items-center justify-between text-sm">
        <span className={`font-semibold ${meta.text}`}>{meta.label}</span>
        <span className="text-foreground/40">
          {missing > 0 ? `${missing} more character${missing === 1 ? "" : "s"}` : "Minimum 8 characters"}
        </span>
      </div>
    </div>
  );
}
