"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Sidebar } from "@/components/Sidebar";
import { useAuth } from "@/components/AuthProvider";
import { User, Phone, Fingerprint, Droplets, Save, Edit3, KeyRound, Eye, EyeOff } from "lucide-react";

export default function PerfilPage() {
  const { user } = useAuth();
  const patientData = useQuery(api.patients.getByUserId, { userId: user?._id });
  const updateProfile = useMutation(api.patients.updateProfile);
  const updatePassword = useMutation(api.users.updatePassword);

  const [isEditing, setIsEditing] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [form, setForm] = useState({ curp: "", telefono: "", tipoSangre: "" });

  useEffect(() => {
    if (patientData) {
      setForm({
        curp: patientData.curp,
        telefono: patientData.telefono,
        tipoSangre: patientData.tipoSangre,
      });
    }
  }, [patientData]);

  const handleSaveProfile = async () => {
    if (!patientData) return;
    try {
      await updateProfile({
        patientId: patientData._id,
        curp: form.curp,
        telefono: form.telefono,
        tipoSangre: form.tipoSangre,
      });
      setIsEditing(false);
      alert("Datos actualizados");
    } catch (e) {
      alert("Error al actualizar perfil");
    }
  };

  const handleUpdatePassword = async () => {
    if (!newPassword || !user) return;
    try {
      await updatePassword({ userId: user._id, newPassword });
      setNewPassword("");
      alert("Contraseña actualizada con éxito");
    } catch (e) {
      alert("Error al cambiar contraseña");
    }
  };

  return (
    <div className="flex h-screen transition-colors duration-300" style={{ backgroundColor: 'var(--hc-bg)' }}>
      <Sidebar />
      
      <main className="flex-1 p-8 overflow-y-auto fade-in">
        <header className="mb-10">
          <h1 className="text-3xl font-black" style={{ color: 'var(--hc-text)' }}>Mi Perfil</h1>
          <p className="font-bold text-xs uppercase tracking-widest mt-1" style={{ color: 'var(--hc-accent)' }}>Configuración de cuenta</p>
        </header>

        <div className="max-w-2xl space-y-8 pb-20">
          {/* BLOQUE DE INFORMACIÓN PERSONAL */}
          <div className="rounded-[40px] border shadow-sm overflow-hidden transition-all"
               style={{ backgroundColor: 'var(--hc-card)', borderColor: 'var(--hc-border)' }}>
            <div className="p-8 flex items-center gap-6 border-b" style={{ borderColor: 'var(--hc-border)' }}>
              <div className="w-20 h-20 rounded-3xl flex items-center justify-center text-3xl font-black border"
                   style={{ backgroundColor: 'var(--hc-bg)', color: 'var(--hc-accent)', borderColor: 'var(--hc-accent)' }}>
                {user?.name?.charAt(0)}
              </div>
              <div>
                <h2 className="text-xl font-black uppercase tracking-tighter" style={{ color: 'var(--hc-text)' }}>{user?.name}</h2>
                <p className="opacity-60 text-sm font-bold" style={{ color: 'var(--hc-text)' }}>{user?.email}</p>
              </div>
            </div>

            <div className="p-8 space-y-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-black uppercase tracking-widest opacity-40" style={{ color: 'var(--hc-text)' }}>Datos Médicos</span>
                <button 
                  onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                  className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all"
                  style={{ backgroundColor: isEditing ? 'var(--hc-accent)' : 'transparent', color: isEditing ? 'var(--hc-bg)' : 'var(--hc-text)', borderColor: 'var(--hc-text)' }}
                >
                  {isEditing ? "GUARDAR CAMBIOS" : "EDITAR PERFIL"}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase ml-1" style={{ color: 'var(--hc-text)' }}>CURP</label>
                  <input 
                    disabled={!isEditing}
                    className="w-full p-4 rounded-2xl border font-bold outline-none text-sm"
                    style={{ backgroundColor: 'var(--hc-bg)', borderColor: isEditing ? 'var(--hc-accent)' : 'var(--hc-border)', color: 'var(--hc-text)' }}
                    value={form.curp}
                    onChange={(e) => setForm({...form, curp: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase ml-1" style={{ color: 'var(--hc-text)' }}>Teléfono</label>
                  <input 
                    disabled={!isEditing}
                    className="w-full p-4 rounded-2xl border font-bold outline-none text-sm"
                    style={{ backgroundColor: 'var(--hc-bg)', borderColor: isEditing ? 'var(--hc-accent)' : 'var(--hc-border)', color: 'var(--hc-text)' }}
                    value={form.telefono}
                    onChange={(e) => setForm({...form, telefono: e.target.value})}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* BLOQUE DE SEGURIDAD (CAMBIO DE CONTRASEÑA) */}
          <div className="p-8 rounded-[40px] border shadow-sm transition-all"
               style={{ backgroundColor: 'var(--hc-card)', borderColor: 'var(--hc-border)' }}>
            <div className="flex items-center gap-3 mb-8" style={{ color: 'var(--hc-text)' }}>
              <KeyRound size={20} style={{ color: 'var(--hc-accent)' }} />
              <h2 className="text-lg font-black uppercase tracking-tighter">Seguridad de la cuenta</h2>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest ml-1 opacity-50" style={{ color: 'var(--hc-text)' }}>Nueva Contraseña</label>
                <div className="relative">
                  <input 
                    type={showPass ? "text" : "password"}
                    className="w-full p-4 rounded-2xl border font-bold outline-none text-sm pr-12"
                    style={{ backgroundColor: 'var(--hc-bg)', borderColor: 'var(--hc-border)', color: 'var(--hc-text)' }}
                    placeholder="Escribe tu nueva clave..."
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-4 top-4 opacity-40 hover:opacity-100 transition-opacity"
                    style={{ color: 'var(--hc-text)' }}
                  >
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button 
                onClick={handleUpdatePassword}
                disabled={!newPassword}
                className="w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] border transition-all disabled:opacity-30"
                style={{ backgroundColor: 'var(--hc-bg)', borderColor: 'var(--hc-accent)', color: 'var(--hc-accent)' }}
              >
                ACTUALIZAR CONTRASEÑA
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}