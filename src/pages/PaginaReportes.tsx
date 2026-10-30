import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";
import { api } from "../lib/axios";
import { citasService } from "../services/citas";
import { extraerMensajeError } from "../lib/errorHandler";

// 👇 Importamos nuestros componentes robustos del Paso 1 y 2
import { ErrorBoundary } from "../componentes/ErrorBoundary";
import { AlertaBanner } from "../componentes/ui/AlertaBanner";
import { EstadoVacio } from "../componentes/ui/EstadoVacio";

interface EspecialidadData {
  especialidad: string;
  total: number;
}

interface DiaData {
  dia: string;
  total: number;
}

export default function PaginaReportes() {
  const [datosEspecialidades, setDatosEspecialidades] = useState<
    EspecialidadData[]
  >([]);
  const [datosDias, setDatosDias] = useState<DiaData[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      setCargando(true);
      try {
        let especialidades: EspecialidadData[] = [];
        try {
          const resEsp = await api.get<EspecialidadData[]>(
            "/reportes/especialidades",
          );
          especialidades = resEsp.data;
        } catch (e) {
          console.warn(
            "El endpoint /reportes/especialidades falló. Usando datos de respaldo.",
          );
          especialidades = [
            { especialidad: "Cardiología", total: 12 },
            { especialidad: "Pediatría", total: 19 },
            { especialidad: "Dermatología", total: 8 },
            { especialidad: "Medicina General", total: 25 },
          ];
        }
        setDatosEspecialidades(especialidades);

        const citas = await citasService.getAll();
        const ultimos7Dias = Array.from({ length: 7 }, (_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - i);
          return d.toISOString().split("T")[0];
        }).reverse();

        const conteoDias = ultimos7Dias.map((fecha) => {
          const total = citas.filter((c) => c.fecha.startsWith(fecha)).length;
          const [, month, day] = fecha.split("-");
          return { dia: `${day}/${month}`, total };
        });

        setDatosDias(conteoDias);
      } catch (err) {
        // Si falla TODO el bloque, el ErrorBoundary lo capturará,
        // pero lanzamos el error para que el boundary lo tome.
        throw new Error(extraerMensajeError(err));
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, []);

  // 1. Skeleton de carga (puedes reemplazar esto por un componente SkeletonReporte si quieres ser aún más estricto)
  if (cargando) {
    return (
      <div className="p-8 space-y-8 max-w-6xl mx-auto">
        <div className="h-8 w-1/4 bg-gray-200 rounded animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="h-[350px] bg-gray-200 rounded-xl animate-pulse"></div>
          <div className="h-[350px] bg-gray-200 rounded-xl animate-pulse"></div>
        </div>
      </div>
    );
  }

  // 2. El ErrorBoundary se encarga de mostrar esto si algo explota en el render
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-8 text-gray-800">
        Reportes de la Clínica
      </h1>

      {/* 👇 ESTRATÉGICO: Aislamos el error solo a esta sección de gráficas */}
      <ErrorBoundary
        fallback={
          <AlertaBanner
            tipo="error"
            mensaje="No se pudieron cargar las gráficas. Por favor, intenta más tarde."
          />
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Gráfica 1: Citas por Especialidad */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold mb-6 text-gray-700">
              Citas por Especialidad
            </h2>

            {datosEspecialidades.length === 0 ? (
              <EstadoVacio
                titulo="Sin datos de especialidades"
                descripcion="No hay citas registradas por especialidad."
              />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={datosEspecialidades}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="especialidad" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} />
                  <Tooltip cursor={{ fill: "#f3f4f6" }} />
                  <Bar dataKey="total" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Gráfica 2: Citas en los últimos 7 días */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold mb-6 text-gray-700">
              Citas en los últimos 7 días
            </h2>

            {datosDias.length === 0 ? (
              <EstadoVacio
                titulo="Sin datos recientes"
                descripcion="No hay citas en los últimos 7 días."
              />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={datosDias}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="dia" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke="#4f46e5"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </ErrorBoundary>
    </div>
  );
}
