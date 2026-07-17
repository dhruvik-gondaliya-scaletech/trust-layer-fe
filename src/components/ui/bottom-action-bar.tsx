import * as React from "react"
import { cn } from "@/lib/utils"

interface BottomActionBarProps {
  children: React.ReactNode
  className?: string
  staticBreakpoint?: "lg" | "xl" | "none"
}

export function BottomActionBar({ 
  children, 
  className,
  staticBreakpoint = "lg" 
}: BottomActionBarProps) {
  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-md border-t p-4 pb-safe-or-4 transition-all duration-200",
        "group-data-[sidebar-collapsed=false]/layout:md:left-64 group-data-[sidebar-collapsed=true]/layout:md:left-20",
        staticBreakpoint === "lg" && "lg:static lg:bg-transparent lg:border-t-0 lg:p-0 lg:mt-6 lg:z-auto",
        staticBreakpoint === "xl" && "lg:fixed lg:bottom-0 lg:right-0 lg:z-40 lg:bg-background/80 lg:backdrop-blur-md lg:border-t lg:p-4 lg:pb-safe-or-4 group-data-[sidebar-collapsed=false]/layout:lg:left-64 group-data-[sidebar-collapsed=true]/layout:lg:left-20 xl:static xl:bg-transparent xl:border-t-0 xl:p-0 xl:mt-6 xl:z-auto",
        className
      )}
    >
      <div className="flex flex-col gap-3 w-full sm:max-w-sm sm:mx-auto">
        {children}
      </div>
    </div>
  )
}
