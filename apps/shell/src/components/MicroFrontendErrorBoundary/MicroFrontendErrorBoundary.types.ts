import type { ReactNode } from "react";

export interface MicroFrontendErrorBoundaryProps {
  children: ReactNode;
  remoteName: string;
}

export interface MicroFrontendErrorBoundaryState {
  hasError: boolean;
}
