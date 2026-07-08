"use client"

import * as React from "react"
import { Minus } from "lucide-react"

import { cn } from "@/lib/utils"

type OTPContextValue = {
  value: string
  maxLength: number
  isFocused: boolean
  activeSlotIndex: number
}

const OTPContext = React.createContext<OTPContextValue | null>(null)

const InputOTP = React.forwardRef<
  HTMLInputElement,
  Omit<React.ComponentPropsWithoutRef<"input">, "value" | "onChange"> & {
    maxLength: number
    value?: string
    defaultValue?: string
    onChange?: (value: string) => void
    containerClassName?: string
  }
>(({ className, containerClassName, maxLength, value: controlledValue, defaultValue, onChange, children, ...props }, ref) => {
  const [localValue, setLocalValue] = React.useState(defaultValue || "")
  const [isFocused, setIsFocused] = React.useState(false)

  const isControlled = controlledValue !== undefined
  const value = isControlled ? controlledValue : localValue

  const activeSlotIndex = value.length

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, "").slice(0, maxLength)
    if (!isControlled) {
      setLocalValue(val)
    }
    onChange?.(val)
  }

  return (
    <OTPContext.Provider value={{ value, maxLength, isFocused, activeSlotIndex }}>
      <div className={cn("relative flex items-center gap-2", containerClassName)}>
        <input
          ref={ref}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={maxLength}
          value={value}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="absolute inset-0 z-10 w-full h-full opacity-0 cursor-default select-none pointer-events-auto"
          {...props}
        />
        {children}
      </div>
    </OTPContext.Provider>
  )
})
InputOTP.displayName = "InputOTP"

const InputOTPGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center gap-1.5", className)}
    {...props}
  />
))
InputOTPGroup.displayName = "InputOTPGroup"

const InputOTPSlot = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div"> & { index: number }
>(({ index, className, ...props }, ref) => {
  const context = React.useContext(OTPContext)
  if (!context) {
    throw new Error("InputOTPSlot must be used within an InputOTP")
  }

  const { value, isFocused, activeSlotIndex } = context
  const char = value[index] || ""
  const isActive = isFocused && activeSlotIndex === index

  return (
    <div
      ref={ref}
      className={cn(
        "relative flex h-14 w-11 items-center justify-center rounded-xl border border-slate-200 bg-slate-50/30 text-lg font-bold text-slate-800 transition-all duration-200 ease-out",
        isActive && "z-20 border-blue-600 ring-4 ring-blue-500/10 scale-105 shadow-[0_0_14px_rgba(59,130,246,0.18)] bg-white",
        className
      )}
      {...props}
    >
      {char}
      {isActive && (
        <>
          <style>{`
            @keyframes otp-caret-blink {
              50% { opacity: 0; }
            }
            .animate-otp-caret {
              animation: otp-caret-blink 1s step-start infinite;
            }
          `}</style>
          <span className="absolute inset-y-3 w-[1.5px] bg-foreground animate-otp-caret" />
        </>
      )}
    </div>
  )
})
InputOTPSlot.displayName = "InputOTPSlot"

const InputOTPSeparator = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(({ ...props }, ref) => (
  <div ref={ref} role="separator" {...props}>
    <Minus className="h-4 w-4 text-muted-foreground" />
  </div>
))
InputOTPSeparator.displayName = "InputOTPSeparator"

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator }
