import * as React from "react"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@radix-ui/react-toast"

import { cn } from "../../lib/utils"

const ToastContainer = ({ children, ...props }) => {
  return (
    <ToastProvider swipeDirection="right">
      <div {...props}>{children}</div>
    </ToastProvider>
  )
}
ToastContainer.displayName = "ToastContainer"

const ToastViewPort = React.forwardRef(
  ({ className, ...props }, ref) => {
    return (
      <ToastViewport
        ref={ref}
        className={cn(
          "fixed top-0 z-[100] flex max-h-screen w-full flex-col gap-2 p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:max-w-[420px]",
          className
        )}
        {...props}
      />
    )
  }
)
ToastViewPort.displayName = ToastViewport.displayName

const ToastRoot = React.forwardRef(
  ({ className, ...props }, ref) => {
    return (
      <Toast.Root
        ref={ref}
        className={cn(
          "group relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-4 pr-6 shadow-lg transition-all data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[state=closed]:slide-out-right-0 data-[state=open]:slide-in-from-top-0",
          className
        )}
        {...props}
      />
    )
  }
)
ToastRoot.displayName = ToastRoot.displayName

const ToastHeader = ({ className, ...props }) => {
  return (
    <div className={cn("grid gap-1", className)} {...props} />
  )
}
ToastHeader.displayName = "ToastHeader"

const ToastFooter = ({ className, ...props }) => {
  return (
    <div
      className={cn(
        "mt-auto flex items-center justify-end gap-2",
        className
      )}
      {...props}
    />
  )
}
ToastFooter.displayName = "ToastFooter"

const ToastTitleComponent = React.forwardRef(
  ({ className, ...props }, ref) => {
    return (
      <ToastTitle
        ref={ref}
        className={cn("text-sm font-semibold [&+div]:text-xs", className)}
        {...props}
      />
    )
  }
)
ToastTitleComponent.displayName = ToastTitle.displayName

const ToastDescriptionComponent = React.forwardRef(
  ({ className, ...props }, ref) => {
    return (
      <ToastDescription
        ref={ref}
        className={cn("text-sm opacity-90", className)}
        {...props}
      />
    )
  }
)
ToastDescriptionComponent.displayName = ToastDescription.displayName

const ToastCloseComponent = React.forwardRef(
  ({ className, ...props }, ref) => {
    return (
      <ToastClose
        ref={ref}
        className={cn(
          "absolute right-2 top-2 rounded-md text-gray-500 opacity-70 transition-opacity hover:text-gray-900 focus:opacity-100 focus:outline-none focus:ring-2 group-[[data-state=open]]:bg-gray-100 group-[[data-state=open]]:ring-gray-500",
          className
        )}
        {...props}
      />
    )
  }
)
ToastCloseComponent.displayName = ToastClose.displayName

export {
  ToastProvider,
  ToastRoot as Toast,
  ToastContainer,
  ToastViewPort,
  ToastHeader,
  ToastFooter,
  ToastTitleComponent as ToastTitle,
  ToastDescriptionComponent as ToastDescription,
  ToastCloseComponent as ToastClose,
  ToastViewport
};
