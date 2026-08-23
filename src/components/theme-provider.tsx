"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "dark",
  toggleTheme: () => {},
});


export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const stored = localStorage.getItem("nimeku-theme") as Theme | null;
    if (stored) {
      setTheme(stored);
    }

  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("nimeku-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    const nextTheme: Theme = theme === "dark" ? "light" : "dark";

    if (
      typeof document !== "undefined" &&
      "startViewTransition" in document &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      const width = Math.max(
        window.innerWidth,
        document.documentElement.clientWidth || 0,
        window.screen?.width || 0
      );
      const height = Math.max(
        window.innerHeight,
        document.documentElement.clientHeight || 0,
        window.screen?.height || 0
      );
      const endRadius = Math.ceil(Math.hypot(width, height) * 2.5);

      const transition = (document as any).startViewTransition(() => {
        setTheme(nextTheme);
        document.documentElement.classList.toggle("dark", nextTheme === "dark");
      });

      transition.ready.then(() => {
        document.documentElement.animate(
          {
            clipPath: [
              "circle(0px at 50% 0)",
              `circle(${endRadius}px at 50% 0)`,
            ],
          },
          {
            duration: 5000,
            easing: "cubic-bezier(0.16, 1, 0.3, 1)",
            pseudoElement: "::view-transition-new(root)",
          }
        );
      });
    } else {
      setTheme(nextTheme);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
