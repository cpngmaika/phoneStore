type LoadingProps = {
  label?: string;
};

export function Loading({ label = "Loading..." }: LoadingProps) {
  return (
    <div
      className="flex items-center gap-3 text-sm font-medium text-text-muted"
      role="status"
    >
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-border border-t-primary" />
      {label}
    </div>
  );
}
