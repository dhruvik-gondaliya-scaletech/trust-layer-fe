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
        "fixed bottom-0 inset-x-0 z-40 bg-background/80 backdrop-blur-md border-t p-4 pb-8",
        "mx-auto max-w-[430px] w-full",
        className
      )}
    >
      <div className="flex flex-col gap-3">
        {children}
      </div>
    </div>
  )
}
