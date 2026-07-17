"use client";

import { Spinner } from "@/components/ui/spinner";
import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@/lib/zodResolver";
import { disputeSchema, DisputeFormInput } from "@/lib/validations/dispute";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, Upload, Image as ImageIcon, X, Plus } from "lucide-react";
import { BackButton } from "@/components/shared/BackButton";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Form, FormField, FormControl, Field, FieldLabel, FieldError } from "@/components/ui/field";
import { BottomActionBar } from "@/components/ui/bottom-action-bar";

interface CreateDisputeViewProps {
  onSubmit: (data: DisputeFormInput & { files: File[] }) => Promise<void>;
  isSubmitting: boolean;
  onBack: () => void;
}

const MAX_FILES = 5;

const reasons = [
  { value: "Product Damaged", label: "Product Damaged", desc: "Item arrived broken, torn, or non-functional" },
  { value: "Missing Items", label: "Missing Items", desc: "Parts, accessories, or matching pairs are missing" },
  { value: "Wrong Item Received", label: "Wrong Item Received", desc: "Seller sent an entirely different product or model" },
  { value: "Order Has Not Arrived", label: "Order Has Not Arrived", desc: "Delivery exceeded expected timeline or tracking lost" },
  { value: "Other", label: "Other", desc: "Authenticity doubts, mismatched condition specs, etc." },
] as const;

