/*
 * Problemas encontrados en el código generado por la IA:
 *
 * 1. Mezclaba la estructura de toda la página en un solo componente,
 *    dificultando la reutilización y el mantenimiento.
 *
 * 2. Los datos de ejemplo estaban directamente en el JSX,
 *    en lugar de estar definidos en una constante independiente.
 *
 * 3. No separaba las responsabilidades en componentes reutilizables,
 *    como BadgeEstado, PacienteRow y BuscadorPacientes.
 */

import { useState } from "react";
import { pacientesIniciales } from "../data/pacientes";
import type { Paciente } from "../types/paciente";
import PacienteRow from "../componentes/pacientes/PacienteRow";
import BadgeEstado from "../componentes/pacientes/BadgeEstado";
import BuscadorPacientes from "../componentes/pacientes/BuscadorPacientes";

export default function PaginaPacientes() {
  const [pacientes] = useState<Paciente[]>(pacientesIniciales);
  const [busqueda, setBusqueda] = useState("");

  const pacientesFiltrados = pacientes.filter((paciente) => {
    const texto = busqueda.toLowerCase().trim();

    return (
      `${paciente.nombre} ${paciente.apellido}`.toLowerCase().includes(texto) ||
      paciente.email.toLowerCase().includes(texto) ||
      paciente.telefono.includes(texto) ||
      paciente.especialidadAsignada.toLowerCase().includes(texto)
    );
  });

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-blue-600">
            Clínica Salud Integral
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Pacientes
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Administra y consulta la información de tus pacientes.
          </p>
        </header>

        <section className="mb-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Lista de pacientes
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                {pacientesFiltrados.length}{" "}
                {pacientesFiltrados.length === 1
                  ? "paciente encontrado"
                  : "pacientes encontrados"}
              </p>
            </div>

            <div className="w-full sm:max-w-md">
              <BuscadorPacientes value={busqueda} onChange={setBusqueda} />
            </div>
          </div>

          {/* Tabla visible en pantallas medianas y grandes */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full text-left">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Paciente
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Teléfono
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Especialidad
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Última cita
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Estado
                  </th>
                </tr>
              </thead>

              <tbody>
                {pacientesFiltrados.map((paciente) => (
                  <PacienteRow key={paciente.id} paciente={paciente} />
                ))}
              </tbody>
            </table>
          </div>

          {/* Tarjetas visibles en móviles */}
          <div className="flex flex-col gap-4 md:hidden">
            {pacientesFiltrados.map((paciente) => (
              <article
                key={paciente.id}
                className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
              >
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-gray-900">
                      {paciente.nombre} {paciente.apellido}
                    </h3>
                    <p className="break-words text-sm text-gray-500">
                      {paciente.email}
                    </p>
                  </div>

                  <BadgeEstado estado={paciente.estado} />
                </div>

                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between gap-3">
                    <dt className="text-gray-500">Teléfono</dt>
                    <dd className="text-right text-gray-800">
                      {paciente.telefono}
                    </dd>
                  </div>

                  <div className="flex justify-between gap-3">
                    <dt className="text-gray-500">Especialidad</dt>
                    <dd className="text-right text-gray-800">
                      {paciente.especialidadAsignada}
                    </dd>
                  </div>

                  <div className="flex justify-between gap-3">
                    <dt className="text-gray-500">Última cita</dt>
                    <dd className="text-right text-gray-800">
                      {paciente.ultimaCita}
                    </dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>

          {pacientesFiltrados.length === 0 && (
            <p className="py-10 text-center text-sm text-gray-500">
              No se encontraron pacientes con esa búsqueda.
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
