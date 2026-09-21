import * as React from "react"
import { cn } from "@/lib/utils"

export type DisclaimerProps = React.HTMLAttributes<HTMLDivElement>;

const Disclaimer = React.forwardRef<HTMLDivElement, DisclaimerProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        className={cn(
          "text-xs font-mono uppercase tracking-widest text-ink-faint border-t border-paper-line pt-2 mt-4 text-center",
          className
        )}
        ref={ref}
        {...props}
      >
        {children || "AI-generated summary. Not legal advice. Verify with source."}
      </div>
    )
  }
)
Disclaimer.displayName = "Disclaimer"

export { Disclaimer }
