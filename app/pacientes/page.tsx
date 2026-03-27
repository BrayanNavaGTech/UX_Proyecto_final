"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Sidebar } from "@/components/Sidebar";
import { useAuth } from "@/components/AuthProvider";
import { Search, User, Phone, Droplets } from "lucide-react";
import { useState } from "react";

export default function PacientesPage() {
  const { user } = useAuth();
  const patients = useQuery(api.patients.get);
  const [search, setSearch] = useState("");

  const filtered = patients?.filter(p => p.nombre.toLowerCase().includes(search.toLowerCase()));

  if (user?.role === "patient") return <div className="p-10 font-black text-center">ACCESO RESTRINGIDO</div>;

  return (
    <div className="flex h-screen overflow-hidden transition-colors duration-300" style={{ backgroundColor: 'var(--hc-bg)' }}>
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto p-8 fade-in">
        <header className="mb-10">
          <h1 className="text-3xl font-black" style={{ color: 'var(--hc-text)' }}>Expedientes de Pacientes</h1>
          <p className="font-bold text-xs uppercase tracking-widest mt-1" style={{ color: 'var(--hc-accent)' }}>Base de datos hospitalaria</p>
        </header>

        <div className="mb-8 p-6 rounded-[32px] border flex items-center gap-4 transition-all"
             style={{ backgroundColor: 'var(--hc-card)', borderColor: 'var(--hc-border)' }}>
          <Search size={20} style={{ color: 'var(--hc-text)' }} className="opacity-40" />
          <input 
            className="bg-transparent border-none outline-none w-full font-bold"
            style={{ color: 'var(--hc-text)' }}
            placeholder="Buscar por nombre..."
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered?.map((p) => (
            <div key={p._id} className="p-8 rounded-[40px] border shadow-lg transition-all hover:scale-[1.02]"
                 style={{ backgroundColor: 'var(--hc-card)', borderColor: 'var(--hc-border)' }}>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center font-black border"
                     style={{ backgroundColor: 'var(--hc-bg)', borderColor: 'var(--hc-accent)', color: 'var(--hc-accent)' }}>
                  {p.nombre.charAt(0)}
                </div>
                <div>
                  <h3 className="font-black uppercase tracking-tighter" style={{ color: 'var(--hc-text)' }}>{p.nombre}</h3>
                  <p className="text-[10px] font-bold opacity-50" style={{ color: 'var(--hc-text)' }}>ID: {p._id.slice(0,8)}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-xs font-bold" style={{ color: 'var(--hc-text)' }}>
                  <Phone size={14} className="opacity-40" /> {p.telefono}
                </div>
                <div className="flex items-center gap-3 text-xs font-bold" style={{ color: 'var(--hc-text)' }}>
                  <Droplets size={14} className="opacity-40" /> Sangre: {p.tipoSangre}
                </div>
              </div>

              <button className="w-full mt-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border"
                      style={{ borderColor: 'var(--hc-text)', color: 'var(--hc-text)' }}>
                Ver Historial Completo
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}