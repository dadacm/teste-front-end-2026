import { LoadingSpinner } from "../LoaddingSpinner/LoaddingSpinner";

import type { ButtonProps } from "./Button.types";

export function Button({
  children,
  className = "",
  disabled = false,
  icon,
  iconPosition = "left",
  isLoading = false,
  loadingText,
  type = "button",
  variant = "default",
  ...props
}: ButtonProps) {
  const isIconOnly = variant === "icon-only";

  const buttonIcon = isLoading ? <LoadingSpinner /> : icon;

  const baseClasses =
    "inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50";

  const variantClasses = isIconOnly ? "size-10 p-0" : "min-h-10 px-4 py-2";

  return (
    <button
      {...props}
      type={type}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      className={`${baseClasses} ${variantClasses} ${className}`}
    >
      {isIconOnly ? (
        buttonIcon
      ) : (
        <>
          {iconPosition === "left" && buttonIcon}

          {isLoading ? (loadingText ?? children) : children}

          {iconPosition === "right" && buttonIcon}
        </>
      )}
    </button>
  );
}
