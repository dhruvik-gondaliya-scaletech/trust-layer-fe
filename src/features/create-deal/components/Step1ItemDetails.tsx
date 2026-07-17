"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { TrustScoreCard, TrustScoreBreakdown } from "./TrustScoreCard";
import { Form, FormField, FormControl, Field, FieldLabel, FieldError } from "@/components/ui/field";

export interface Step1FormData {
  title: string;
  price: number | "";
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
  trustScore?: number;
  nextStepName?: string;
  breakdown?: TrustScoreBreakdown;
}

const CATEGORIES = ["Trading Cards", "Sports Cards", "Toys", "Plush", "Figures", "Electronics", "Other"];
const CONDITIONS = ["Mint", "Near Mint", "Excellent", "Very Good", "Good", "Fair"];

export const Step1ItemDetails: React.FC<Step1ItemDetailsProps> = ({
  initialData,
  onContinue,
  trustScore,
  nextStepName,
  breakdown,
}) => {
  const form = useForm<Step1FormData>({
    defaultValues: {
      title: initialData?.title || "",
      price: initialData?.price || "",
      category: initialData?.category || "",
      condition: initialData?.condition || "",
      orderType: initialData?.orderType || "",
      isGraded: initialData?.isGraded ?? false,
      gradedSerial: initialData?.gradedSerial || "",
      description: initialData?.description || "",
    },
  });

  const isGraded = form.watch("isGraded");

  return (
    <Form {...form}>
      <form
        id="step1-form"
        onSubmit={form.handleSubmit(onContinue)}
        className="flex flex-col h-full flex-1 overflow-hidden text-left"
        noValidate
      >
        {/* Scrollable Form Content */}
        <div className="flex-1 overflow-y-auto px-0.5 space-y-5 scrollbar-none">

          {/* Trust Score card — scrolls with content */}
          {typeof trustScore === "number" && (
            <div className="lg:hidden">
              <TrustScoreCard score={trustScore} nextStepName={nextStepName} breakdown={breakdown} />
            </div>
          )}

          {/* Step heading */}
          <h2 className="text-2xl font-extrabold text-foreground tracking-tight">Item details</h2>

          {/* Title */}
          <FormField control={form.control} name="title" rules={{ required: "Item title is required" }} render={({ field }) => (
            <Field className="flex flex-col gap-1.5 border-none p-0">
              <FieldLabel htmlFor="item-title" className="text-sm font-semibold text-foreground/80">
                Title
              </FieldLabel>
              <FormControl>
                <Input
                  id="item-title"
                  placeholder="Enter Title"
                  className="rounded-2xl h-12 px-4 border text-base font-semibold bg-background placeholder:text-muted-foreground/50"
                  {...field}
                />
              </FormControl>
              <FieldError className="text-xs font-medium mt-0.5" />
            </Field>
          )} />

          {/* Price */}
          <FormField control={form.control} name="price" rules={{
            required: "Price is required",
            min: { value: 1, message: "Price must be greater than 0" },
          }} render={({ field }) => (
            <Field className="flex flex-col gap-1.5 border-none p-0">
              <FieldLabel htmlFor="item-price" className="text-sm font-semibold text-foreground/80">
                Price (USD)
              </FieldLabel>
              <div className="relative">
                <FormControl>
                  <Input
                    id="item-price"
                    type="number"
                    placeholder="Enter Price"
                    className="rounded-2xl h-12 px-4 border text-base font-semibold bg-background placeholder:text-muted-foreground/50"
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(Number.isNaN(e.target.valueAsNumber) ? "" : e.target.valueAsNumber)}
                  />
                </FormControl>
              </div>
              <FieldError className="text-xs font-medium mt-0.5" />
            </Field>
          )} />

          {/* Product Type & Condition Dropdowns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField control={form.control} name="category" rules={{ required: "Product type is required" }} render={({ field }) => (
              <Field className="flex flex-col gap-1.5 border-none p-0">
                <FieldLabel className="text-sm font-semibold text-foreground/80">
                  Product Type
                </FieldLabel>
                <FormControl>
                  <Select value={field.value || ""} onValueChange={field.onChange}>
                    <SelectTrigger className="rounded-2xl border border-border/80 h-12 text-sm font-semibold">
                      <SelectValue placeholder="Select Product Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FieldError className="text-xs font-medium mt-0.5" />
              </Field>
            )} />

            <FormField control={form.control} name="condition" rules={{ required: "Condition is required" }} render={({ field }) => (
              <Field className="flex flex-col gap-1.5 border-none p-0">
                <FieldLabel className="text-sm font-semibold text-foreground/80">
                  Condition
                </FieldLabel>
                <FormControl>
                  <Select value={field.value || ""} onValueChange={field.onChange}>
                    <SelectTrigger className="rounded-2xl border border-border/80 h-12 text-sm font-semibold">
                      <SelectValue placeholder="Select Condition" />
                    </SelectTrigger>
                    <SelectContent>
                      {CONDITIONS.map((cond) => (
                        <SelectItem key={cond} value={cond}>
                          {cond}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FieldError className="text-xs font-medium mt-0.5" />
              </Field>
            )} />
          </div>

          {/* Order Type Dropdown */}
          <FormField control={form.control} name="orderType" rules={{ required: "Order type is required" }} render={({ field }) => (
            <Field className="flex flex-col gap-1.5 border-none p-0">
              <FieldLabel className="text-sm font-semibold text-foreground/80">
                Order Type
              </FieldLabel>
              <FormControl>
                <Select value={field.value || ""} onValueChange={field.onChange}>
                  <SelectTrigger className="rounded-2xl border border-border/80 h-12 text-sm font-semibold">
                    <SelectValue placeholder="Select Order Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Online Transaction">Online Transaction</SelectItem>
                    <SelectItem value="In-Person Transaction">In-Person Transaction</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FieldError className="text-xs font-medium mt-0.5" />
            </Field>
          )} />

          {/* Graded Product Group to prevent layout jerking */}
          <div className="flex flex-col">
            <FormField control={form.control} name="isGraded" render={({ field }) => (
              <Field className="border-none p-0">
                <FormControl>
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
                    <span className="text-base font-bold text-foreground">Graded Product</span>
                  </div>
                </FormControl>
              </Field>
            )} />

            {/* Conditional Serial Number field with Smooth Height/Margin Transition */}
            <AnimatePresence initial={false}>
              {isGraded && (
                <motion.div
                  initial={{ height: 0, opacity: 0, marginTop: 0 }}
                  animate={{ height: "auto", opacity: 1, marginTop: 16 }}
                  exit={{ height: 0, opacity: 0, marginTop: 0 }}
                  transition={{ duration: 0.22, ease: "easeInOut" }}
                  className="overflow-hidden flex flex-col gap-1.5 px-0.5 pb-0.5"
                >
                  <FormField control={form.control} name="gradedSerial" rules={{ required: isGraded ? "Serial number is required" : false }} render={({ field }) => (
                    <Field className="flex flex-col gap-1.5 border-none p-0">
                      <FieldLabel htmlFor="item-serial" className="text-sm font-semibold text-foreground/80">
                        Serial Number
                      </FieldLabel>
                      <FormControl>
                        <Input
                          id="item-serial"
                          placeholder="Enter Serial Number"
                          className="rounded-2xl h-12 px-4 border text-base font-semibold bg-background placeholder:text-muted-foreground/50"
                          {...field}
                        />
                      </FormControl>
                      <FieldError className="text-xs font-medium mt-0.5" />
                    </Field>
                  )} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Description */}
          <FormField control={form.control} name="description" render={({ field }) => (
            <Field className="flex flex-col gap-1.5 border-none p-0">
              <FieldLabel htmlFor="item-desc" className="text-sm font-semibold text-foreground/80">
                Description
              </FieldLabel>
              <FormControl>
                <Textarea
                  id="item-desc"
                  placeholder="Enter Description"
                  rows={3}
                  className="border-border/80 resize-none rounded-2xl p-4 text-base font-semibold bg-background placeholder:text-muted-foreground/50"
                  {...field}
                />
              </FormControl>
            </Field>
          )} />
        </div>
      </form>
    </Form>
  );
};
