"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface Theme {
  name: string;
  primary: string;
  primaryLight: string;
  primaryDark: string;
  secondary: string;
  secondaryLight: string;
  secondaryDark: string;
}

const themes: Theme[] = [
  {
    name: "Cyan",
    primary: "#06b6d4",
    primaryLight: "#22d3ee",
    primaryDark: "#0891b2",
    secondary: "#818cf8",
    secondaryLight: "#a5b4fc",
    secondaryDark: "#6366f1",
  },
  {
    name: "Violet",
    primary: "#8B5CF6",
    primaryLight: "#A78BFA",
    primaryDark: "#7C3AED",
    secondary: "#F472B6",
    secondaryLight: "#FBCFE8",
    secondaryDark: "#DB2777",
  },
  {
    name: "Amber",
    primary: "#F59E0B",
    primaryLight: "#FBBF24",
    primaryDark: "#D97706",
    secondary: "#10B981",
    secondaryLight: "#34D399",
    secondaryDark: "#059669",
  },
  {
    name: "Pink",
    primary: "#EC4899",
    primaryLight: "#F472B6",
    primaryDark: "#DB2777",
    secondary: "#8B5CF6",
    secondaryLight: "#A78BFA",
    secondaryDark: "#7C3AED",
  },
  {
    name: "Emerald",
    primary: "#10B981",
    primaryLight: "#34D399",
    primaryDark: "#059669",
    secondary: "#3B82F6",
    secondaryLight: "#60A5FA",
    secondaryDark: "#2563EB",
  },
];

interface BackgroundContextType {
  currentTheme: Theme;
  cycleTheme: () => void;
}

const BackgroundContext = createContext<BackgroundContextType | undefined>(
  undefined
);

export function BackgroundProvider({ children }: { children: React.ReactNode }) {
  const [themeIndex, setThemeIndex] = useState(0);

  const cycleTheme = () => {
    setThemeIndex((prev) => (prev + 1) % themes.length);
  };

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
      : "0, 0, 0";
  };

  useEffect(() => {
    const theme = themes[themeIndex];
    const root = document.documentElement;
    
    // Set Hex variables
    root.style.setProperty("--primary", theme.primary);
    root.style.setProperty("--primary-light", theme.primaryLight);
    root.style.setProperty("--primary-dark", theme.primaryDark);
    root.style.setProperty("--secondary", theme.secondary);
    root.style.setProperty("--secondary-light", theme.secondaryLight);
    root.style.setProperty("--secondary-dark", theme.secondaryDark);

    // Set RGB variables for transparency
    root.style.setProperty("--primary-rgb", hexToRgb(theme.primary));
    root.style.setProperty("--primary-light-rgb", hexToRgb(theme.primaryLight));
    root.style.setProperty("--secondary-rgb", hexToRgb(theme.secondary));
  }, [themeIndex]);

  return (
    <BackgroundContext.Provider value={{ currentTheme: themes[themeIndex], cycleTheme }}>
      {children}
    </BackgroundContext.Provider>
  );
}

export function useBackground() {
  const context = useContext(BackgroundContext);
  if (context === undefined) {
    throw new Error("useBackground must be used within a BackgroundProvider");
  }
  return context;
}
