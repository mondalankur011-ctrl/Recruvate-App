const words = (value) =>
  String(value || "")
    .toLowerCase()
    .split(/[^a-z0-9+]+/)
    .filter((word) => word.length > 2);

export function matchScore(job, profile) {
  if (!job) return 0;
  const department = String(profile?.department || "").trim();
  if (!department) return 0;

  const departmentWords = words(department);
  const jobWords = [...words(job.title), ...words(job.department), ...(job.skills || []).flatMap(words)];

  const hits = departmentWords.filter((word) =>
    jobWords.some((jobWord) => jobWord.includes(word) || word.includes(jobWord))
  );
  const ratio = departmentWords.length ? hits.length / departmentWords.length : 0;
  const exact = job.department && job.department.toLowerCase() === department.toLowerCase() ? 12 : 0;

  return Math.max(52, Math.min(98, Math.round(56 + ratio * 30 + exact)));
}

export function matchTone(score) {
  if (score >= 80) return "bg-[#2C7A4B]";
  if (score >= 65) return "brand-gradient";
  return "bg-[#2E5AA8]";
}

export function qualityOf(seconds) {
  const value = Number(seconds) || 0;
  if (value < 40)
    return {
      label: `${Math.ceil(40 - value)}s to minimum`,
      short: `${Math.ceil(40 - value)}s to minimum`,
      badge: "bg-[#EE5C2B]/12 text-[#EE5C2B] border-[#EE5C2B]/25",
      bar: "bg-[#EE5C2B]",
    };
  if (value < 60)
    return {
      label: "Average",
      short: "Average",
      badge: "bg-[#D9A400]/14 text-[#9A7400] border-[#D9A400]/30",
      bar: "bg-[#E8B600]",
    };
  if (value < 90)
    return {
      label: "Good",
      short: "Good",
      badge: "bg-[#4CAF7D]/14 text-[#2C7A4B] border-[#4CAF7D]/30",
      bar: "bg-[#7CC49A]",
    };
  return {
    label: "Excellent",
    short: "Excellent",
    badge: "bg-[#2C7A4B] text-white border-[#2C7A4B]",
    bar: "bg-[#2C7A4B]",
  };
}

export function normalizeSocial(value, base) {
  const trimmed = String(value || "").trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (/^[a-z0-9-]+(\.[a-z]{2,})+/i.test(trimmed)) return `https://${trimmed}`;
  return `${base}${trimmed.replace(/^\/+/, "").replace(/^@/, "")}`;
}
