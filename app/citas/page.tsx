"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Sidebar } from "@/components/Sidebar";
import { useAuth } from "@/components/AuthProvider";
import { Id } from "@/convex/_generated/dataModel";
import { Clock, Plus, CheckCircle2, X, Info } from "lucide-react";

export default function CitasPage() {
  const { user } = useAuth();
  const appointments = useQuery(api.appointments.getDetailed);
  const doctors = useQuery(api.doctors.getAll);
  const patients = useQuery(api.patients.get);
  const createAppointment = useMutation(api.appointments.create);

  const currentPatient = useQuery(api.patients.getByUserId, { userId: user?._id });
  const currentDoctor = useQuery(api.doctors.getByUserId, { userId: user?._id });

  const [showForm, setShowForm] = useState(false);
  const [selectedCita, setSelectedCita] = useState<any>(null);
  const [formData, setFormData] = useState({ targetId: "", fecha: "", motivo: "" });

  const isPatient = user?.role === "patient";
  const isDoctor = user?.role === "doctor";

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const pId = isPatient ? currentPatient?._id : (formData.targetId as Id<"patients">);
      const dId = isDoctor ? currentDoctor?._id : (formData.targetId as Id<"doctors">);

      if (!pId || !dId) return alert("Error de identificación");

      await createAppointment({
        patientId: pId as Id<"patients">,
        doctorId: dId as Id<"doctors">,
        fecha: new Date(formData.fecha).getTime(),
        motivo: formData.motivo,
      });
      
      alert("Cita agendada");
      setShowForm(false);
      setFormData({ targetId: "", fecha: "", motivo: "" });
    } catch (error) {
      alert("Error al agendar");
    }
  };

  return (
    <div className="flex h-screen overflow-hidden transition-colors duration-300" style={{ backgroundColor: 'var(--hc-bg)' }}>
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto p-8 fade-in">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black" style={{ color: 'var(--hc-text)' }}>Citas Médicas</h1>
            <p className="font-bold text-xs uppercase tracking-widest mt-1" style={{ color: 'var(--hc-accent)' }}>Historial y Agenda</p>
          </div>
          <button 
            onClick={() => setShowForm(!showForm)}
            className="px-6 py-3 rounded-2xl font-black text-sm border transition-all flex items-center gap-2"
            style={{ backgroundColor: 'var(--hc-accent)', color: 'var(--hc-bg)', borderColor: 'var(--hc-accent)' }}
          >
            {showForm ? "CANCELAR" : <><Plus size={18} /> NUEVA CITA</>}
          </button>
        </header>

        <div className="rounded-[32px] border overflow-hidden shadow-xl" style={{ backgroundColor: 'var(--hc-card)', borderColor: 'var(--hc-border)' }}>
          <table className="w-full text-left">
            <thead style={{ backgroundColor: 'var(--hc-bg)', color: 'var(--hc-text)' }}>
              <tr className="text-[10px] font-black uppercase tracking-widest border-b" style={{ borderColor: 'var(--hc-border)' }}>
                <th className="px-8 py-5">Fecha</th>
                <th className="px-8 py-5">Paciente</th>
                <th className="px-8 py-5">Médico</th>
                <th className="px-8 py-5 text-center">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'var(--hc-border)' }}>
              {appointments?.map((app) => (
                <tr key={app._id} style={{ color: 'var(--hc-text)' }} className="hover:opacity-70 cursor-pointer transition-all" onClick={() => setSelectedCita(app)}>
                  <td className="px-8 py-6 font-bold text-sm">
                    {new Date(app.fecha).toLocaleString()}
                  </td>
                  <td className="px-8 py-6 font-black">{app.patientName}</td>
                  <td className="px-8 py-6 font-black">{app.doctorName}</td>
                  <td className="px-8 py-6 text-center">
                    <button className="p-2 rounded-lg border" style={{ borderColor: 'var(--hc-accent)', color: 'var(--hc-accent)' }}>
                      <Info size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal de Descripción */}
        {selectedCita && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-md p-8 rounded-[40px] border shadow-2xl scale-in" 
                 style={{ backgroundColor: 'var(--hc-card)', borderColor: 'var(--hc-accent)' }}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-black uppercase tracking-tighter" style={{ color: 'var(--hc-text)' }}>Detalle de Cita</h2>
                <button onClick={() => setSelectedCita(null)} style={{ color: 'var(--hc-text)' }}><X /></button>
              </div>
              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase opacity-50" style={{ color: 'var(--hc-text)' }}>Motivo de consulta:</p>
                <div className="p-6 rounded-3xl border" style={{ backgroundColor: 'var(--hc-bg)', borderColor: 'var(--hc-border)' }}>
                  <p className="font-bold leading-relaxed" style={{ color: 'var(--hc-text)' }}>{selectedCita.motivo}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Formulario Lateral (si showForm es true) */}
        {showForm && (
          <div className="fixed right-0 top-0 h-full w-96 shadow-2xl p-8 border-l slide-in z-40" 
               style={{ backgroundColor: 'var(--hc-card)', borderColor: 'var(--hc-border)' }}>
            <h2 className="text-xl font-black mb-8" style={{ color: 'var(--hc-text)' }}>Agendar</h2>
            <form onSubmit={handleCreate} className="space-y-6">
              <select 
                required
                className="w-full p-4 rounded-2xl border font-bold"
                style={{ backgroundColor: 'var(--hc-bg)', borderColor: 'var(--hc-border)', color: 'var(--hc-text)' }}
                onChange={(e) => setFormData({...formData, targetId: e.target.value})}
              >
                <option value="">Seleccionar...</option>
                {isPatient ? 
                  doctors?.map(d => <option key={d._id} value={d._id}>{d.especialidad}</option>) :
                  patients?.map(p => <option key={p._id} value={p._id}>{p.nombre}</option>)
                }
              </select>
              <input 
                type="datetime-local"
                required
                className="w-full p-4 rounded-2xl border font-bold"
                style={{ backgroundColor: 'var(--hc-bg)', borderColor: 'var(--hc-border)', color: 'var(--hc-text)' }}
                onChange={(e) => setFormData({...formData, fecha: e.target.value})}
              />
              <textarea 
                required
                className="w-full p-4 rounded-2xl border font-bold resize-none"
                style={{ backgroundColor: 'var(--hc-bg)', borderColor: 'var(--hc-border)', color: 'var(--hc-text)' }}
                placeholder="Motivo..."
                onChange={(e) => setFormData({...formData, motivo: e.target.value})}
              />
              <button className="w-full py-4 rounded-2xl font-black border"
                      style={{ backgroundColor: 'var(--hc-accent)', color: 'var(--hc-bg)', borderColor: 'var(--hc-accent)' }}>
                CONFIRMAR
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}