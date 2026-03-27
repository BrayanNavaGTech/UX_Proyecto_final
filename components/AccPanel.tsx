"use client";

import { useState } from "react";
import { useAccessibility } from "@/context/AccessibilityContext";
import { Settings, Type, Eye, X } from "lucide-react";

export function AccPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const { setScale, toggleContrast, highContrast } = useAccessibility();

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform"
      >
        {isOpen ? <X size={28} /> : <Settings size={28} />}
      </button>

      {isOpen && (
        <div className="absolute bottom-20 right-0 w-72 custom-card p-6 rounded-2xl shadow-2xl border fade-in">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-foreground">
            Ajustes de Interfaz
          </h3>
          
          <div className="space-y-6">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tamaño de Texto</label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                <button onClick={() => setScale(1)} className="p-2 border rounded-lg hover:bg-slate-100 text-foreground">A</button>
                <button onClick={() => setScale(1.25)} className="p-2 border rounded-lg hover:bg-slate-100 font-bold text-foreground">A+</button>
                <button onClick={() => setScale(1.5)} className="p-2 border rounded-lg hover:bg-slate-100 font-black text-foreground">A++</button>
              </div>
            </div>

            <div className="flex items-center justify-between py-2 border-t border-slate-200">
              <span className="text-sm font-semibold text-foreground">Alto Contraste</span>
              <button 
                onClick={toggleContrast}
                className={`w-12 h-6 rounded-full transition-colors relative ${highContrast ? 'bg-yellow-400' : 'bg-slate-300'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${highContrast ? 'left-7' : 'left-1'}`}></div>
              </button>
            </div>

            <button 
              onClick={() => setIsOpen(false)}
              className="w-full bg-slate-900 text-white py-2 rounded-lg text-sm font-bold"
            >
              Cerrar Ajustes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}