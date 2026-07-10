import React from "react";
import { Control } from "react-hook-form";
import { FormField, FormControl, Field } from "@/components/ui/field";
import { Checkbox } from "@/components/ui/checkbox";
import { TrackingFormInput } from "@/lib/validations/tracking";
import { Label } from "@/components/ui/label";

interface InsuranceCardProps {
  control: Control<TrackingFormInput>;
}

export default function InsuranceCard({ control }: InsuranceCardProps) {
  return (
    <FormField control={control} name="isInsured" render={({ field }) => (
      <Field className="border-none p-0">
        <FormControl>
          <Label className="flex items-start gap-3 cursor-pointer select-none">
            <Checkbox
              checked={field.value}
              onCheckedChange={field.onChange}
              className="mt-0.5"
            />
            <div className="flex-1">
              <p className="font-bold text-[13px] text-slate-700">This shipment is insured</p>
              <p className="text-[12px] text-slate-400 mt-0.5 leading-relaxed font-semibold">
                Protect this shipment with carrier insurance for additional coverage during transit.
              </p>
            </div>
          </Label>
        </FormControl>
      </Field>
    )} />
  );
}


