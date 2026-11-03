import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-emerald-600 text-white shadow hover:bg-emerald-700",
        secondary:
          "border-transparent bg-slate-100 text-slate-800 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100",
        destructive:
          "border-transparent bg-rose-500 text-white shadow hover:bg-rose-600",
        outline: "text-slate-800 border-slate-300 dark:text-slate-200 dark:border-slate-700",
        shopee: "border-transparent bg-[#EE4D2D] text-white",
        tiktok: "border-transparent bg-[#111111] text-white",
        lazada: "border-transparent bg-[#0f146d] text-white",
        whatsapp: "border-transparent bg-[#25D366] text-white",
        unread: "border-transparent bg-emerald-500 text-white text-[11px] font-bold px-1.5 py-0.2",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };

