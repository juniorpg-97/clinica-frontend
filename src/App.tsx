import { Route, Routes } from "react-router-dom";

import Layout from "./componentes/layout/Layout";
import RutaProtegida from "./componentes/RutaProtegida";
import PaginaLogin from "./pages/PaginaLogin";
import PaginaDashboard from "./pages/PaginaDashboard";
import PaginaPacientes from "./pages/PaginaPacientes";
import FormularioCita from "./pages/FormularioCita";
import PaginaDetallePaciente from "./pages/PaginaDetallePaciente";
import PaginaNotFound from "./pages/PaginaNotFound";
import PaginaReportes from "./pages/PaginaReportes";
import PaginaSinAcceso from "./pages/PaginaSinAcceso";
import PaginaPerfil from "./pages/PaginaPerfil";

export default function App() {
  return (
    <Routes>
      {/* 1) PÚBLICA: login SIN layout, SIN protección */}
      <Route path="/login" element={<PaginaLogin />} />

      {/* 2) PRIVADAS: RutaProtegida → Layout → páginas */}
      <Route element={<RutaProtegida />}>
        <Route element={<Layout />}>
          {/* Rutas generales: cualquier usuario autenticado */}
          <Route path="/" element={<PaginaDashboard />} />
          <Route path="/pacientes" element={<PaginaPacientes />} />
          <Route path="/pacientes/:id" element={<PaginaDetallePaciente />} />
          <Route path="/citas/nueva" element={<FormularioCita />} />

          {/* 👇 NUEVA RUTA DE PERFIL */}
          <Route path="/perfil" element={<PaginaPerfil />} />

          {/* Ruta para el mensaje de acceso denegado */}
          <Route path="/sin-acceso" element={<PaginaSinAcceso />} />

          {/* Rutas con Roles Específicos (Doble protección) */}
          <Route
            element={<RutaProtegida rolesPermitidos={["GERENCIA", "ADMIN"]} />}
          >
            <Route path="/reportes" element={<PaginaReportes />} />
          </Route>
        </Route>
      </Route>

      {/* 3) 404 global (sin sidebar) */}
      <Route path="*" element={<PaginaNotFound />} />
    </Routes>
  );
}
