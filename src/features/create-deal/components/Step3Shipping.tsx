"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Info } from "lucide-react";
import { Form, FormField, FormControl, Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Alert, AlertDescription } from "@/components/ui/alert";

export interface Step3ShippingData {
  handlingTime: string;
  // null until the user enters a value — the field is required to continue
  shippingCost: number | null;
}

interface Step3ShippingProps {
  initialData?: Partial<Step3ShippingData>;
  onContinue: (data: Step3ShippingData) => void;
}

const HANDLING_TIMES = [
  "Ship within 1–2 business days",
  "Ship within 3–5 business days",
];

export const Step3Shipping: React.FC<Step3ShippingProps> = ({
  initialData,
  onContinue,
}) => {
  const form = useForm<Step3ShippingData>({
    defaultValues: {
      handlingTime: initialData?.handlingTime || "",
      shippingCost: initialData?.shippingCost ?? null,
    },
  });

  return (
    <Form {...form}>
      <form
        id="step3-form"
        onSubmit={form.handleSubmit(onContinue)}
        className="flex flex-col h-full flex-1 overflow-hidden text-left"
      >
      {/* Scrollable Form Content */}
      <div className="flex-1 overflow-y-auto px-0.5 space-y-5 scrollbar-none">
        <Alert className="bg-amber-500/5 border border-amber-500/30 text-amber-500 dark:bg-amber-950/20 dark:border-amber-500/40 dark:text-amber-400 rounded-xl">
          <Info className="h-4 w-4 shrink-0" />
          <AlertDescription className="text-xs text-amber-800 dark:text-amber-300 font-semibold leading-relaxed">
            If you do not ship within the selected handling time, the transaction may be automatically cancelled.
          </AlertDescription>
        </Alert>

        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-extrabold text-foreground tracking-tight">Shipping</h2>
        </div>

        {/* Handling Time */}
        <div className="flex flex-col gap-1.5">
          <FormField control={form.control} name="handlingTime" rules={{ required: "Please select a handling time" }} render={({ field }) => (
            <Field className="flex flex-col gap-1.5 border-none p-0">
              <FieldLabel className="text-sm font-semibold text-foreground/85">
                Handling Time
              </FieldLabel>
              <FormControl>
                <Select value={field.value || ""} onValueChange={field.onChange}>
                  <SelectTrigger
                    className="rounded-2xl border border-border/80 h-12 text-sm font-semibold"
                  >
                    <SelectValue placeholder="Select handling time" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {HANDLING_TIMES.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FieldError className="text-xs font-semibold" />
            </Field>
          )} />
        </div>

        {/* Shipping Cost */}
        <FormField control={form.control} name="shippingCost" rules={{
          required: "Please enter a shipping cost (0 for free shipping)",
          min: { value: 0, message: "Shipping cost cannot be negative" },
        }} render={({ field }) => (
          <Field className="flex flex-col gap-1.5 border-none p-0">
            <FieldLabel className="text-sm font-semibold text-foreground/85">
              Shipping Cost (USD)
            </FieldLabel>
            <FormControl>
              <Input
                type="number"
                min={0}
                step="0.01"
                placeholder="Enter Shipping Cost"
                className="rounded-2xl border h-12 text-sm font-semibold border-border/80 placeholder:text-muted-foreground/50"
                value={field.value ?? ""}
                onChange={(e) =>
                  field.onChange(
                    Number.isNaN(e.target.valueAsNumber) ? null : e.target.valueAsNumber
                  )
                }
              />
            </FormControl>
            <FieldError className="text-xs font-semibold" />
          </Field>
        )} />
      </div>
    </form>
  </Form>
  );
};
