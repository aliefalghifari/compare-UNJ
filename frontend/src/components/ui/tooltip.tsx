"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export function TooltipProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function Tooltip({ children }: { children: React.ReactNode }) {
  return <div className="group relative inline-flex">{children}</div>;
}

export function TooltipTrigger({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { asChild?: boolean }) {
  return (
    <div className={cn("inline-flex", className)} {...props}>
      {children}
    </div>
  );
}

export function TooltipContent({
  children,
  side = "top",
  className,
}: {
  children: React.ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  className?: string;
}) {
  const positionClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-1.5",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-1.5",
    left: "right-full top-1/2 -translate-y-1/2 mr-1.5",
    right: "left-full top-1/2 -translate-y-1/2 ml-1.5",
  };

  return (
    <div
      className={cn(
        "pointer-events-none absolute z-50 whitespace-nowrap rounded-md bg-slate-900 px-2.5 py-1 text-[11px] font-medium text-white opacity-0 shadow-md transition-opacity duration-150 group-hover:opacity-100 dark:bg-slate-100 dark:text-slate-900",
        positionClasses[side],
        className
      )}
    >
      {children}
    </div>
  );
}

