import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";

interface RutaProtegidaProps {
  rolesPermitidos?: string[];
}

export default function RutaProtegida({ rolesPermitidos }: RutaProtegidaProps) {
  const { isAuthenticated, usuario } = useAuthStore();

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (rolesPermitidos && usuario) {
    const rolUsuario = usuario.role.toUpperCase();
    const rolesPermitidosMayus = rolesPermitidos.map((r) => r.toUpperCase());

    if (!rolesPermitidosMayus.includes(rolUsuario)) {
      return <Navigate to="/sin-acceso" replace />;
    }
  } else if (rolesPermitidos && !usuario) {
    return <Navigate to="/sin-acceso" replace />;
  }

  return <Outlet />;
}
