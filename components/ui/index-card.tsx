import * as React from "react"
import { cn } from "@/lib/utils"

export interface IndexCardProps extends React.HTMLAttributes<HTMLDivElement> {}

const IndexCard = React.forwardRef<HTMLDivElement, IndexCardProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        className={cn(
          "bg-card rounded-[4px] shadow-[var(--shadow-sheet)] overflow-hidden text-ink",
          className
        )}
        ref={ref}
        {...props}
      >
        <div className="h-1 bg-risk-high/30 w-full" />
        <div className="p-4">{children}</div>
      </div>
    )
  }
)
IndexCard.displayName = "IndexCard"

export { IndexCard }
