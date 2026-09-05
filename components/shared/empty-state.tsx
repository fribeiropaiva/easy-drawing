import type { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="rounded-md sheet px-6 py-12 text-center">
      <p className="font-display text-xl font-medium">{title}</p>
      <p className="mx-auto mt-2 max-w-prose text-sm text-muted-foreground">
        {description}
      </p>
      {action ? <div className="mt-6 flex justify-center">{action}</div> : null}
    </div>
  );
}
