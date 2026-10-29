
import { Component, type ErrorInfo } from "react";

import type {
  MicroFrontendErrorBoundaryProps,
  MicroFrontendErrorBoundaryState,
} from "./MicroFrontendErrorBoundary.types";

export class MicroFrontendErrorBoundary extends Component<
  MicroFrontendErrorBoundaryProps,
  MicroFrontendErrorBoundaryState
> {
  state: MicroFrontendErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError(): MicroFrontendErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(
      `Erro no micro-frontend ${this.props.remoteName}`,
      error,
      errorInfo
    );
  }

  render() {
    if (this.state.hasError) {
      return (
        <section role="alert">
          <h2>
            Não foi possível carregar {this.props.remoteName}
          </h2>

          <p>
            Ocorreu um problema ao carregar esta funcionalidade.
          </p>

          <button
            type="button"
            onClick={() => window.location.reload()}
          >
            Recarregar página
          </button>
        </section>
      );
    }

    return this.props.children;
  }
}
