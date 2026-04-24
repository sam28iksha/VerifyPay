import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function getRiskLevel(score = 0) {
  if (score >= 70) {
    return "high";
  }

  if (score >= 40) {
    return "medium";
  }

  return "low";
}

export function getRiskPalette(score = 0) {
  const level = getRiskLevel(score);

  if (level === "high") {
    return {
      text: "text-red-700",
      bg: "bg-red-500",
      soft: "bg-red-50",
      border: "border-red-200"
    };
  }

  if (level === "medium") {
    return {
      text: "text-amber-700",
      bg: "bg-amber-400",
      soft: "bg-amber-50",
      border: "border-amber-200"
    };
  }

  return {
    text: "text-emerald-700",
    bg: "bg-emerald-500",
    soft: "bg-emerald-50",
    border: "border-emerald-200"
  };
}

export function formatDate(value) {
  try {
    return new Intl.DateTimeFormat("en-IN", {
      dateStyle: "medium",
      timeStyle: "short"
    }).format(new Date(value));
  } catch {
    return "Unknown time";
  }
}
