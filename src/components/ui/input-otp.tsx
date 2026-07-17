"use client"

import * as React from "react"
import { Minus } from "lucide-react"

import { cn } from "@/lib/utils"

type OTPContextValue = {
  value: string
  maxLength: number
  isFocused: boolean
  activeSlotIndex: number
  inputRef: React.RefObject<HTMLInputElement | null>
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
  const internalRef = React.useRef<HTMLInputElement>(null)

  // Support both forwarded ref and internal ref
  const inputRef = (ref as React.RefObject<HTMLInputElement | null>) ?? internalRef

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

  // Clicking anywhere on the container focuses the hidden input
  const handleContainerClick = () => {
    inputRef.current?.focus()
  }

  return (
    <OTPContext.Provider value={{ value, maxLength, isFocused, activeSlotIndex, inputRef }}>
      <div
        className={cn("relative flex items-center gap-2 cursor-text", containerClassName)}
        onClick={handleContainerClick}
      >
        <input
          ref={inputRef}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={maxLength}
          value={value}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          // Keep it invisible but above everything else so native focus/click works
          className="absolute inset-0 z-20 w-full h-full opacity-0 cursor-text select-none"
          aria-label="OTP input"
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
    // Let clicks fall through to the hidden input above
    style={{ pointerEvents: "none" }}
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
        "relative flex h-14 w-11 items-center justify-center rounded-xl border border-slate-200 bg-slate-50/30 text-lg font-bold text-slate-800 transition-all duration-200 ease-out select-none",
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
