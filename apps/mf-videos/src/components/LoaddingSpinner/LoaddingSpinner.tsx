import { LoaderCircle } from "lucide-react";

type LoadingSpinnerProps = {
  size?: number;
  className?: string;
};

export function LoadingSpinner({ size = 18, className = "" }: LoadingSpinnerProps) {
  return <LoaderCircle size={size} className={`animate-spin ${className}`} aria-hidden="true" />;
}
