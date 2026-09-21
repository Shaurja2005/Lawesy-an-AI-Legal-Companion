import * as React from "react"
import { cn } from "@/lib/utils"

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  description?: string
  action?: React.ReactNode
}

const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ className, title, description, action, ...props }, ref) => {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center p-8 text-center space-y-4",
          className
        )}
        ref={ref}
        {...props}
      >
        <div className="text-ink-muted flex items-center justify-center">
          {/* Simple illustrative SVG line drawing placeholder */}
          <svg className="w-16 h-16 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <div className="space-y-1 max-w-sm">
          <h3 className="font-heading font-medium text-lg text-ink">{title}</h3>
          {description && <p className="text-sm text-ink-muted">{description}</p>}
        </div>
        {action && <div className="pt-2">{action}</div>}
      </div>
    )
  }
)
EmptyState.displayName = "EmptyState"

export { EmptyState }
