import { HTMLAttributes } from "react";

type CardProps = HTMLAttributes<HTMLDivElement>;

export function Card({ className = "", children, ...props }: CardProps) {
  return (
    <div
      className={`rounded-sm border border-border bg-background px-6 py-6 transition-colors duration-200 ease-out ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
