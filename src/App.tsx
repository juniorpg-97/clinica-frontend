import { useState } from "react";
import MenuLateral from "./componentes/layout/MenuLateral";
import PaginaDashboard from "./pages/PaginaDashboard";
import PaginaPacientes from "./pages/PaginaPacientes";

type Pagina = "dashboard" | "pacientes";

function App() {
  const [paginaActual, setPaginaActual] = useState<Pagina>("dashboard");

  return (
    <div className="min-h-screen bg-slate-50 md:flex">
      <div className="hidden md:block md:min-h-screen">
        <MenuLateral
          paginaActual={paginaActual}
          onCambiarPagina={setPaginaActual}
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="md:hidden">
          <MenuLateral
            paginaActual={paginaActual}
            onCambiarPagina={setPaginaActual}
          />
        </div>

        {paginaActual === "dashboard" ? (
          <PaginaDashboard />
        ) : (
          <PaginaPacientes />
        )}
      </div>
    </div>
  );
}

export default App;
