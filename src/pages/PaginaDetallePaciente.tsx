import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  Mail,
  Phone,
  Stethoscope,
  UserRound,
} from "lucide-react";

import { pacientesIniciales } from "../data/pacientes";
import Encabezado from "../componentes/layout/Encabezado";
import BadgeEstado from "../componentes/pacientes/BadgeEstado";

export default function PaginaDetallePaciente() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const paciente = pacientesIniciales.find((item) => item.id === id);

  if (!paciente) {
    return (
      <section className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <h1 className="text-3xl font-bold text-slate-900">
          Paciente no encontrado
        </h1>

        <p className="mt-3 text-slate-500">
          No encontramos un paciente con el identificador solicitado.
        </p>

        <button
          type="button"
          onClick={() => navigate("/pacientes")}
          className="mt-6 rounded-xl bg-teal-600 px-5 py-3 font-semibold text-white hover:bg-teal-700"
        >
          Volver a pacientes
        </button>
      </section>
    );
  }

  return (
    <div className="min-h-screen">
      <Encabezado
        titulo="Detalle del paciente"
        descripcion="Consulta la información personal y médica del paciente."
      />

      <div className="p-6 sm:p-8">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-teal-700 hover:text-teal-900"
        >
          <ArrowLeft size={18} />
          Volver
        </button>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="bg-gradient-to-r from-teal-700 to-cyan-600 p-6 text-white sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20">
                <UserRound size={34} />
              </div>

              <div className="flex-1">
                <p className="text-sm text-teal-50">Ficha del paciente</p>

                <h2 className="mt-1 text-2xl font-bold">
                  {paciente.nombre} {paciente.apellido}
                </h2>

                <p className="mt-1 text-sm text-teal-50">
                  Código: {paciente.id}
                </p>
              </div>

              <div className="self-start rounded-xl bg-white px-3 py-2 sm:self-center">
                <BadgeEstado estado={paciente.estado ?? "activo"} />
              </div>
            </div>
          </div>

          <div className="grid gap-6 p-6 sm:grid-cols-2 sm:p-8">
            <div className="flex items-start gap-4 rounded-xl bg-slate-50 p-5">
              <div className="rounded-lg bg-blue-100 p-3 text-blue-700">
                <Mail size={22} />
              </div>

              <div className="min-w-0">
                <p className="text-sm text-slate-500">Correo electrónico</p>

                <p className="mt-1 break-words font-semibold text-slate-900">
                  {paciente.email}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-xl bg-slate-50 p-5">
              <div className="rounded-lg bg-green-100 p-3 text-green-700">
                <Phone size={22} />
              </div>

              <div>
                <p className="text-sm text-slate-500">Teléfono</p>

                <p className="mt-1 font-semibold text-slate-900">
                  {paciente.telefono}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-xl bg-slate-50 p-5">
              <div className="rounded-lg bg-purple-100 p-3 text-purple-700">
                <Stethoscope size={22} />
              </div>

              <div>
                <p className="text-sm text-slate-500">Especialidad asignada</p>

                <p className="mt-1 font-semibold text-slate-900">
                  {paciente.especialidadAsignada}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-xl bg-slate-50 p-5">
              <div className="rounded-lg bg-orange-100 p-3 text-orange-700">
                <CalendarDays size={22} />
              </div>

              <div>
                <p className="text-sm text-slate-500">Última cita</p>

                <p className="mt-1 font-semibold text-slate-900">
                  {paciente.ultimaCita}
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 px-6 py-5 sm:px-8">
            <button
              type="button"
              onClick={() => navigate("/pacientes")}
              className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Ver todos los pacientes
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
