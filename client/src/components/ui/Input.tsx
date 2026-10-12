import type { InputHTMLAttributes } from "react";

export function Input({
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`h-12 w-full rounded-lg border border-border bg-surface px-4 outline-none transition focus:border-primary ${className}`}
      {...props}
    />
  );
}
