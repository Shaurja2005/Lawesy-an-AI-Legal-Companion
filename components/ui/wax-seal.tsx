import * as React from "react"
import { cn } from "@/lib/utils"
import { ShieldAlert, AlertTriangle, CheckCircle, Info } from "lucide-react"

const icons = {
  high: ShieldAlert,
  medium: AlertTriangle,
  low: CheckCircle,
  info: Info,
}

const colorVariants = {
  high: "bg-risk-high text-paper",
  medium: "bg-risk-medium text-paper",
  low: "bg-risk-low text-paper",
  info: "bg-risk-info text-paper",
}

export interface WaxSealProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "high" | "medium" | "low" | "info"
  verdict: string
}

const WaxSeal = React.forwardRef<HTMLDivElement, WaxSealProps>(
  ({ className, variant = "info", verdict, ...props }, ref) => {
    const Icon = icons[variant]
    return (
      <div
        className={cn("inline-flex items-center gap-3", className)}
        ref={ref}
        {...props}
      >
        <div
          className={cn(
            "relative flex items-center justify-center w-12 h-12 rounded-full shadow-md before:content-[''] before:absolute before:inset-[2px] before:rounded-full before:border-[2px] before:border-white/20",
            colorVariants[variant]
          )}
        >
          <Icon className="w-5 h-5 relative z-10" />
        </div>
        <span className="font-ui font-semibold text-ink uppercase tracking-wide text-sm">{verdict}</span>
      </div>
    )
  }
)
WaxSeal.displayName = "WaxSeal"

export { WaxSeal }
