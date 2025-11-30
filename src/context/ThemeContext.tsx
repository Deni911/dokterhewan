import React, { createContext, useContext, useState, useEffect } from "react";

interface ThemeContextType {
  isDarkMode: boolean;
  toggleDarkMode: (e?: React.MouseEvent<HTMLButtonElement>) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check localStorage for saved theme preference
    const saved = localStorage.getItem("theme");
    if (saved) {
      return saved === "dark";
    }
    // Check system preference
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    // Save preference to localStorage
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");

    // Update HTML class for Tailwind dark mode
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const toggleDarkMode = (e?: React.MouseEvent<HTMLButtonElement>) => {
    // Add ripple effect if event is provided
    if (e) {
      const button = e.currentTarget;
      const ripple = document.createElement("span");
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      ripple.style.position = "absolute";
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      ripple.style.width = "0";
      ripple.style.height = "0";
      ripple.style.borderRadius = "50%";
      ripple.style.backgroundColor = isDarkMode
        ? "rgba(255, 255, 255, 0.5)"
        : "rgba(0, 0, 0, 0.2)";
      ripple.style.pointerEvents = "none";
      ripple.style.animation = "theme-ripple 0.6s ease-out";

      button.style.position = "relative";
      button.style.overflow = "hidden";
      button.appendChild(ripple);

      setTimeout(() => ripple.remove(), 600);
    }

    // Add theme transition animation
    document.documentElement.classList.add("theme-transitioning");
    setTimeout(() => {
      document.documentElement.classList.remove("theme-transitioning");
    }, 300);

    setIsDarkMode((prev) => !prev);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
