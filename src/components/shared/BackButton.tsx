"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface BackButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Custom navigation handler. If not provided, defaults to `router.back()`.
   */
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  
  /**
   * Optional text label to display next to the icon.
   */
  label?: string;

  /**
   * Whether to display as a circular icon button or inline with a label.
   * Defaults to "icon" if no label is provided, or "inline" (with label) if a label is provided.
   */
  displayStyle?: "icon" | "inline";

  /**
   * Button styling variants matching the UI button variants.
   */
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";

  /**
   * Size of the button.
   */
  size?: "default" | "xs" | "sm" | "lg" | "icon" | "icon-xs" | "icon-sm" | "icon-lg";
}

export function BackButton({
  onClick,
  label,
  displayStyle,
  variant = "ghost",
  size,
  className,
  ...props
}: BackButtonProps) {
  const router = useRouter();

  const handleBack = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) {
      onClick(e);
    } else {
      router.back();
    }
  };

  const resolvedStyle = displayStyle || (label ? "inline" : "icon");
  const resolvedSize = size || (resolvedStyle === "icon" ? "icon" : "default");

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="inline-block"
    >
      <Button
        type="button"
        variant={variant}
        size={resolvedSize}
        onClick={handleBack}
        className={cn(
          "transition-all duration-200 cursor-pointer font-bold select-none",
          resolvedStyle === "icon" 
            ? "rounded-full flex items-center justify-center p-0 shadow-xs border border-border/10 bg-background/50 hover:bg-background/80" 
            : "rounded-2xl flex items-center gap-1.5 px-3 py-1.5 text-sm",
          className
        )}
        aria-label={label || "Go back"}
        {...props}
      >
        <ChevronLeft 
          className={cn(
            "shrink-0 transition-transform duration-200 group-hover:-translate-x-0.5", 
            resolvedStyle === "icon" ? "h-5 w-5" : "h-4 w-4"
          )} 
        />
        {label && <span className="tracking-tight">{label}</span>}
      </Button>
    </motion.div>
  );
}
