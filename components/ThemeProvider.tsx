"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark" | "rose" | "midnight";

const ThemeContext = createContext<{
  theme: Theme;
  toggleTheme: () => void;
}>({
  theme: "light",
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.remove("light", "dark", "rose", "midnight");
      if (savedTheme !== "light") {
        document.documentElement.classList.add(savedTheme);
      }
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const themes: Theme[] = ["light", "dark", "rose", "midnight"];
    const currentIndex = themes.indexOf(theme);
    const newTheme = themes[(currentIndex + 1) % themes.length];
    
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    
    document.documentElement.classList.remove("light", "dark", "rose", "midnight");
    if (newTheme !== "light") {
      document.documentElement.classList.add(newTheme);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
