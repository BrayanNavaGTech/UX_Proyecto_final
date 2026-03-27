"use client";
import { useState, createContext, useContext } from "react";
import { useMutation, useConvex } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Stethoscope, Lock, User, ArrowRight, Eye, EyeOff } from "lucide-react";

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<any>(null);
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ name: "", password: "" });
  
  const convex = useConvex();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user = await convex.query(api.users.login, { 
        name: form.name, 
        password: form.password 
      });
      
      if (user) {
        setSession(user);
      } else {
        alert("Usuario o contraseña incorrectos.");
      }
    } catch (err: any) {
      alert("Error de conexión con el servidor");
    }
  };

  if (!session) {
    return (
      <div className="h-screen w-full flex items-center justify-center transition-colors duration-300 p-6" 
           style={{ backgroundColor: 'var(--hc-bg)' }}>
        
        <div className="max-w-md w-full p-10 shadow-2xl border rounded-[40px] fade-in transition-all"
             style={{ backgroundColor: 'var(--hc-card)', borderColor: 'var(--hc-border)' }}>
          
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 border shadow-lg"
               style={{ backgroundColor: 'var(--hc-bg)', borderColor: 'var(--hc-accent)', color: 'var(--hc-accent)' }}>
            <Stethoscope size={32} />
          </div>
          
          <h2 className="text-3xl font-black text-center mb-2 tracking-tight uppercase" 
              style={{ color: 'var(--hc-text)' }}>
            MediControl
          </h2>
          <p className="text-center mb-10 text-[10px] font-black uppercase tracking-[0.3em] opacity-60" 
             style={{ color: 'var(--hc-text)' }}>
            Acceso Restringido
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <User className="absolute left-4 top-4 opacity-40" size={18} style={{ color: 'var(--hc-text)' }} />
              <input 
                className="w-full p-4 pl-12 border rounded-2xl outline-none font-bold transition-all"
                style={{ backgroundColor: 'var(--hc-bg)', borderColor: 'var(--hc-border)', color: 'var(--hc-text)' }}
                placeholder="Usuario"
                value={form.name}
                onChange={(e) => setForm({...form, name: e.target.value})}
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-4 opacity-40" size={18} style={{ color: 'var(--hc-text)' }} />
              <input 
                className="w-full p-4 pl-12 border rounded-2xl outline-none font-bold transition-all pr-12"
                style={{ backgroundColor: 'var(--hc-bg)', borderColor: 'var(--hc-border)', color: 'var(--hc-text)' }}
                placeholder="Contraseña"
                type={showPass ? "text" : "password"}
                value={form.password}
                onChange={(e) => setForm({...form, password: e.target.value})}
                required
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
            
            <button className="w-full py-4 rounded-2xl font-black shadow-xl transition-all border flex items-center justify-center gap-2 uppercase tracking-widest text-[10px]"
                    style={{ backgroundColor: 'var(--hc-accent)', color: 'var(--hc-bg)', borderColor: 'var(--hc-accent)' }}>
              Iniciar Sesión <ArrowRight size={16} />
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-[9px] font-bold uppercase tracking-widest opacity-40" 
               style={{ color: 'var(--hc-text)' }}>
              Consulte al Doctor/Administrador para obtener sus credenciales
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user: session, logout: () => setSession(null) }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);