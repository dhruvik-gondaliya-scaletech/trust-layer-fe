import * as React from "react"
import { cn } from "@/lib/utils"

interface BottomActionBarProps {
  children: React.ReactNode
  className?: string
}

export function BottomActionBar({ children, className }: BottomActionBarProps) {
  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-md border-t p-4 pb-safe-or-4",
        "lg:static lg:bg-transparent lg:border-t-0 lg:p-0 lg:mt-6 lg:z-auto",
        className
      )}
    >
      <div className="flex flex-col gap-3 w-full">
        {children}
      </div>
    </div>
  )
}
