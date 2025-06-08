import * as React from "react"
import {
  Toaster as Sonner,
} from "sonner"

import { cn } from "../../lib/utils"

const Toaster = React.forwardRef(
  ({ className, ...props }, ref) => {
    return (
      <Sonner
        ref={ref}
        className={cn("group w-full max-w-md", className)}
        {...props}
        toastOptions={{
          classNames: {
            toast:
              "group pointer-events-auto flex w-full items-center space-x-4 overflow-hidden rounded-md border p-4 shadow-sm transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-80 data-[state=open]:slide-in-from-bottom-10 data-[state=closed]:slide-out-to-bottom-10 dark:border-muted/50",
            description: "text-sm text-muted-foreground",
            action:
              "inline-flex h-8 shrink-0 items-center rounded-md border border-input bg-background px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary hover:text-secondary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-destructive/50 group-[.destructive]:hover:border-destructive group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus-visible:ring-destructive",
            cancel:
              "ml-auto h-8 w-8 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          },
        }}
      />
    )
  }
)
Toaster.displayName = "Toaster"

export { Toaster }
