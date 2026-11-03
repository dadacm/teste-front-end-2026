import type { ComponentPropsWithRef } from "react";

interface InputProps extends ComponentPropsWithRef<"input"> {
  label: string;
  error?: string;
}

export function Input({ id, label, error, className = "", ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium text-text-primary">
        {label}
      </label>

      <input
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`w-full rounded-lg border border-border-ui bg-background px-4 py-3 text-text-primary transition-colors outline-none placeholder:text-text-muted focus:border-brand disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        {...props}
      />

      {error && (
        <p id={`${id}-error`} className="text-sm text-red-200">
          {error}
        </p>
      )}
    </div>
  );
}
