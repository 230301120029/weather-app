import { useState, useEffect } from "react";
export const ACCENTS = ["indigo", "ocean", "emerald", "sunset"];
const get = (k, d) => { try { return localStorage.getItem(k) || d; } catch { return d; } };
export default function useTheme() {
  const [theme, setTheme] = useState(() => get("theme", matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));
  const [accent, setAccent] = useState(() => get("accent", "indigo"));
  useEffect(() => {
    const d = document.documentElement;
    d.dataset.theme = theme; d.dataset.accent = accent;
    try { localStorage.setItem("theme", theme); localStorage.setItem("accent", accent); } catch {}
  }, [theme, accent]);
  return { theme, accent, setAccent, toggle: () => setTheme((t) => (t === "dark" ? "light" : "dark")) };
}
