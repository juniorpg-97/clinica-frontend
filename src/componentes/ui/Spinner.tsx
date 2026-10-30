interface SpinnerProps {
  fullscreen?: boolean;
  size?: "sm" | "md" | "lg";
}

export function Spinner({ fullscreen = false, size = "md" }: SpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-3",
    lg: "h-12 w-12 border-4",
  };

  const spinner = (
    <div
      className={`animate-spin rounded-full border-t-transparent border-blue-600 ${sizeClasses[size]}`}
      role="status"
      aria-label="Cargando"
    />
    // Nota: Si usas Tailwind v4, 'border-3' puede no existir, usa 'border-4' para todos o ajusta a 'border-2'/'border-4'
  );

  if (fullscreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
        {spinner}
        is loading...
      </div>
    );
  }

  return (
    <div className="inline-flex items-center justify-center">{spinner}</div>
  );
}
