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
        "fixed bottom-0 left-0 md:left-64 right-0 z-40 bg-background/80 backdrop-blur-md border-t p-4 pb-8",
        "mx-auto max-w-2xl",
        "xl:static xl:bg-transparent xl:border-t-0 xl:p-0 xl:mt-6 xl:z-auto",
        className
      )}
    >
      <div className="flex flex-col gap-3 w-full xl:max-w-sm xl:mx-auto">
        {children}
      </div>
    </div>
  )
}
