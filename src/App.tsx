import { Route, Routes } from "react-router-dom";

import Layout from "./componentes/layout/Layout";
import ProtectedRoute from "./componentes/ProtectedRoute";
import PaginaLogin from "./pages/PaginaLogin";
import PaginaDashboard from "./pages/PaginaDashboard";
import PaginaPacientes from "./pages/PaginaPacientes";
import FormularioCita from "./pages/FormularioCita";
import PaginaDetallePaciente from "./pages/PaginaDetallePaciente";
import PaginaNotFound from "./pages/PaginaNotFound";
import PaginaReportes from "./pages/PaginaReportes";

export default function App() {
  return (
    <Routes>
      {/* 1) PÚBLICA: login SIN layout, SIN protección */}
      <Route path="/login" element={<PaginaLogin />} />

      {/* 2) PRIVADAS: ProtectedRoute → Layout → páginas */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<PaginaDashboard />} />
          <Route path="/pacientes" element={<PaginaPacientes />} />
          <Route path="/pacientes/:id" element={<PaginaDetallePaciente />} />
          <Route path="/citas/nueva" element={<FormularioCita />} />
          <Route path="/reportes" element={<PaginaReportes />} />
        </Route>
      </Route>

      {/* 3) 404 global (sin sidebar) */}
      <Route path="*" element={<PaginaNotFound />} />
    </Routes>
  );
}
