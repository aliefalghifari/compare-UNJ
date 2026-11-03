import * as React from "react";
import { cn } from "@/lib/utils";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: string;
  isOnline?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
}

export function Avatar({
  src,
  alt = "User Avatar",
  fallback = "U",
  isOnline,
  size = "md",
  className,
  ...props
}: AvatarProps) {
  const [imageError, setImageError] = React.useState(false);

  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
    xl: "w-16 h-16 text-lg",
  };

  const indicatorSize = {
    sm: "w-2.5 h-2.5 bottom-0 right-0 border-2",
    md: "w-3 h-3 bottom-0 right-0 border-2",
    lg: "w-3.5 h-3.5 bottom-0.5 right-0.5 border-2",
    xl: "w-4 h-4 bottom-1 right-1 border-2",
  };

  return (
    <div
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center rounded-full bg-slate-200 select-none overflow-visible",
        sizeClasses[size],
        className
      )}
      {...props}
    >
      <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center bg-emerald-100 text-emerald-800 font-semibold">
        {src && !imageError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={alt}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <span>{fallback}</span>
        )}
      </div>

      {isOnline !== undefined && (
        <span
          className={cn(
            "absolute rounded-full border-white dark:border-slate-900 transition-colors",
            indicatorSize[size],
            isOnline ? "bg-emerald-500 ring-1 ring-emerald-400/50" : "bg-slate-400"
          )}
          title={isOnline ? "Online" : "Offline"}
        />
      )}
    </div>
  );
}

