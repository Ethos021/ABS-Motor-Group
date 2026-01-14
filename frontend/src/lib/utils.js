import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value, locale = "en-AU", currency = "AUD") {
  const number = Number(value);
  if (Number.isNaN(number)) return "";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(number);
}

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4000/api";
