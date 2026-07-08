"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@/lib/zodResolver";
import { disputeSchema, DisputeFormInput } from "@/lib/validations/dispute";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, ChevronLeft, Upload, FileText, Image as ImageIcon, Video, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Form, FormField, FormControl, Field, FieldLabel, FieldError } from "@/components/ui/field";

interface DisputeFlowProps {
  onSubmit: (data: DisputeFormInput & { files: File[] }) => Promise<void>;
  isSubmitting: boolean;
  onBack: () => void;
}

export default function DisputeFlow({ onSubmit, isSubmitting, onBack }: DisputeFlowProps) {
  const form = useForm<DisputeFormInput>({
    resolver: zodResolver(disputeSchema),
    defaultValues: {
      reason: "Product Damaged",
      notes: "",
    },
  });

  const selectedReason = form.watch("reason");
  const notesText = form.watch("notes") || "";

  // File Upload State
  const [evidenceFiles, setEvidenceFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);

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
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files);
      setEvidenceFiles((prev) => [...prev, ...files].slice(0, 5)); // cap at 5 files
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const files = Array.from(e.target.files);
      setEvidenceFiles((prev) => [...prev, ...files].slice(0, 5)); // cap at 5 files
    }
  };

  const removeFile = (index: number) => {
    setEvidenceFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const onLocalSubmit = async (data: DisputeFormInput) => {
    await onSubmit({ ...data, files: evidenceFiles });
  };

  const reasons = [
    { value: "Product Damaged", label: "Product Damaged", desc: "Item arrived broken, torn, or non-functional" },
    { value: "Missing Items", label: "Missing Items", desc: "Parts, accessories, or matching pairs are missing" },
    { value: "Wrong Item Received", label: "Wrong Item", desc: "Seller sent an entirely different product or model" },
    { value: "Order Has Not Arrived", label: "Not Arrived", desc: "Delivery has exceeded expected timeline or tracking lost" },
    { value: "Other", label: "Other / Uncommon", desc: "Authenticity doubts, mismatched condition specs, etc." },
  ] as const;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 pb-10 text-foreground">
      {/* ─── Header ─── */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto flex items-center justify-between px-4 py-4 w-full">
          <Button variant="ghost" size="icon" onClick={onBack} className="w-10 h-10 rounded-full text-slate-500">
            <ChevronLeft size={20} />
          </Button>
          <span className="text-[15px] font-bold">File a Dispute</span>
          <div className="w-8" />
        </div>
      </div>

      <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onLocalSubmit)} className="flex flex-col gap-6">
          {/* Intro Warning */}
          <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-[20px] flex gap-3 text-amber-800">
            <AlertCircle size={20} className="shrink-0 mt-0.5 text-amber-600" />
            <div>
              <p className="font-bold text-[13px]">Dispute Collateral Lock</p>
              <p className="text-[11.5px] text-amber-700 mt-0.5 leading-relaxed">
                Filing a dispute pauses seller payouts and retains funds in secure escrow. TrustLayer arbitrators will review submitted evidence.
              </p>
            </div>
          </div>

          {/* Reason Selection */}
          <FormField control={form.control} name="reason" render={({ field }) => (
            <Field className="flex flex-col gap-2 border-none p-0">
              <FieldLabel className="text-[13px] font-bold">Reason for Dispute</FieldLabel>
              <FormControl>
                <div className="flex flex-col gap-2">
                  {reasons.map((r) => {
                    const isSelected = field.value === r.value;
                    return (
                      <Card
                        key={r.value}
                        onClick={() => field.onChange(r.value)}
                        className={cn(
                          "rounded-[18px] border-2 cursor-pointer transition-all",
                          isSelected ? "border-primary bg-primary/5" : "border-transparent bg-white shadow-soft"
                        )}
                      >
                        <CardContent className="p-4 flex flex-col gap-0.5">
                          <p className="font-bold text-[14px]">{r.label}</p>
                          <p className="text-[12px] text-slate-500">{r.desc}</p>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </FormControl>
              <FieldError className="text-[11px] font-bold" />
            </Field>
          )} />

          {/* Explanation Textarea */}
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
                  placeholder="Describe the issue in detail, noting transit tracking codes, exact package conditions upon arrival, and communication logs with the seller..."
                  className="rounded-[16px] min-h-[120px] bg-white border-border/80"
                  {...field}
                />
              </FormControl>
              <FieldError className="text-[11px] font-bold" />
            </Field>
          )} />

          {/* File Upload / Evidence */}
          <div className="flex flex-col gap-2">
            <Label className="text-[13px] font-bold">Evidence Upload (Optional, max 5 files)</Label>
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              className={cn(
                "border-2 border-dashed rounded-[20px] p-6 text-center transition-all",
                dragActive ? "border-primary bg-primary/5" : "border-slate-200 bg-white"
              )}
            >
              <input
                id="file-upload"
                type="file"
                multiple
                className="hidden"
                onChange={handleFileChange}
                accept="image/*,video/*,application/pdf"
              />
              <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                  <Upload size={20} />
                </div>
                <div>
                  <p className="font-bold text-[13px] text-primary">Upload photo or video</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Drag and drop or tap to select (PNG, JPG, MP4, PDF)
                  </p>
                </div>
              </label>
            </div>

            {/* Uploaded File Previews */}
            <AnimatePresence>
              {evidenceFiles.length > 0 && (
                <div className="flex flex-col gap-2 mt-2">
                  {evidenceFiles.map((file, index) => {
                    const isImage = file.type.startsWith("image/");
                    const isVideo = file.type.startsWith("video/");
                    return (
                      <motion.div
                        key={file.name + index}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="bg-white rounded-[14px] p-3 flex items-center justify-between border border-slate-100 shadow-soft"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-10 h-10 rounded-[10px] bg-slate-50 flex items-center justify-center text-slate-400 shrink-0 overflow-hidden">
                            {isImage ? (
                              <ImageIcon size={18} />
                            ) : isVideo ? (
                              <Video size={18} />
                            ) : (
                              <FileText size={18} />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-[12px] font-bold text-slate-700 truncate">{file.name}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">
                              {(file.size / (1024 * 1024)).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFile(index)}
                          className="h-8 w-8 text-slate-400 hover:text-slate-600"
                        >
                          <X size={16} />
                        </Button>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </AnimatePresence>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 bg-destructive hover:bg-destructive-hover text-white rounded-[14px] font-bold text-[14px] mt-4 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              "Submit Dispute Claim"
            )}
          </Button>
        </form>
        </Form>
      </div>
    </div>
  );
}
