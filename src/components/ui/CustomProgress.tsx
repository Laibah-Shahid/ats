// components/ui/custom-progress.tsx

import * as React from "react"
import { cn } from "@/lib/utils"

interface CustomProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number
  indicatorClassName?: string
}

const CustomProgress = React.forwardRef<HTMLDivElement, CustomProgressProps>(
  ({ className, value, indicatorClassName, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("relative h-2 w-full overflow-hidden rounded-full bg-secondary", className)}
      {...props}
    >
      <div
        className={cn("h-full bg-primary transition-all", indicatorClassName)}
        style={{ width: `${value || 0}%` }}
      />
    </div>
  )
)
CustomProgress.displayName = "CustomProgress"

export { CustomProgress }
