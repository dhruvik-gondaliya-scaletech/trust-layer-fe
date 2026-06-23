"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

export interface Step1FormData {
  title: string;
  price: number;
  category: string;
  condition: string;
  orderType: string;
  isGraded: boolean;
  gradedSerial?: string;
  description: string;
}

interface Step1ItemDetailsProps {
  initialData?: Partial<Step1FormData>;
  onContinue: (data: Step1FormData) => void;
}

const CATEGORIES = ["Trading Cards", "Sports Cards", "Toys", "Plush", "Figures"];
const CONDITIONS = ["Mint", "Near Mint", "Excellent", "Very Good", "Good", "Fair"];

export const Step1ItemDetails: React.FC<Step1ItemDetailsProps> = ({
  initialData,
  onContinue,
}) => {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<Step1FormData>({
    defaultValues: {
      title: initialData?.title || "",
      price: initialData?.price || undefined,
      category: initialData?.category || "Trading Cards",
      condition: initialData?.condition || "Mint",
      orderType: initialData?.orderType || "Online Transaction",
      isGraded: initialData?.isGraded ?? false,
      gradedSerial: initialData?.gradedSerial || "",
      description: initialData?.description || "",
    },
  });

  const isGraded = watch("isGraded");

  return (
    <form
      onSubmit={handleSubmit(onContinue)}
      className="flex flex-col gap-5 text-left"
      noValidate
    >
      {/* Title */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="item-title" className="text-xs font-semibold text-foreground/80">
          Title
        </Label>
        <Input
          id="item-title"
          placeholder="Charizard Holo 1999 Base Set"
          className={cn(
            "rounded-2xl h-12 px-4 border text-sm font-semibold bg-background",
            errors.title ? "border-destructive focus-visible:ring-destructive/20" : "border-border/80"
          )}
          {...register("title", { required: "Item title is required" })}
        />
        {errors.title && (
          <span className="text-[11px] font-medium text-destructive mt-0.5" role="alert">
            {errors.title.message}
          </span>
        )}
      </div>

      {/* Price */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="item-price" className="text-xs font-semibold text-foreground/80">
          Price (USD)
        </Label>
        <div className="relative">
          <Input
            id="item-price"
            type="number"
            placeholder="4300"
            className={cn(
              "rounded-2xl h-12 px-4 border text-sm font-semibold bg-background",
              errors.price ? "border-destructive focus-visible:ring-destructive/20" : "border-border/80"
            )}
            {...register("price", {
              required: "Price is required",
              min: { value: 1, message: "Price must be greater than 0" },
              valueAsNumber: true,
            })}
          />
        </div>
        {errors.price && (
          <span className="text-[11px] font-medium text-destructive mt-0.5" role="alert">
            {errors.price.message}
          </span>
        )}
      </div>

      {/* Product Type & Condition Dropdowns Side-by-Side */}
      <div className="grid grid-cols-[1.3fr_1fr] gap-3">
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs font-semibold text-foreground/80">
            Product Type
          </Label>
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="rounded-2xl border border-border/80 h-12 text-sm font-semibold">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label className="text-xs font-semibold text-foreground/80">
            Condition
          </Label>
          <Controller
            name="condition"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="rounded-2xl border border-border/80 h-12 text-sm font-semibold">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CONDITIONS.map((cond) => (
                    <SelectItem key={cond} value={cond}>
                      {cond}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      {/* Order Type Dropdown */}
      <div className="flex flex-col gap-1.5">
        <Label className="text-xs font-semibold text-foreground/80">
          Order Type
        </Label>
        <Controller
          name="orderType"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="rounded-2xl border border-border/80 h-12 text-sm font-semibold">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Online Transaction">Online Transaction</SelectItem>
                <SelectItem value="In-Person Transaction">In-Person Transaction</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>

      {/* Graded Product Checkbox */}
      <div className="flex flex-col gap-1.5">
        <Controller
          name="isGraded"
          control={control}
          render={({ field }) => (
            <div
              onClick={() => field.onChange(!field.value)}
              className="flex items-center gap-3 p-4 bg-muted/15 border border-border/80 rounded-2xl cursor-pointer hover:bg-muted/20 select-none transition-colors"
            >
              <div
                className={cn(
                  "w-5 h-5 rounded-md border flex items-center justify-center transition-all",
                  field.value
                    ? "bg-primary border-primary text-primary-foreground"
                    : "border-muted-foreground/40 bg-background"
                )}
              >
                {field.value && (
                  <svg
                    className="w-3 h-3 stroke-current stroke-[3]"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>
              <span className="text-sm font-bold text-foreground">Graded Product</span>
            </div>
          )}
        />
      </div>

      {/* Conditional Serial Number field */}
      {isGraded && (
        <div className="flex flex-col gap-1.5 animate-in fade-in-50 duration-150">
          <Label htmlFor="item-serial" className="text-xs font-semibold text-foreground/80">
            Serial Number
          </Label>
          <Input
            id="item-serial"
            placeholder="Enter serial number..."
            className={cn(
              "rounded-2xl h-12 px-4 border text-sm font-semibold bg-background",
              errors.gradedSerial ? "border-destructive focus-visible:ring-destructive/20" : "border-border/80"
            )}
            {...register("gradedSerial", {
              required: isGraded ? "Serial number is required" : false,
            })}
          />
          {errors.gradedSerial && (
            <span className="text-[11px] font-medium text-destructive mt-0.5" role="alert">
              {errors.gradedSerial.message}
            </span>
          )}
        </div>
      )}

      {/* Description */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="item-desc" className="text-xs font-semibold text-foreground/80">
          Description
        </Label>
        <Textarea
          id="item-desc"
          placeholder="Mint condition. Kept in sleeve."
          rows={3}
          className="border-border/80 resize-none rounded-2xl p-4 text-sm font-semibold bg-background"
          {...register("description")}
        />
      </div>

      {/* Submit Button */}
      <div className="mt-2">
        <Button
          type="submit"
          size="lg"
          className="w-full bg-primary text-primary-foreground hover:bg-primary/95 shadow-md shadow-primary/10 rounded-2xl h-12 text-sm font-bold active:scale-[0.98] transition-all"
        >
          Continue
        </Button>
      </div>
    </form>
  );
};
