import { z } from "zod";

export const trackingSchema = z.object({
  carrier: z.string().min(1, "Please select a shipping carrier"),
  trackingNumber: z.string().min(1, "Please enter a tracking number"),
  estimatedDeliveryAt: z.string().min(1, "Please select an estimated delivery date"),
  notes: z.string().optional(),
  isInsured: z.boolean().default(false),
  customCarrier: z.string().optional(),
  trackingUrl: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.carrier === "Other") {
    if (!data.customCarrier || data.customCarrier.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["customCarrier"],
        message: "Please enter a custom carrier name",
      });
    }
    if (!data.trackingUrl || data.trackingUrl.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["trackingUrl"],
        message: "Please enter a tracking URL",
      });
    } else {
      try {
        new URL(data.trackingUrl);
      } catch (e) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["trackingUrl"],
          message: "Please enter a valid URL (e.g. https://example.com)",
        });
      }
    }
  }
});

export type TrackingFormInput = z.infer<typeof trackingSchema>;
