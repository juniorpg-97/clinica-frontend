import { Link, Outlet, useNavigate } from "react-router-dom";
import MenuLateral from "./MenuLateral";
import { useAuthStore } from "../../stores/authStore";

export default function Layout() {
  const { usuario, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <MenuLateral />

      <div className="flex flex-1 flex-col min-w-0">
        {/* Header con datos de sesión */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold text-slate-900">MediCare</span>
          </div>

          <div className="flex items-center gap-4">
            {/* 👇 Nombre del usuario como link a /perfil */}
            <Link
              to="/perfil"
              className="text-right hidden sm:block group"
              title="Editar mi perfil"
            >
              <p className="text-sm font-bold text-slate-900 transition-colors group-hover:text-emerald-600">
                {usuario?.nombre}
              </p>
              <p className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full inline-block">
                {usuario?.role}
              </p>
            </Link>

            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
            >
              Cerrar sesión
            </button>
          </div>
        </header>

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
