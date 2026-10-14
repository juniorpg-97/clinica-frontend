interface BuscadorPacientesProps {
  value: string;
  onChange: (value: string) => void;
}

export default function BuscadorPacientes({
  value,
  onChange,
}: BuscadorPacientesProps) {
  return (
    <div className="w-full">
      <label
        htmlFor="buscar-paciente"
        className="mb-2 block text-sm font-medium text-slate-700"
      >
        Buscar paciente
      </label>

      <div className="relative">
        <svg
          className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          aria-hidden="true"
        >
          <circle cx={11} cy={11} r={7} />
          <path d="m20 20-4-4" />
        </svg>

        <input
          id="buscar-paciente"
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Buscar por nombre o correo..."
          className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
        />
      </div>
    </div>
  );
}
