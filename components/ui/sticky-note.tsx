import * as React from "react"
import { cn } from "@/lib/utils"

export interface StickyNoteProps extends React.HTMLAttributes<HTMLDivElement> {}

const StickyNote = React.forwardRef<HTMLDivElement, StickyNoteProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        className={cn(
          "relative bg-sticky rounded-sm p-4 text-ink-muted shadow-sm shadow-black/10 transform rotate-1 transition-transform hover:rotate-0 text-sm font-ui",
          className
        )}
        ref={ref}
        {...props}
      >
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-4 bg-white/20 shadow-[0_1px_1px_rgba(0,0,0,0.05)] -rotate-1" />
        {children}
      </div>
    )
  }
)
StickyNote.displayName = "StickyNote"

export { StickyNote }
