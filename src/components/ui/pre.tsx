import * as React from "react"

import { cn } from "@/lib/utils"

const Pre = React.forwardRef<
  HTMLPreElement,
  React.HTMLAttributes<HTMLPreElement>
>(({ className, ...props }, ref) => (
  <pre
    ref={ref}
    className={cn(
      "mb-4 mt-6 overflow-x-auto rounded-lg border bg-zinc-950 py-4 dark:bg-zinc-900",
      className
    )}
    {...props}
  />
))
Pre.displayName = "Pre"

export { Pre }
