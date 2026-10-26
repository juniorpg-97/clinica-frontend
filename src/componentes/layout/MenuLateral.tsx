import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, CalendarPlus, LogOut } from "lucide-react";
import toast from "react-hot-toast";
import { useAuthStore } from "../../stores/authStore";

const opcionesMenu = [
  {
    nombre: "Dashboard",
    ruta: "/",
    icono: LayoutDashboard,
    end: true,
  },
  {
    nombre: "Pacientes",
    ruta: "/pacientes",
    icono: Users,
    end: false,
  },
  {
    nombre: "Nueva cita",
    ruta: "/citas/nueva",
    icono: CalendarPlus,
    end: false,
  },
];

export default function MenuLateral() {
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);
  const usuario = useAuthStore((s) => s.usuario);

  const handleLogout = () => {
    logout();
    toast.success("Sesión cerrada");
    navigate("/login", { replace: true });
  };

  return (
    <aside className="flex min-h-screen w-64 shrink-0 flex-col border-r border-slate-200 bg-white">
      <div className="border-b border-slate-200 p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-600 text-xl font-bold text-white">
            C
          </div>

          <div>
            <h2 className="font-bold text-slate-900">Clínica Salud</h2>
            <p className="text-sm text-slate-500">Integral</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-2 p-4">
        <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Menú principal
        </p>

        {opcionesMenu.map((opcion) => {
          const Icono = opcion.icono;

          return (
            <NavLink
              key={opcion.ruta}
              to={opcion.ruta}
              end={opcion.end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-teal-50 text-teal-700"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`
              }
            >
              <Icono size={20} />
              <span>{opcion.nombre}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="border-t border-slate-200 p-5">
        <p className="text-sm font-semibold text-slate-800">
          {usuario?.nombre ?? "Administrador"}
        </p>
        <p className="mt-1 text-xs text-slate-500">
          {usuario?.rol ?? "Panel de gestión"}
        </p>

        <button
          onClick={handleLogout}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-100"
        >
          <LogOut size={16} />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
