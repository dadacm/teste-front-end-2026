import type { ButtonProps } from "./Button.types";

export function Button({
  children,
  className = "",
  disabled = false,
  isLoading = false,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      type={type}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg px-4 py-2 font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  );
}
