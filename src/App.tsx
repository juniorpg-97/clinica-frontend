import { Route, Routes } from "react-router-dom";

import Layout from "./componentes/layout/Layout";
import PaginaDashboard from "./pages/PaginaDashboard";
import PaginaPacientes from "./pages/PaginaPacientes";
import FormularioCita from "./pages/FormularioCita";
import PaginaDetallePaciente from "./pages/PaginaDetallePaciente";
import PaginaNotFound from "./pages/PaginaNotFound";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<PaginaDashboard />} />

        <Route path="/pacientes" element={<PaginaPacientes />} />

        <Route path="/pacientes/:id" element={<PaginaDetallePaciente />} />

        <Route path="/citas/nueva" element={<FormularioCita />} />

        <Route path="*" element={<PaginaNotFound />} />
      </Route>
    </Routes>
  );
}
