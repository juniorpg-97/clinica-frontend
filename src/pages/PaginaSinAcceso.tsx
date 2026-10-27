import { Link } from "react-router-dom";

export default function PaginaSinAcceso() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6">
        <span className="material-symbols-outlined text-4xl">block</span>
      </div>
      <h1 className="text-3xl font-bold text-slate-900 mb-2">
        Acceso Denegado
      </h1>
      <p className="text-slate-600 max-w-md mb-8">
        No tienes los permisos necesarios para ver esta sección.
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition-colors"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
