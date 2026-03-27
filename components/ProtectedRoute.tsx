"use client";
import { useRole } from "@/hooks/useRole";
import { ShieldAlert, Home } from "lucide-react";
import Link from "next/link";

interface Props {
  children: React.ReactNode;
  allowedRoles: ("doctor" | "patient" | "admin")[];
}

export function ProtectedRoute({ children, allowedRoles }: Props) {
  const { user } = useRole();

  if (!user || !allowedRoles.includes(user.role)) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-50 p-6">
        <div className="custom-card p-10 max-w-lg text-center shadow-2xl border-none rounded-[40px]">
          <div className="w-20 h-20 bg-red-100 text-red-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <ShieldAlert size={40} />
          </div>
          <h2 className="text-2xl font-black mb-2">Acceso Restringido</h2>
          <p className="text-slate-500 mb-8 font-medium">
            Lo sentimos, no tienes los permisos necesarios para ver esta sección. 
            Esta área es exclusiva para: <span className="font-bold text-slate-900">{allowedRoles.join(", ")}</span>.
          </p>
          <Link href="/" className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-3 rounded-2xl font-bold hover:scale-105 transition-all">
            <Home size={18} /> Volver al Inicio
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}