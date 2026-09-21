import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { AlertTriangle, CheckCircle, ShieldAlert, Info } from "lucide-react"

const stampVariants = cva(
  "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[3px] border-[1.5px] font-mono text-xs uppercase tracking-wider -rotate-2 transform transition-transform motion-reduce:transform-none bg-paper",
  {
    variants: {
      variant: {
        high: "border-risk-high text-risk-high",
        medium: "border-risk-medium text-risk-medium",
        low: "border-risk-low text-risk-low",
        info: "border-risk-info text-risk-info",
      },
    },
    defaultVariants: {
      variant: "info",
    },
  }
)

const icons = {
  high: ShieldAlert,
  medium: AlertTriangle,
  low: CheckCircle,
  info: Info,
}

export interface StampProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof stampVariants> {
  label: string
}

const Stamp = React.forwardRef<HTMLDivElement, StampProps>(
  ({ className, variant = "info", label, ...props }, ref) => {
    const Icon = icons[variant || "info"]
    
    return (
      <div
        className={cn(stampVariants({ variant, className }))}
        ref={ref}
        {...props}
      >
        <Icon className="w-3.5 h-3.5" aria-hidden="true" />
        <span className="font-semibold">{label}</span>
      </div>
    )
  }
)
Stamp.displayName = "Stamp"

export { Stamp, stampVariants }
