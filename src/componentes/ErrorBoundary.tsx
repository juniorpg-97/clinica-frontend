import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  tieneError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { tieneError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { tieneError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error(
      "Error Boundary capturado: ",
      error,
      errorInfo.componentStack,
    );
  }

  render() {
    if (this.state.tieneError) {
      return (
        this.props.fallback ?? (
          <div className="flex flex-col items-center justify-center p-8 text-center rounded-lg border border-rose-200 bg-rose-50">
            <p className="text-lg font-semibold text-rose-800">
              Algo salió mal
            </p>
            <p className="mt-2 text-sm text-rose-600">
              {this.state.error?.message}
            </p>
            <button
              type="button"
              onClick={() => this.setState({ tieneError: false, error: null })}
              className="mt-4 px-4 py-2 text-sm font-medium text-white bg-rose-600 rounded-lg hover:bg-rose-700 transition"
            >
              Intentar de nuevo
            </button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
