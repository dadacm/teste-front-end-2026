import type { EmptyStateProps } from "./EmptyState.types";

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <section className="flex min-h-72 flex-col items-center justify-center gap-4 rounded-2xl border border-border-ui bg-surface px-6 py-12 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-background text-brand">
        {icon}
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-text-primary">{title}</h2>

        <p className="max-w-sm text-sm text-text-secondary">{description}</p>
      </div>

      {action}
    </section>
  );
}
