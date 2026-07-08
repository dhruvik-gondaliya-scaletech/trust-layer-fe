"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { zodResolver } from "@/lib/zodResolver";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Form, FormField, FormControl, Field, FieldLabel, FieldError } from "@/components/ui/field";

// Review Validation Schema - comment is optional
const reviewSchema = z.object({
  rating: z.number().min(1, "Please select a star rating").max(5),
  comment: z.string().optional(),
});

type ReviewFormInput = z.infer<typeof reviewSchema>;

interface ReviewSellerProps {
  sellerName: string;
  sellerUsername: string;
  sellerAvatarUrl: string | null;
  isVerified: boolean;
  sellerRating: number;
  dealTitle: string;
  onSubmit: (data: ReviewFormInput) => Promise<void>;
  isSubmitting: boolean;
  onBack: () => void;
}

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .join("")
    .toUpperCase()
    .slice(0, 2) || "?";
};

export default function ReviewSeller({
  sellerName,
  sellerUsername,
  sellerAvatarUrl,
  isVerified,
  onSubmit,
  isSubmitting,
  onBack,
}: ReviewSellerProps) {
  const form = useForm<ReviewFormInput>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      comment: "",
    },
  });

  const rating = form.watch("rating");
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-foreground w-full max-w-[430px] mx-auto shadow-sm md:shadow-md md:my-4 md:rounded-[24px] md:min-h-[85vh] overflow-hidden">
      {/* ─── Header ─── */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-10 w-full shrink-0">
        <div className="flex items-center justify-between px-4 py-4 w-full">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="w-10 h-10 rounded-full text-slate-800 hover:bg-slate-50 shrink-0 flex items-center justify-center cursor-pointer"
          >
            <ChevronLeft size={20} className="stroke-[2.5]" />
          </Button>
          <span className="text-[16px] font-extrabold text-slate-900 tracking-tight">Review Seller</span>
          <div className="w-10 h-10 shrink-0" />
        </div>
      </div>

      {/* ─── Body Content ─── */}
      <div className="flex-1 overflow-y-auto px-5 py-6 flex flex-col bg-[#F8FAFC]">
        {/* Transaction Completed Status */}
        <div className="flex flex-col items-center text-center mt-2 shrink-0">
          <div className="w-11 h-11 rounded-full bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center mb-4 shadow-sm">
            <div className="w-7 h-7 rounded-full border-2 border-[#2E7D32] flex items-center justify-center bg-white text-[#2E7D32]">
              <svg className="w-4 h-4 stroke-[3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          <h2 className="text-[18px] font-extrabold text-slate-900 tracking-tight">Transaction Completed</h2>
          <p className="text-[13px] text-slate-500 font-medium leading-relaxed max-w-[290px] mt-2">
            Your transaction has been completed successfully. Please rate your experience with this seller.
          </p>
        </div>

        {/* Seller Info Section */}
        <div className="flex flex-col items-center mt-6 shrink-0">
          <div className="w-[64px] h-[64px] rounded-full overflow-hidden border border-slate-100 shadow-sm flex items-center justify-center bg-slate-200">
            {sellerAvatarUrl ? (
              <Image src={sellerAvatarUrl} alt={sellerName} width={64} height={64} className="object-cover" />
            ) : (
              <span className="font-bold text-slate-500 text-[20px]">
                {getInitials(sellerName)}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 mt-3">
            <span className="font-extrabold text-[16px] text-slate-900 leading-none">{sellerName}</span>
            {isVerified && (
              <svg className="w-[15px] h-[15px] text-[#2563EB] fill-current" viewBox="0 0 24 24">
                <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
            )}
          </div>
          <span className="text-[12px] text-slate-400 font-bold mt-1">@{sellerUsername}</span>
        </div>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 flex flex-col">
            {/* Star Selection */}
            <FormField control={form.control} name="rating" render={({ field }) => (
              <Field className="flex flex-col border-none p-0">
                <FormControl>
                  <div className="flex justify-center gap-3.5 mt-6 mb-6 shrink-0">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const isLit = (hoverRating !== null ? hoverRating : rating) >= star;
                      return (
                        <button
                          key={star}
                          type="button"
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(null)}
                          onClick={() => field.onChange(star)}
                          className="p-1 transition-transform active:scale-90 cursor-pointer"
                        >
                          <svg
                            className={cn(
                              "w-9 h-9 transition-colors",
                              isLit ? "text-amber-400 fill-amber-400" : "text-slate-300 fill-none"
                            )}
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                          </svg>
                        </button>
                      );
                    })}
                  </div>
                </FormControl>
                <FieldError className="text-center text-[12px] font-bold mt-[-16px] mb-4" />
              </Field>
            )} />

            {/* Comment and Button */}
            <div className="flex-1 flex flex-col justify-between">
              <FormField control={form.control} name="comment" render={({ field }) => (
                <Field className="flex flex-col gap-2 border-none p-0">
                  <FieldLabel htmlFor="comment" className="text-[13px] font-extrabold text-slate-900">
                    Leave a Comment (Optional)
                  </FieldLabel>
                  <FormControl>
                    <Textarea
                      id="comment"
                      placeholder="Share your experience with this seller..."
                      className="rounded-2xl min-h-[140px] bg-white border border-slate-100 shadow-sm p-4 text-[14px] leading-relaxed resize-none focus-visible:ring-1 focus-visible:ring-[#7C9BF3]"
                      {...field}
                    />
                  </FormControl>
                  <FieldError className="text-[11px] font-bold" />
                </Field>
              )} />

              <div className="mt-8 pb-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-14 bg-[#7C9BF3] hover:bg-[#6B8AE2] text-white rounded-2xl font-bold text-[15px] transition-all active:scale-[0.98] shadow-sm shadow-[#7C9BF3]/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Submit Review"
              )}
            </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
