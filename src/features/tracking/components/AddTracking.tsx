"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { ChevronLeft, Loader2, Package } from "lucide-react";
import { zodResolver } from "@/lib/zodResolver";
import { trackingSchema, TrackingFormInput } from "@/lib/validations/tracking";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormField, FormControl, Field, FieldLabel, FieldError } from "@/components/ui/field";
import { DatePicker } from "@/components/ui/date-picker";
import ShipmentProgress from "./ShipmentProgress";
import ReceiptUpload from "./ReceiptUpload";
import InsuranceCard from "./InsuranceCard";
import { BottomActionBar } from "@/components/ui/bottom-action-bar";
import { motion, AnimatePresence } from "framer-motion";

interface AddTrackingProps {
  onSubmit: (data: TrackingFormInput & { receiptFile: File | null }) => Promise<void>;
  isSubmitting: boolean;
  onBack: () => void;
}

const CARRIERS = ["USPS", "UPS", "FedEx", "DHL", "Other"];

export default function AddTracking({
  onSubmit,
  isSubmitting,
  onBack,
}: AddTrackingProps) {
  const form = useForm<TrackingFormInput>({
    resolver: zodResolver(trackingSchema),
    defaultValues: {
      carrier: "",
      trackingNumber: "",
      estimatedDeliveryAt: "",
      notes: "",
      isInsured: false,
      customCarrier: "",
      trackingUrl: "",
    },
  });

  const notesText = form.watch("notes") || "";

  // File Upload State
  const [receiptFile, setReceiptFile] = useState<File | null>(null);

  const onLocalSubmit = async (data: TrackingFormInput) => {
    await onSubmit({ ...data, receiptFile });
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/70 pb-[120px] text-foreground">
      {/* ─── Header ─── */}
      <div className="bg-white border-b border-slate-100/80 sticky top-0 z-30">
        <div className="max-w-2xl mx-auto flex items-center justify-between px-4 py-4 w-full">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="w-10 h-10 rounded-full text-slate-500 hover:bg-slate-50"
          >
            <ChevronLeft size={20} />
          </Button>
          <span className="text-[16px] font-black tracking-tight text-slate-800">Upload Tracking Details</span>
          <div className="w-10" />
        </div>
      </div>

      <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-6 flex flex-col gap-6">
        {/* ─── Progress Card ─── */}
        <ShipmentProgress />

        {/* ─── Hero Icon / Title ─── */}
        <div className="flex flex-col items-center text-center py-4">
          <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center text-primary mb-4 border border-blue-100 shadow-inner">
            <Package className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-800">Upload Tracking Details</h1>
          <p className="text-[13px] text-slate-500 font-medium max-w-sm mt-1">
            Provide shipping information so the buyer can track the package.
          </p>
        </div>

        {/* ─── Main Form Card ─── */}
        <Form {...form}>
          <form id="add-tracking-form" onSubmit={form.handleSubmit(onLocalSubmit)} className="flex flex-col gap-6">
            <div className="p-5 flex flex-col gap-5">

              {/* Shipping Carrier */}
              <FormField control={form.control} name="carrier" render={({ field }) => (
                <Field className="flex flex-col gap-2 border-none p-0">
                  <FieldLabel htmlFor="carrier" className="text-[13px] font-bold text-slate-700">
                    Shipping Carrier
                  </FieldLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="carrier" className="rounded-[16px] h-12 bg-white border-slate-200">
                        <SelectValue placeholder="Select carrier" />
                      </SelectTrigger>
                      <SelectContent className="rounded-[16px] border-slate-200">
                        {CARRIERS.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FieldError className="text-[11px] font-bold" />
                </Field>
              )} />

              {/* Smoothly visible other carrier details */}
              <AnimatePresence initial={false}>
                {form.watch("carrier") === "Other" && (
                  <motion.div
                    key="custom-carrier-fields"
                    initial={{ opacity: 0, height: 0, overflow: "hidden" }}
                    animate={{ opacity: 1, height: "auto", overflow: "visible" }}
                    exit={{ opacity: 0, height: 0, overflow: "hidden" }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="flex flex-col gap-5 overflow-hidden"
                  >
                    {/* Custom Carrier Name */}
                    <FormField control={form.control} name="customCarrier" render={({ field }) => (
                      <Field className="flex flex-col gap-2 border-none p-0">
                        <FieldLabel htmlFor="customCarrier" className="text-[13px] font-bold text-slate-700">
                          Custom Carrier Name
                        </FieldLabel>
                        <FormControl>
                          <Input
                            id="customCarrier"
                            placeholder="Enter custom carrier name"
                            className="rounded-[16px] h-12 bg-white border-slate-200"
                            {...field}
                          />
                        </FormControl>
                        <FieldError className="text-[11px] font-bold" />
                      </Field>
                    )} />

                    {/* Tracking URL */}
                    <FormField control={form.control} name="trackingUrl" render={({ field }) => (
                      <Field className="flex flex-col gap-2 border-none p-0">
                        <FieldLabel htmlFor="trackingUrl" className="text-[13px] font-bold text-slate-700">
                          Tracking URL
                        </FieldLabel>
                        <FormControl>
                          <Input
                            id="trackingUrl"
                            placeholder="https://example.com/tracking"
                            className="rounded-[16px] h-12 bg-white border-slate-200"
                            {...field}
                          />
                        </FormControl>
                        <FieldError className="text-[11px] font-bold" />
                      </Field>
                    )} />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Tracking Number */}
              <FormField control={form.control} name="trackingNumber" render={({ field }) => (
                <Field className="flex flex-col gap-2 border-none p-0">
                  <FieldLabel htmlFor="trackingNumber" className="text-[13px] font-bold text-slate-700">
                    Tracking Number
                  </FieldLabel>
                  <FormControl>
                    <Input
                      id="trackingNumber"
                      placeholder="Enter tracking number"
                      className="rounded-[16px] h-12 bg-white border-slate-200"
                      {...field}
                    />
                  </FormControl>
                  <FieldError className="text-[11px] font-bold" />
                </Field>
              )} />

              {/* Estimated Delivery Date */}
              <FormField control={form.control} name="estimatedDeliveryAt" render={({ field }) => (
                <Field className="flex flex-col gap-2 border-none p-0">
                  <FieldLabel htmlFor="estimatedDeliveryAt" className="text-[13px] font-bold text-slate-700">
                    Estimated Delivery Date
                  </FieldLabel>
                  <span className="text-[11px] font-medium text-slate-400 -mt-1">
                    When do you expect the buyer to receive the package?
                  </span>
                  <FormControl>
                    <DatePicker
                      id="estimatedDeliveryAt"
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="MM/DD/YYYY"
                      className="h-12 rounded-[16px]"
                    />
                  </FormControl>
                  <FieldError className="text-[11px] font-bold" />
                </Field>
              )} />

              {/* Drop-off Receipt */}
              <ReceiptUpload receiptFile={receiptFile} onChange={setReceiptFile} />

              {/* Notes */}
              <FormField control={form.control} name="notes" render={({ field }) => (
                <Field className="flex flex-col gap-2 border-none p-0">
                  <div className="flex justify-between items-center">
                    <FieldLabel htmlFor="notes" className="text-[13px] font-bold text-slate-700">
                      Notes <span className="text-slate-400 font-medium">(Optional)</span>
                    </FieldLabel>
                    <span className="text-[11px] font-bold text-slate-400">
                      {notesText.length} characters
                    </span>
                  </div>
                  <FormControl>
                    <Textarea
                      id="notes"
                      placeholder="Package dropped off at USPS Main Office."
                      className="rounded-[16px] min-h-[90px] bg-white border-slate-200"
                      {...field}
                    />
                  </FormControl>
                  <FieldError className="text-[11px] font-bold" />
                </Field>
              )} />


              {/* Insurance */}
              <InsuranceCard control={form.control} />
            </div>
          </form>
        </Form>
      </div>

      <BottomActionBar>
        <div className="flex flex-col gap-3 w-full lg:max-w-sm lg:mx-auto">
          <Button
            type="submit"
            form="add-tracking-form"
            disabled={isSubmitting}
            className="w-full h-13 text-[14px] font-bold rounded-2xl bg-primary hover:bg-primary/95 text-white flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Uploading Tracking...</span>
              </>
            ) : (
              <span>Upload Tracking</span>
            )}
          </Button>
        </div>
      </BottomActionBar>

    </div>
  );
}
