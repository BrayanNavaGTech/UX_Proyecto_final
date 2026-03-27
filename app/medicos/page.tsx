"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Sidebar } from "@/components/Sidebar";
import { useAuth } from "@/components/AuthProvider";
import { Stethoscope, Plus, Search, UserPlus, ShieldCheck, ArrowRight } from "lucide-react";

export default function MedicosPage() {
  const { user } = useAuth();
  const doctors = useQuery(api.doctors.getAll);
  const registerDoctor = useMutation(api.users.registerDoctor);

  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    especialidad: "",
    cedula: "",
    horario: "Matutino"
  });

  const isAdmin = user?.role === "admin";

  const handleCreateDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await registerDoctor({
        name: formData.name,
        email: formData.email,
        password: formData.name, // La contraseña es el mismo nombre de usuario
        especialidad: formData.especialidad,
        cedula: formData.cedula,
        horario: formData.horario
      });
      alert(`Médico ${formData.name} registrado con éxito.`);
      setShowForm(false);
      setFormData({ name: "", email: "", especialidad: "", cedula: "", horario: "Matutino" });
    } catch (error) {
      alert("Error al registrar médico");
    }
  };

  const filteredDoctors = doctors?.filter(d => 
    d.especialidad.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isAdmin) return <div className="p-10 font-black text-center">ACCESO DENEGADO</div>;

  return (
    <div className="flex h-screen overflow-hidden transition-colors duration-300" style={{ backgroundColor: 'var(--hc-bg)' }}>
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto p-8 fade-in">
        <header className="flex justify-between items-center mb-10 p-8 rounded-[32px] border transition-all"
                style={{ backgroundColor: 'var(--hc-card)', borderColor: 'var(--hc-border)' }}>
          <div>
            <h1 className="text-3xl font-black" style={{ color: 'var(--hc-text)' }}>Gestión Médica</h1>
            <p className="font-bold text-xs uppercase tracking-widest mt-1" style={{ color: 'var(--hc-accent)' }}>
              Alta y control de especialistas
            </p>
          </div>
          <button 
            onClick={() => setShowForm(!showForm)}
            className="px-6 py-3 rounded-2xl font-black text-sm border transition-all flex items-center gap-2"
            style={{ backgroundColor: 'var(--hc-accent)', color: 'var(--hc-bg)', borderColor: 'var(--hc-accent)' }}
          >
            {showForm ? "CANCELAR" : <><Plus size={18} /> AGREGAR MÉDICO</>}
          </button>
        </header>

        <div className="flex gap-8 items-start">
          <div className={`transition-all duration-500 ${showForm ? 'w-2/3' : 'w-full'}`}>
            <div className="rounded-[32px] border overflow-hidden shadow-xl" style={{ backgroundColor: 'var(--hc-card)', borderColor: 'var(--hc-border)' }}>
              <div className="p-6 border-b flex items-center gap-4" style={{ borderColor: 'var(--hc-border)', backgroundColor: 'var(--hc-bg)' }}>
                <Search size={20} style={{ color: 'var(--hc-text)' }} className="opacity-40" />
                <input 
                  type="text" 
                  placeholder="Buscar por especialidad..."
                  className="bg-transparent border-none outline-none w-full font-bold"
                  style={{ color: 'var(--hc-text)' }}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <table className="w-full text-left">
                <thead style={{ backgroundColor: 'var(--hc-bg)', color: 'var(--hc-text)' }}>
                  <tr className="text-[10px] font-black uppercase tracking-widest border-b" style={{ borderColor: 'var(--hc-border)' }}>
                    <th className="px-8 py-5">Especialista</th>
                    <th className="px-8 py-5">Cédula Profesional</th>
                    <th className="px-8 py-5">Horario</th>
                    <th className="px-8 py-5 text-center">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: 'var(--hc-border)' }}>
                  {filteredDoctors?.map((doc) => (
                    <tr key={doc._id} style={{ color: 'var(--hc-text)' }}>
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="font-black text-lg uppercase tracking-tighter">Esp. {doc.especialidad}</span>
                          <span className="text-[10px] opacity-60 font-bold">ID: {doc._id.slice(0, 8)}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 font-mono text-sm">{doc.cedula}</td>
                      <td className="px-8 py-6 font-bold text-xs uppercase">{doc.horario}</td>
                      <td className="px-8 py-6 text-center">
                        <span className="px-3 py-1 rounded-lg text-[10px] font-black border"
                              style={{ borderColor: 'var(--hc-accent)', color: 'var(--hc-accent)' }}>
                          ACTIVO
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {showForm && (
            <aside className="w-1/3 fade-in">
              <div className="p-8 rounded-[40px] border shadow-2xl" style={{ backgroundColor: 'var(--hc-card)', borderColor: 'var(--hc-border)' }}>
                <div className="flex items-center gap-2 mb-8" style={{ color: 'var(--hc-accent)' }}>
                  <UserPlus size={24} />
                  <h2 className="text-xl font-black uppercase tracking-tighter">Nuevo Médico</h2>
                </div>

                <form onSubmit={handleCreateDoctor} className="space-y-5">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest opacity-60 block mb-2" style={{ color: 'var(--hc-text)' }}>Nombre de Usuario (Login)</label>
                    <input 
                      required
                      className="w-full p-4 rounded-2xl border font-bold outline-none"
                      style={{ backgroundColor: 'var(--hc-bg)', borderColor: 'var(--hc-border)', color: 'var(--hc-text)' }}
                      placeholder="Ej: dr.garcia"
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest opacity-60 block mb-2" style={{ color: 'var(--hc-text)' }}>Correo Institucional</label>
                    <input 
                      required
                      type="email"
                      className="w-full p-4 rounded-2xl border font-bold outline-none"
                      style={{ backgroundColor: 'var(--hc-bg)', borderColor: 'var(--hc-border)', color: 'var(--hc-text)' }}
                      placeholder="garcia@medcontrol.com"
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest opacity-60 block mb-2" style={{ color: 'var(--hc-text)' }}>Especialidad</label>
                      <input 
                        required
                        className="w-full p-4 rounded-2xl border font-bold outline-none text-xs"
                        style={{ backgroundColor: 'var(--hc-bg)', borderColor: 'var(--hc-border)', color: 'var(--hc-text)' }}
                        placeholder="Cardiología"
                        onChange={(e) => setFormData({...formData, especialidad: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest opacity-60 block mb-2" style={{ color: 'var(--hc-text)' }}>Cédula</label>
                      <input 
                        required
                        className="w-full p-4 rounded-2xl border font-bold outline-none text-xs"
                        style={{ backgroundColor: 'var(--hc-bg)', borderColor: 'var(--hc-border)', color: 'var(--hc-text)' }}
                        placeholder="1234567"
                        onChange={(e) => setFormData({...formData, cedula: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl border" style={{ backgroundColor: 'var(--hc-bg)', borderColor: 'var(--hc-accent)' }}>
                    <p className="text-[10px] font-black uppercase tracking-tighter text-center" style={{ color: 'var(--hc-text)' }}>
                      Contraseña: igual al usuario
                    </p>
                  </div>

                  <button className="w-full py-4 rounded-2xl font-black shadow-xl transition-all border flex items-center justify-center gap-2"
                          style={{ backgroundColor: 'var(--hc-accent)', color: 'var(--hc-bg)', borderColor: 'var(--hc-accent)' }}>
                    REGISTRAR ESPECIALISTA <ArrowRight size={18} />
                  </button>
                </form>
              </div>
            </aside>
          )}
        </div>
      </main>
    </div>
  );
}