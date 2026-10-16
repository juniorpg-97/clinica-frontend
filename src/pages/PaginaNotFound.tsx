import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, House } from "lucide-react";

export default function PaginaNotFound() {
  const navigate = useNavigate();

  return (
    <section className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <span className="text-7xl" role="img" aria-label="Página no encontrada">
        🔎
      </span>

      <p className="mt-6 text-sm font-bold uppercase tracking-widest text-teal-600">
        Error 404
      </p>

      <h1 className="mt-2 text-3xl font-bold text-slate-900">
        Página no encontrada
      </h1>

      <p className="mt-3 max-w-md text-slate-500">
        Lo sentimos, la página que buscas no existe o la dirección es
        incorrecta.
      </p>

      <Link
        to="/"
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-3 font-semibold text-white transition hover:bg-teal-700"
      >
        <House size={18} />
        Volver al inicio
      </Link>

      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mt-4 inline-flex items-center gap-2 text-sm text-slate-500 hover:text-teal-700"
      >
        <ArrowLeft size={16} />
        Volver a la página anterior
      </button>
    </section>
  );
}
