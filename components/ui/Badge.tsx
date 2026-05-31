import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

type BadgeVariant = "green" | "blue" | "yellow" | "red" | "gray" | "purple";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export function Badge({ className, variant = "gray", children, ...props }: BadgeProps) {
  return (
    <span
      className={cn("badge", `badge-${variant}`, className)}
      {...props}
    >
      {children}
    </span>
  );
}

interface ProgressBarProps {
  value: number;
  max?: number;
  variant?: "green" | "blue" | "yellow" | "red";
  size?: "sm" | "md" | "lg";
  className?: string;
  showLabel?: boolean;
}

export function ProgressBar({
  value,
  max = 100,
  variant = "green",
  size = "md",
  className,
  showLabel = false,
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  const height = { sm: "4px", md: "8px", lg: "12px" }[size];

  return (
    <div className={cn("w-full", className)}>
      {showLabel && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 6,
            fontSize: "0.75rem",
            color: "var(--text-muted)",
          }}
        >
          <span>{Math.round(percentage)}%</span>
          <span>
            {value}/{max}
          </span>
        </div>
      )}
      <div className="progress-bar" style={{ height }}>
        <div
          className={cn("progress-fill", variant !== "green" && `progress-fill.${variant}`)}
          style={{
            width: `${percentage}%`,
            background:
              variant === "blue"
                ? "linear-gradient(90deg, var(--info), var(--info-light))"
                : variant === "yellow"
                ? "linear-gradient(90deg, var(--accent-dark), var(--accent))"
                : variant === "red"
                ? "linear-gradient(90deg, var(--danger-dark), var(--danger))"
                : undefined,
          }}
        />
      </div>
    </div>
  );
}

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  height?: string | number;
  width?: string | number;
  rounded?: boolean;
}

export function Skeleton({ className, height, width, rounded = false, style, ...props }: SkeletonProps) {
  return (
    <div
      className={cn("skeleton", rounded && "rounded-full", className)}
      style={{ height, width, ...style }}
      {...props}
    />
  );
}

export function Spinner({ size = 20 }: { size?: number }) {
  return (
    <svg
      className="animate-spin"
      style={{ width: size, height: size, color: "var(--primary)" }}
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
        opacity={0.25}
      />
      <path
        d="M12 2a10 10 0 0 1 10 10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
