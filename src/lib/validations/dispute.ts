import { z } from "zod";

export const disputeSchema = z.object({
  reason: z.enum([
    "Product Damaged",
    "Missing Items",
    "Wrong Item Received",
    "Order Has Not Arrived",
    "Other",
  ]),
  notes: z.string().min(30, "Please provide at least 30 characters explaining the issue"),
});

export type DisputeFormInput = z.infer<typeof disputeSchema>;
