"use client";
import { LayoutDashboard, Users, Calendar, Stethoscope, LogOut, UserCircle } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const menu = [
    { name: "Dashboard", icon: <LayoutDashboard size={20}/>, path: "/", show: true },
    { name: "Citas", icon: <Calendar size={20}/>, path: "/citas", show: true },
    { name: "Pacientes", icon: <Users size={20}/>, path: "/pacientes", show: user?.role === "doctor" || user?.role === "admin" },
    { name: "Gestión Médica", icon: <Stethoscope size={20}/>, path: "/medicos", show: user?.role === "admin" },
  ];

  return (
    <aside className="custom-sidebar w-64 flex flex-col h-screen transition-colors duration-300">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-white shadow-lg">H</div>
        <span className="font-bold text-lg tracking-tight" style={{ color: 'var(--hc-text)' }}>MediControl</span>
      </div>

      <nav className="flex-grow mt-4 px-4 space-y-2">
        {menu.filter(item => item.show).map((item) => (
          <Link key={item.path} href={item.path} 
            className={`flex items-center px-4 py-3 rounded-xl transition-all font-medium ${pathname === item.path ? 'active-link' : 'hover:bg-black/5'}`}
            style={{ color: 'var(--hc-text)' }}
          >
            <span className="mr-3">{item.icon}</span>
            {item.name}
          </Link>
        ))}
      </nav>

      {/* Componente de Perfil adaptable al Alto Contraste */}
      <div className="mt-auto p-4 m-4 rounded-3xl border transition-all duration-300"
           style={{ backgroundColor: 'var(--hc-card)', borderColor: 'var(--hc-border)' }}>
        <div className="flex items-center gap-3 mb-4">
          <Link href="/perfil" className="relative group transition-transform hover:scale-105 active:scale-95">
            <img 
              src={`https://ui-avatars.com/api/?name=${user?.name}&background=020617&color=fff`} 
              className="w-12 h-12 rounded-2xl border-2 shadow-md object-cover transition-all" 
              style={{ borderColor: 'var(--hc-border)' }}
              alt="avatar" 
            />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 rounded-full" style={{ borderColor: 'var(--hc-card)' }}></div>
          </Link>
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-black truncate" style={{ color: 'var(--hc-text)' }}>{user?.name}</span>
            <span className="text-[10px] font-black uppercase tracking-widest opacity-70" style={{ color: 'var(--hc-accent)' }}>{user?.role}</span>
          </div>
        </div>
        
        <button 
          onClick={logout} 
          className="w-full flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest py-3 rounded-2xl transition-all border"
          style={{ backgroundColor: 'transparent', borderColor: 'var(--hc-text)', color: 'var(--hc-text)' }}
        >
          <LogOut size={14} /> Cerrar Sesión
        </button>
      </div>
    </aside>
  );
}