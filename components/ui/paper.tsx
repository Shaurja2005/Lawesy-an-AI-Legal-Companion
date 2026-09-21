import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const paperVariants = cva(
  "bg-paper text-ink rounded-[2px] transition-all relative",
  {
    variants: {
      variant: {
        flat: "shadow-[var(--shadow-sheet)]",
        stacked: "shadow-[var(--shadow-sheet)] before:content-[''] before:absolute before:inset-0 before:bg-paper-alt before:rounded-[2px] before:shadow-[var(--shadow-sheet)] before:-bottom-[3px] before:top-[3px] before:-left-[3px] before:right-[3px] before:-z-10 after:content-[''] after:absolute after:inset-0 after:bg-paper after:rounded-[2px] after:shadow-[var(--shadow-sheet)] after:-bottom-[6px] after:top-[6px] after:-left-[6px] after:right-[6px] after:-z-20",
        pinned: "shadow-[var(--shadow-sheet)]",
        lined: "shadow-[var(--shadow-sheet)] bg-[linear-gradient(transparent,transparent_calc(1.6em-1px),var(--color-paper-line)_calc(1.6em-1px),var(--color-paper-line)_1.6em)] bg-[length:100%_1.6em] relative before:content-[''] before:absolute before:top-0 before:bottom-0 before:left-8 before:w-[1px] before:bg-risk-high/10 before:z-0",
      },
      padding: {
        none: "",
        sm: "p-4",
        md: "p-6",
        lg: "p-8",
      }
    },
    defaultVariants: {
      variant: "flat",
      padding: "md",
    },
  }
)

export interface PaperProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof paperVariants> {}

const Paper = React.forwardRef<HTMLDivElement, PaperProps>(
  ({ className, variant, padding, children, ...props }, ref) => {
    return (
      <div
        className={cn(paperVariants({ variant, padding, className }))}
        ref={ref}
        {...props}
      >
        {variant === "pinned" && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-brass shadow-sm shadow-black/20 z-10" aria-hidden="true" />
        )}
        <div className={cn("relative z-10", variant === "lined" && "pl-12")}>
          {children}
        </div>
      </div>
    )
  }
)
Paper.displayName = "Paper"

export { Paper, paperVariants }
