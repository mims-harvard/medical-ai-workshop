"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const [light, setLight] = useState(false);

  useEffect(() => {
    setLight(document.documentElement.classList.contains("light"));
  }, []);

  function toggle() {
    const next = !light;
    document.documentElement.classList.toggle("light", next);
    localStorage.setItem("theme", next ? "light" : "dark");

    // Update theme-color meta tag
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute("content", next ? "#ffffff" : "#000000");
    }

    setLight(next);
  }

  return (
    <button
      type="button"
      aria-label={light ? "Switch to dark mode" : "Switch to light mode"}
      onClick={toggle}
      className="rounded-md p-1.5 text-on-surface-muted hover:text-on-surface transition-colors cursor-pointer"
    >
      {light ? <Moon size={16} /> : <Sun size={16} />}
    </button>
  );
}
