"use client";

import { Spinner } from "@/components/ui/spinner";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@/lib/zodResolver";
import { addressSchema, AddressFormInput } from "@/lib/validations/address";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Home, Briefcase, Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import { BottomActionBar } from "@/components/ui/bottom-action-bar";
import { Form, FormField, FormControl, Field, FieldLabel, FieldError } from "@/components/ui/field";

interface AddShippingAddressProps {
  onSubmit: (data: AddressFormInput & { isDefault?: boolean }) => Promise<void>;
  isSubmitting: boolean;
  onBack: () => void;
}

export default function AddShippingAddress({
  onSubmit,
  isSubmitting,
  onBack,
}: AddShippingAddressProps) {
  const form = useForm<AddressFormInput & { isDefault?: boolean }>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      type: "Home",
      country: "United States",
      isDefault: false,
    },
  });

  const selectedType = form.watch("type");

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 pb-[120px] text-foreground">
      {/* ─── Header ─── */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto flex items-center justify-between px-4 py-4 w-full">
          <Button variant="ghost" onClick={onBack} className="text-[14px] text-slate-500 font-bold hover:bg-slate-50 h-auto px-3 py-1">
            Cancel
          </Button>
          <span className="text-[15px] font-bold">New Shipping Address</span>
          <div className="w-8" />
        </div>
      </div>

      <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-6">
        <Form {...form}>
          <form id="add-address-form" onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
          {/* Label Type */}
          <FormField control={form.control} name="type" render={({ field }) => (
            <Field className="flex flex-col gap-2 border-none p-0">
              <FieldLabel className="text-[13px] font-bold">Address Type</FieldLabel>
              <FormControl>
                <div className="flex gap-2 bg-slate-100 p-1 rounded-[14px]">
                  {(["Home", "Office", "Other"] as const).map((type) => {
                    const isActive = field.value === type;
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => field.onChange(type)}
                        className={cn(
                          "flex-1 py-2 text-[12px] font-bold rounded-[11px] flex items-center justify-center gap-1.5 transition-all",
                          isActive ? "bg-white shadow-soft text-primary" : "text-slate-500"
                        )}
                      >
                        {type === "Home" && <Home size={14} />}
                        {type === "Office" && <Briefcase size={14} />}
                        {type === "Other" && <Tag size={14} />}
                        {type}
                      </button>
                    );
                  })}
                </div>
              </FormControl>
              <FieldError className="text-[11px] font-bold" />
            </Field>
          )} />

          {selectedType === "Other" && (
            <FormField control={form.control} name="customLabel" render={({ field }) => (
              <Field className="flex flex-col gap-2 border-none p-0">
                <FieldLabel htmlFor="customLabel" className="text-[13px] font-bold">
                  Custom Label (optional)
                </FieldLabel>
                <FormControl>
                  <Input
                    id="customLabel"
                    placeholder="e.g. Vacation Home, Warehouse"
                    className="rounded-[14px] h-12 bg-white border-border/80"
                    {...field}
                  />
                </FormControl>
                <FieldError className="text-[11px] font-bold" />
              </Field>
            )} />
          )}

          {/* Recipient Name */}
          <FormField control={form.control} name="name" render={({ field }) => (
            <Field className="flex flex-col gap-2 border-none p-0">
              <FieldLabel htmlFor="name" className="text-[13px] font-bold">
                Full Name / Recipient
              </FieldLabel>
              <FormControl>
                <Input
                  id="name"
                  placeholder="John Doe"
                  className="rounded-[14px] h-12 bg-white border-border/80"
                  {...field}
                />
              </FormControl>
              <FieldError className="text-[11px] font-bold" />
            </Field>
          )} />

          {/* Street Address */}
          <FormField control={form.control} name="street" render={({ field }) => (
            <Field className="flex flex-col gap-2 border-none p-0">
              <FieldLabel htmlFor="street" className="text-[13px] font-bold">
                Street Address
              </FieldLabel>
              <FormControl>
                <Input
                  id="street"
                  placeholder="123 Main St"
                  className="rounded-[14px] h-12 bg-white border-border/80"
                  {...field}
                />
              </FormControl>
              <FieldError className="text-[11px] font-bold" />
            </Field>
          )} />

          {/* Apartment, suite, unit */}
          <FormField control={form.control} name="apt" render={({ field }) => (
            <Field className="flex flex-col gap-2 border-none p-0">
              <FieldLabel htmlFor="apt" className="text-[13px] font-bold">
                Apartment, Suite, Unit, etc. (optional)
              </FieldLabel>
              <FormControl>
                <Input
                  id="apt"
                  placeholder="Apt 4B"
                  className="rounded-[14px] h-12 bg-white border-border/80"
                  {...field}
                />
              </FormControl>
              <FieldError className="text-[11px] font-bold" />
            </Field>
          )} />

          {/* City & State & Zip Grid */}
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="city" render={({ field }) => (
              <Field className="flex flex-col gap-2 border-none p-0">
                <FieldLabel htmlFor="city" className="text-[13px] font-bold">
                  City
                </FieldLabel>
                <FormControl>
                  <Input
                    id="city"
                    placeholder="New York"
                    className="rounded-[14px] h-12 bg-white border-border/80"
                    {...field}
                  />
                </FormControl>
                <FieldError className="text-[11px] font-bold" />
              </Field>
            )} />

            <FormField control={form.control} name="state" render={({ field }) => (
              <Field className="flex flex-col gap-2 border-none p-0">
                <FieldLabel htmlFor="state" className="text-[13px] font-bold">
                  State (2 letters)
                </FieldLabel>
                <FormControl>
                  <Input
                    id="state"
                    placeholder="NY"
                    maxLength={2}
                    className="rounded-[14px] h-12 bg-white text-center uppercase border-border/80"
                    {...field}
                  />
                </FormControl>
                <FieldError className="text-[11px] font-bold" />
              </Field>
            )} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="zip" render={({ field }) => (
              <Field className="flex flex-col gap-2 border-none p-0">
                <FieldLabel htmlFor="zip" className="text-[13px] font-bold">
                  ZIP Code
                </FieldLabel>
                <FormControl>
                  <Input
                    id="zip"
                    placeholder="10001"
                    maxLength={5}
                    className="rounded-[14px] h-12 bg-white border-border/80"
                    {...field}
                  />
                </FormControl>
                <FieldError className="text-[11px] font-bold" />
              </Field>
            )} />

            <FormField control={form.control} name="country" render={({ field }) => (
              <Field className="flex flex-col gap-2 border-none p-0">
                <FieldLabel htmlFor="country" className="text-[13px] font-bold">
                  Country
                </FieldLabel>
                <FormControl>
                  <Input
                    id="country"
                    placeholder="United States"
                    className="rounded-[14px] h-12 bg-white border-border/80"
                    {...field}
                  />
                </FormControl>
                <FieldError className="text-[11px] font-bold" />
              </Field>
            )} />
          </div>

          {/* Alternate Phone Number */}
          <FormField control={form.control} name="alternatePhone" render={({ field }) => (
            <Field className="flex flex-col gap-2 border-none p-0">
              <FieldLabel htmlFor="alternatePhone" className="text-[13px] font-bold">
                Recipient Phone Number (optional)
              </FieldLabel>
              <FormControl>
                <Input
                  id="alternatePhone"
                  placeholder="+1 (555) 000-0000"
                  className="rounded-[14px] h-12 bg-white border-border/80"
                  {...field}
                />
              </FormControl>
              <FieldError className="text-[11px] font-bold" />
            </Field>
          )} />

          {/* Default address toggle */}
          <FormField control={form.control} name="isDefault" render={({ field }) => (
            <Field className="border-none p-0">
              <FormControl>
                <label className="flex items-center gap-3 p-4 bg-white rounded-[20px] shadow-soft cursor-pointer mt-2">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-primary rounded border-slate-300 focus:ring-primary"
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                  />
                  <div>
                    <p className="font-bold text-[13px]">Set as default shipping address</p>
                    <p className="text-[12px] text-slate-400 mt-0.5">
                      Automatically pre-fill this address for future checkouts.
                    </p>
                  </div>
                </label>
              </FormControl>
            </Field>
          )} />
        </form>
      </Form>
      </div>

      <BottomActionBar>
        <Button
          type="submit"
          form="add-address-form"
          disabled={isSubmitting}
          className="w-full h-14 text-[16px] font-bold"
        >
          {isSubmitting ? (
            <Spinner className="size-4" />
          ) : (
            "Save Address"
          )}
        </Button>
      </BottomActionBar>
    </div>
  );
}

