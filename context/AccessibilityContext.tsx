"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const AccessibilityContext = createContext({
  fontSize: 1,
  highContrast: false,
  toggleContrast: () => {},
  setScale: (val: number) => {},
});

export const AccessibilityProvider = ({ children }: { children: React.ReactNode }) => {
  const [fontSize, setFontSize] = useState(1);
  const [highContrast, setHighContrast] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--font-multiplier', fontSize.toString());
    
    if (highContrast) {
      document.body.classList.add("high-contrast");
    } else {
      document.body.classList.remove("high-contrast");
    }
  }, [fontSize, highContrast]);

  return (
    <AccessibilityContext.Provider value={{ 
      fontSize, 
      highContrast, 
      toggleContrast: () => setHighContrast(!highContrast),
      setScale: (val) => setFontSize(val) 
    }}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => useContext(AccessibilityContext);