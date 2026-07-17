"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const SelectContext = React.createContext<{
  value?: string;
  onValueChange?: (val: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
} | null>(null);

export const Select: React.FC<{
  value?: string;
  onValueChange?: (val: string) => void;
  children: React.ReactNode;
}> = ({ value, onValueChange, children }) => {
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  return (
    <SelectContext.Provider value={{ value, onValueChange, open, setOpen, containerRef }}>
      <div ref={containerRef} className="relative w-full">{children}</div>
    </SelectContext.Provider>
  );
};

export const SelectTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => {
  const context = React.useContext(SelectContext);
  if (!context) throw new Error("SelectTrigger must be used within Select");

  return (
    <button
      ref={ref}
      type="button"
      onClick={() => context.setOpen(!context.open)}
      className={cn(
        "flex h-12 w-full items-center justify-between rounded-2xl border border-border/80 bg-background px-4 py-3 text-sm font-semibold shadow-xs transition-all duration-200 hover:bg-muted/5 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/25 disabled:cursor-not-allowed disabled:opacity-50 text-left cursor-pointer",
        context.open && "border-primary ring-2 ring-primary/25",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown
        className={cn(
          "h-4.5 w-4.5 text-muted-foreground transition-transform duration-200 shrink-0 ml-2",
          context.open && "rotate-180 text-primary"
        )}
      />
    </button>
  );
});
SelectTrigger.displayName = "SelectTrigger";

export const SelectValue: React.FC<{ placeholder?: string }> = ({ placeholder }) => {
  const context = React.useContext(SelectContext);
  if (!context) throw new Error("SelectValue must be used within Select");
  return <span className="truncate">{context.value || placeholder}</span>;
};

export const SelectContent: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  const context = React.useContext(SelectContext);

  if (!context) throw new Error("SelectContent must be used within Select");

  React.useEffect(() => {
    if (!context.open) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (
        context.containerRef.current &&
        !context.containerRef.current.contains(event.target as Node)
      ) {
        context.setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [context.open, context.containerRef]);

  if (!context.open) return null;

  return (
    <div
      className={cn(
        "absolute top-full left-0 right-0 z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-2xl border border-border/80 bg-popover text-popover-foreground shadow-lg p-1.5 flex flex-col gap-0.5 animate-in fade-in-50 slide-in-from-top-1 duration-100",
        className
      )}
    >
      {children}
    </div>
  );
};

export const SelectItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value: string }
>(({ className, children, value, ...props }, ref) => {
  const context = React.useContext(SelectContext);
  if (!context) throw new Error("SelectItem must be used within Select");
  
  const isSelected = context.value === value;
  
  return (
    <div
      ref={ref}
      onClick={() => {
        context.onValueChange?.(value);
        context.setOpen(false);
      }}
      className={cn(
        "relative flex w-full cursor-pointer select-none items-center rounded-xl py-2.5 px-3 text-sm outline-none transition-all duration-150 font-semibold text-foreground/70 hover:bg-primary/8 hover:text-primary",
        isSelected && "bg-primary/10 text-primary font-bold hover:bg-primary/10",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});
SelectItem.displayName = "SelectItem";