export default function CreateDisputeView({ onSubmit, isSubmitting, onBack }: CreateDisputeViewProps) {
  const form = useForm<DisputeFormInput>({
    resolver: zodResolver(disputeSchema),
    defaultValues: {
      reason: "Product Damaged",
      notes: "",
    },
  });

  const notesText = form.watch("notes") || "";

  // File Upload State
  const [evidenceFiles, setEvidenceFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [dragActive, setDragActive] = useState(false);

  // Ref to programmatically trigger the hidden file input
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Keep preview URLs in sync with evidenceFiles, revoking old object URLs on cleanup
  useEffect(() => {
    const urls = evidenceFiles.map((f) =>
      f.type.startsWith("image/") ? URL.createObjectURL(f) : ""
    );
    setPreviewUrls(urls);
    return () => {
      urls.forEach((u) => { if (u) URL.revokeObjectURL(u); });
    };
  }, [evidenceFiles]);

  const addFiles = (incoming: File[]) => {
    setEvidenceFiles((prev) => [...prev, ...incoming].slice(0, MAX_FILES));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(Array.from(e.target.files));
      // Reset value so same file can be added again after removal
      e.target.value = "";
    }
  };

  const removeFile = (index: number) => {
    setEvidenceFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const onLocalSubmit = async (data: DisputeFormInput) => {
    await onSubmit({ ...data, files: evidenceFiles });
  };

  const hasFiles = evidenceFiles.length > 0;
  const canAddMore = evidenceFiles.length < MAX_FILES;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 pb-10 text-foreground">
      {/* ─── Header ─── */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto flex items-center justify-between px-4 py-4 w-full">
          <BackButton onClick={onBack} className="-ml-2" />
          <span className="text-[15px] font-bold">File a Dispute</span>
          <div className="w-8" />
        </div>
      </div>

      <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onLocalSubmit)} className="flex flex-col gap-6">

            {/* ── Intro Warning ── */}
            <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-[20px] flex gap-3 text-amber-800">
              <AlertCircle size={20} className="shrink-0 mt-0.5 text-amber-600" />
              <div>
                <p className="font-bold text-[13px]">Dispute Collateral Lock</p>
                <p className="text-[11.5px] text-amber-700 mt-0.5 leading-relaxed">
                  Filing a dispute pauses seller payouts and retains funds securely. TrustLayer arbitrators will review submitted evidence.
                </p>
              </div>
            </div>

            {/* ── Reason Selection (Compact Radio) ── */}
            <FormField control={form.control} name="reason" render={({ field }) => (
              <Field className="flex flex-col gap-2 border-none p-0">
                <FieldLabel className="text-[13px] font-bold">Reason for Dispute</FieldLabel>
                <FormControl>
                  <div className="flex flex-col gap-1.5">
                    {reasons.map((r) => {
                      const isSelected = field.value === r.value;
                      return (
                        <label
                          key={r.value}
                          className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all select-none",
                            isSelected
                              ? "border-primary bg-primary/5"
                              : "border-slate-200 bg-white hover:bg-slate-50"
                          )}
                        >
                          <input
                            type="radio"
                            name="disputeReason"
                            value={r.value}
                            checked={isSelected}
                            onChange={() => field.onChange(r.value)}
                            className="w-4 h-4 text-primary border-gray-300 focus:ring-primary shrink-0"
                          />
                          <div className="flex flex-col gap-0.5 min-w-0">
                            <span className="text-[13.5px] font-semibold text-foreground leading-tight">
                              {r.label}
                            </span>
                            <span className="text-[11px] text-slate-500 leading-tight">
                              {r.desc}
                            </span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </FormControl>
                <FieldError className="text-[11px] font-bold" />
              </Field>
            )} />

            {/* ── Detailed Explanation ── */}
            <FormField control={form.control} name="notes" render={({ field }) => (
              <Field className="flex flex-col gap-2 border-none p-0">
                <div className="flex justify-between items-center">
                  <FieldLabel htmlFor="notes" className="text-[13px] font-bold">
                    Detailed Explanation
                  </FieldLabel>
                  <span className={cn("text-[11px] font-bold", notesText.length < 30 ? "text-amber-600" : "text-slate-400")}>
                    {notesText.length} / 30 char min
                  </span>
                </div>
                <FormControl>
                  <Textarea
                    id="notes"
                    placeholder="Describe the issue in detail — noting transit tracking codes, exact package conditions upon arrival, and any communication with the seller..."
                    className="rounded-[16px] min-h-[120px] bg-white border-border/80"
                    {...field}
                  />
                </FormControl>
                <FieldError className="text-[11px] font-bold" />
              </Field>
            )} />

            {/* ── Evidence Upload ── */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Label className="text-[13px] font-bold">
                  Evidence Photos <span className="font-normal text-slate-400">(Optional)</span>
                </Label>
                <span className="text-[11px] text-slate-400 font-medium">
                  {evidenceFiles.length}/{MAX_FILES}
                </span>
              </div>

              {/* Hidden file input — triggered by drop zone or '+' card */}
              <input
                ref={fileInputRef}
                id="file-upload"
                type="file"
                multiple
                className="hidden"
                onChange={handleFileChange}
                accept="image/*"
              />

              {/* Empty state: drag-and-drop zone */}
              {!hasFiles && (
                <div
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={cn(
                    "border-2 border-dashed rounded-[20px] p-8 text-center transition-all cursor-pointer",
                    dragActive ? "border-primary bg-primary/5" : "border-slate-200 bg-white hover:border-primary/50 hover:bg-primary/[0.02]"
                  )}
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400">
                      <Upload size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-[13px] text-primary">Upload evidence photos</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Drag and drop or tap to select · PNG, JPG up to 5 images
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Filled state: grid of thumbnails + '+' add-more card */}
              {hasFiles && (
                <div className="grid grid-cols-3 gap-2">
                  <AnimatePresence mode="popLayout">
                    {evidenceFiles.map((file, index) => {
                      const preview = previewUrls[index];
                      return (
                        <motion.div
                          key={file.name + index}
                          layout
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 bg-slate-100 group"
                        >
                          {preview ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={preview}
                              alt={file.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                              <ImageIcon size={24} />
                            </div>
                          )}
                          {/* Remove button overlay */}
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={12} strokeWidth={2.5} />
                          </button>
                          {/* File name overlay */}
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-2 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <p className="text-[9px] font-bold text-white truncate">{file.name}</p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>

                  {/* '+' Add more card */}
                  {canAddMore && (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      onClick={() => fileInputRef.current?.click()}
                      className="aspect-square rounded-xl border-2 border-dashed border-slate-300 bg-white flex flex-col items-center justify-center gap-1.5 cursor-pointer hover:border-primary/60 hover:bg-primary/[0.03] transition-all group"
                    >
                      <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-primary/10 flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
                        <Plus size={18} strokeWidth={2.5} />
                      </div>
                      <span className="text-[10px] font-semibold text-slate-400 group-hover:text-primary transition-colors">
                        Add more
                      </span>
                    </motion.div>
                  )}
                </div>
              )}
            </div>

            {/* ── Submit ── */}
            <BottomActionBar>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 bg-destructive hover:bg-destructive/90 text-white rounded-[14px] font-bold text-[14px] mt-2 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <><Spinner className="size-4" /> Filing dispute...</>
                ) : (
                  "Submit Dispute Claim"
                )}
              </Button>
            </BottomActionBar>
          </form>
        </Form>
      </div>
    </div>
  );
}
