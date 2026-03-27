"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Sidebar } from "@/components/Sidebar";
import { useAuth } from "@/components/AuthProvider";
import { 
  Users, 
  Calendar, 
  Activity, 
  ShieldCheck,
  Stethoscope,
  Heart,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { user } = useAuth();
  const appointments = useQuery(api.appointments.getDetailed);
  const allUsers = useQuery(api.users.getAllUsers);
  const currentDoctor = useQuery(api.doctors.getByUserId, { userId: user?._id });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const isPatient = user?.role === "patient";
  const isAdmin = user?.role === "admin";
  const isDoctor = user?.role === "doctor";

  const stats = {
    pacientes: allUsers?.filter(u => u.role === "patient").length || 0,
    doctores: allUsers?.filter(u => u.role === "doctor").length || 0,
    citasPendientes: appointments?.filter(a => a.estado === "pendiente").length || 0
  };

  const getFilteredAppointments = () => {
    if (!appointments) return [];
    if (isDoctor && currentDoctor) {
      return appointments.filter(app => app.doctorId === currentDoctor._id).slice(-3).reverse();
    }
    if (isAdmin) {
      return appointments;
    }
    return [];
  };

  const filteredData = getFilteredAppointments();
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = isAdmin 
    ? filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : filteredData;

  return (
    <div className="flex h-screen overflow-hidden transition-colors duration-300" style={{ backgroundColor: 'var(--hc-bg)' }}>
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto relative p-8 fade-in">
        <header className="sticky top-0 z-10 p-8 flex justify-between items-center mb-10 shadow-sm border rounded-[32px] transition-all"
                style={{ backgroundColor: 'var(--hc-card)', borderColor: 'var(--hc-border)' }}>
          <div>
            <h1 className="text-3xl font-black tracking-tight" style={{ color: 'var(--hc-text)' }}>
              {isPatient ? `¡Hola, ${user?.name}!` : "Panel de Control"}
            </h1>
            <p className="text-[10px] font-black opacity-60 uppercase tracking-[0.2em] mt-1" style={{ color: 'var(--hc-text)' }}>
              {isPatient ? "Tu salud es nuestra prioridad" : `Gestión Hospitalaria — ${user?.role}`}
            </p>
          </div>
          <div className="px-4 py-2 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 border"
               style={{ backgroundColor: 'var(--hc-accent)', color: 'var(--hc-bg)', borderColor: 'var(--hc-accent)' }}>
            <ShieldCheck size={14} /> Acceso Verificado
          </div>
        </header>

        {isPatient ? (
          <div className="max-w-4xl mx-auto py-12">
            <div className="p-12 rounded-[40px] shadow-xl text-center relative overflow-hidden border transition-all"
                 style={{ backgroundColor: 'var(--hc-card)', borderColor: 'var(--hc-border)' }}>
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Heart size={200} style={{ color: 'var(--hc-accent)' }} />
              </div>
              <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-8 border"
                   style={{ backgroundColor: 'var(--hc-bg)', borderColor: 'var(--hc-accent)', color: 'var(--hc-accent)' }}>
                <Stethoscope size={40} />
              </div>
              <h2 className="text-4xl font-black mb-4" style={{ color: 'var(--hc-text)' }}>Bienvenido a MediControl</h2>
              <p className="text-lg font-medium max-w-xl mx-auto mb-10 leading-relaxed opacity-80" style={{ color: 'var(--hc-text)' }}>
                Has ingresado exitosamente a tu portal de salud. Aquí podrás gestionar tus citas y revisar tu historial médico de forma segura.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                <Link href="/citas" className="group p-6 rounded-[32px] border transition-all hover:scale-[1.02]"
                      style={{ backgroundColor: 'var(--hc-bg)', borderColor: 'var(--hc-border)' }}>
                  <Calendar className="mb-4 transition-colors" size={32} style={{ color: 'var(--hc-accent)' }} />
                  <h3 className="font-black text-xl" style={{ color: 'var(--hc-text)' }}>Agendar Cita</h3>
                  <p className="text-sm mt-1 opacity-70" style={{ color: 'var(--hc-text)' }}>Consulta disponibilidad de especialistas.</p>
                </Link>
                <Link href="/perfil" className="group p-6 rounded-[32px] border transition-all hover:scale-[1.02]"
                      style={{ backgroundColor: 'var(--hc-bg)', borderColor: 'var(--hc-border)' }}>
                  <Users className="mb-4 transition-colors" size={32} style={{ color: 'var(--hc-accent)' }} />
                  <h3 className="font-black text-xl" style={{ color: 'var(--hc-text)' }}>Mi Expediente</h3>
                  <p className="text-sm mt-1 opacity-70" style={{ color: 'var(--hc-text)' }}>Completa tu información personal.</p>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 rounded-[32px] shadow-sm border flex justify-between items-start transition-all"
                   style={{ backgroundColor: 'var(--hc-card)', borderColor: 'var(--hc-border)' }}>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-60" style={{ color: 'var(--hc-text)' }}>Pacientes</p>
                  <h2 className="text-4xl font-black mt-2" style={{ color: 'var(--hc-text)' }}>{stats.pacientes}</h2>
                </div>
                <div className="p-4 rounded-2xl border" style={{ backgroundColor: 'var(--hc-bg)', borderColor: 'var(--hc-accent)', color: 'var(--hc-accent)' }}>
                  <Users size={28} />
                </div>
              </div>
              <div className="p-8 rounded-[32px] shadow-sm border flex justify-between items-start transition-all"
                   style={{ backgroundColor: 'var(--hc-card)', borderColor: 'var(--hc-border)' }}>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-60" style={{ color: 'var(--hc-text)' }}>Citas Hoy</p>
                  <h2 className="text-4xl font-black mt-2" style={{ color: 'var(--hc-text)' }}>{stats.citasPendientes}</h2>
                </div>
                <div className="p-4 rounded-2xl border" style={{ backgroundColor: 'var(--hc-bg)', borderColor: 'var(--hc-accent)', color: 'var(--hc-accent)' }}>
                  <Calendar size={28} />
                </div>
              </div>
              <div className="p-8 rounded-[32px] shadow-sm border flex justify-between items-start transition-all"
                   style={{ backgroundColor: 'var(--hc-card)', borderColor: 'var(--hc-border)' }}>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-60" style={{ color: 'var(--hc-text)' }}>Doctores</p>
                  <h2 className="text-4xl font-black mt-2" style={{ color: 'var(--hc-text)' }}>{stats.doctores}</h2>
                </div>
                <div className="p-4 rounded-2xl border" style={{ backgroundColor: 'var(--hc-bg)', borderColor: 'var(--hc-accent)', color: 'var(--hc-accent)' }}>
                  <Stethoscope size={28} />
                </div>
              </div>
            </div>

            <div className="shadow-xl overflow-hidden border rounded-[32px] transition-all"
                 style={{ backgroundColor: 'var(--hc-card)', borderColor: 'var(--hc-border)' }}>
              <div className="p-8 border-b flex justify-between items-center" style={{ borderColor: 'var(--hc-border)' }}>
                <h3 className="font-black text-xl tracking-tight uppercase" style={{ color: 'var(--hc-text)' }}>
                  {isDoctor ? "Tus últimas 3 citas" : "Actividad Reciente"}
                </h3>
                <Activity size={24} style={{ color: 'var(--hc-accent)' }} />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="text-[10px] font-black uppercase tracking-widest border-b" style={{ backgroundColor: 'var(--hc-bg)', color: 'var(--hc-text)', borderColor: 'var(--hc-border)' }}>
                    <tr>
                      <th className="px-10 py-5">Paciente</th>
                      <th className="px-10 py-5">Motivo</th>
                      <th className="px-10 py-5 text-center">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y" style={{ borderColor: 'var(--hc-border)' }}>
                    {paginatedData.length > 0 ? (
                      paginatedData.map((app) => (
                        <tr key={app._id} className="transition-colors hover:opacity-80">
                          <td className="px-10 py-6 font-black" style={{ color: 'var(--hc-text)' }}>{app.patientName}</td>
                          <td className="px-10 py-6 font-medium opacity-80" style={{ color: 'var(--hc-text)' }}>{app.motivo}</td>
                          <td className="px-10 py-6 text-center">
                            <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase border"
                                  style={{ backgroundColor: 'var(--hc-bg)', borderColor: 'var(--hc-accent)', color: 'var(--hc-text)' }}>
                              {app.estado}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} className="p-20 text-center font-black opacity-20 uppercase tracking-widest" style={{ color: 'var(--hc-text)' }}>
                          No hay registros
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {isAdmin && totalPages > 1 && (
                <div className="p-6 border-t flex items-center justify-between" style={{ borderColor: 'var(--hc-border)', backgroundColor: 'var(--hc-bg)' }}>
                  <span className="text-[10px] font-black uppercase opacity-60" style={{ color: 'var(--hc-text)' }}>
                    Página {currentPage} de {totalPages}
                  </span>
                  <div className="flex gap-2">
                    <button 
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(prev => prev - 1)}
                      className="p-2 rounded-xl border disabled:opacity-20 transition-all"
                      style={{ borderColor: 'var(--hc-text)', color: 'var(--hc-text)' }}
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button 
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(prev => prev + 1)}
                      className="p-2 rounded-xl border disabled:opacity-20 transition-all"
                      style={{ borderColor: 'var(--hc-text)', color: 'var(--hc-text)' }}
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}