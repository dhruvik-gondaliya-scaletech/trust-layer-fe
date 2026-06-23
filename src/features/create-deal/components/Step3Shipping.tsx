"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Info, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Step3ShippingData {
  handlingTime: string;
  carrier: string;
  shippingType: string;
  isInsured: boolean;
}

interface Step3ShippingProps {
  initialData?: Partial<Step3ShippingData>;
  onContinue: (data: Step3ShippingData) => void;
}

const HANDLING_TIMES = [
  "Ship within 1–2 business days",
  "Ship within 3–5 business days",
];

const CARRIERS = ["USPS", "UPS", "FedEx", "DHL"];
const SHIPPING_TYPES = ["Standard", "Expedited", "Express"];

export const Step3Shipping: React.FC<Step3ShippingProps> = ({
  initialData,
  onContinue,
}) => {
  const { control, handleSubmit, watch, setValue } = useForm<Step3ShippingData>({
    defaultValues: {
      handlingTime: initialData?.handlingTime || "Ship within 1–2 business days",
      carrier: initialData?.carrier || "USPS",
      shippingType: initialData?.shippingType || "Standard",
      isInsured: initialData?.isInsured ?? false,
    },
  });

  const isInsured = watch("isInsured");

  return (
    <form
      id="step3-form"
      onSubmit={handleSubmit(onContinue)}
      className="flex flex-col h-full flex-1 overflow-hidden text-left"
    >
      {/* Scrollable Form Content */}
      <div className="flex-1 overflow-y-auto pr-0.5 space-y-5 scrollbar-none pb-28">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-extrabold text-foreground tracking-tight">Shipping</h2>
        </div>

        {/* Handling Time */}
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs font-semibold text-foreground/85">
            Handling Time
          </Label>
          <Controller
            name="handlingTime"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="rounded-2xl border border-border/80 h-12 text-sm font-semibold focus:ring-2 focus:ring-primary/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {HANDLING_TIMES.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          
          {/* Amber Info Box */}
          <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-500 text-[11px] leading-relaxed">
            <Info className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              If you do not ship within the selected handling time, the transaction may be automatically cancelled.
            </span>
          </div>
        </div>

        {/* Carrier & Shipping Type side-by-side */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-semibold text-foreground/85">
              Carrier
            </Label>
            <Controller
              name="carrier"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="rounded-2xl border border-border/80 h-12 text-sm font-semibold focus:ring-2 focus:ring-primary/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {CARRIERS.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-semibold text-foreground/85">
              Shipping Type
            </Label>
            <Controller
              name="shippingType"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="rounded-2xl border border-border/80 h-12 text-sm font-semibold focus:ring-2 focus:ring-primary/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {SHIPPING_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </div>

        {/* Insured Shipment Card */}
        <div
          onClick={() => setValue("isInsured", !isInsured, { shouldDirty: true })}
          className={cn(
            "p-4 bg-muted/15 border border-border/80 rounded-2xl cursor-pointer hover:bg-muted/20 select-none transition-all flex items-start gap-3",
            isInsured && "border-primary/40 bg-primary/5"
          )}
        >
          <div
            className={cn(
              "w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-all",
              isInsured
                ? "bg-primary border-primary text-primary-foreground"
                : "border-muted-foreground/30 bg-background"
            )}
          >
            {isInsured && <Check className="w-3.5 h-3.5 stroke-[3.5]" />}
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-bold text-foreground leading-none">Insured Shipment</span>
            <span className="text-[10px] text-muted-foreground leading-normal mt-1">
              Insurance amount will be entered later during tracking upload.
            </span>
          </div>
        </div>
      </div>
    </form>
  );
};
