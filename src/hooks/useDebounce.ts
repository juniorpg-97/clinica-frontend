import { useState, useEffect } from "react";

export function useDebounce<T>(valor: T, delay: number = 350): T {
  const [debounced, setDebounced] = useState<T>(valor);

  useEffect(() => {
    const timeout = setTimeout(() => setDebounced(valor), delay);

    // Cleanup: si el valor cambia antes del delay, cancelamos el timeout anterior
    return () => clearTimeout(timeout);
  }, [valor, delay]);

  return debounced;
}
