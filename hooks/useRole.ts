import { useAuth } from "../components/AuthProvider";

export function useRole() {
  const { user } = useAuth();
  
  return {
    isDoctor: user?.role === "doctor",
    isPatient: user?.role === "patient",
    isAdmin: user?.role === "admin",
    user
  };
}