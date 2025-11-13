'use client'

import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "muted" | "secondary" | "destructive" | "outline"
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        {
          "border-transparent bg-brand-teal text-white": variant === "default",
          "border-transparent bg-slate-100 text-slate-700": variant === "muted",
          "border-transparent bg-brand-blue text-white": variant === "secondary",
          "border-transparent bg-red-500 text-white": variant === "destructive",
          "text-foreground border-slate-200": variant === "outline",
        },
        className
      )}
      {...props}
    />
  )
}

export { Badge }

