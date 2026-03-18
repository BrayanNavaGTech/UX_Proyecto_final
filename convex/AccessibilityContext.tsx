"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

const AccessibilityContext = createContext({
  fontSize: 1,
  highContrast: false,
  toggleContrast: () => {},
  updateFontSize: (val: number) => {},
});

export const AccessibilityProvider = ({ children }: { children: React.ReactNode }) => {
  const [fontSize, setFontSize] = useState(1);
  const [highContrast, setHighContrast] = useState(false);

  useEffect(() => {
    const body = document.body;
    highContrast ? body.classList.add("dark", "high-contrast") : body.classList.remove("dark", "high-contrast");
    body.style.fontSize = `${fontSize * 16}px`;
  }, [fontSize, highContrast]);

  return (
    <AccessibilityContext.Provider value={{ 
      fontSize, 
      highContrast, 
      toggleContrast: () => setHighContrast(!highContrast),
      updateFontSize: (val) => setFontSize(val) 
    }}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => useContext(AccessibilityContext);