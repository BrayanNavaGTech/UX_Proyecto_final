"use client";
import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";

export function AccessibilityToggle() {
  const [highContrast, setHighContrast] = useState(false);

  useEffect(() => {
    // Esto es lo que hace que todas las páginas que editamos cambien de color
    if (highContrast) {
      document.body.classList.add("high-contrast");
    } else {
      document.body.classList.remove("high-contrast");
    }
  }, [highContrast]);

  return (
    <button
      onClick={() => setHighContrast(!highContrast)}
      className="flex items-center gap-2 px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all border"
      style={{ 
        backgroundColor: highContrast ? 'var(--hc-accent)' : 'white',
        color: highContrast ? 'var(--hc-bg)' : 'black',
        borderColor: 'var(--hc-border)'
      }}
    >
      {highContrast ? <EyeOff size={14} /> : <Eye size={14} />}
      {highContrast ? "Modo Normal" : "Alto Contraste"}
    </button>
  );
}