import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";

interface RutaProtegidaProps {
  rolesPermitidos?: string[];
}

export default function RutaProtegida({ rolesPermitidos }: RutaProtegidaProps) {
  const { isAuthenticated, usuario } = useAuthStore();

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  // Usamos usuario?.rol para evitar errores de TypeScript (sin usar 'any')
  if (rolesPermitidos && (!usuario || !rolesPermitidos.includes(usuario.rol))) {
    return <Navigate to="/sin-acceso" replace />;
  }

  return <Outlet />;
}
