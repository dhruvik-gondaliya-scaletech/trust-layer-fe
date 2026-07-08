import { z } from "zod";

export const addressSchema = z.object({
  type: z.enum(["Home", "Office", "Other"]),
  customLabel: z.string().max(30).optional(),
  name: z.string().min(2, "Name must be at least 2 characters"),
  street: z.string().min(5, "Street address must be at least 5 characters"),
  apt: z.string().optional(),
  zip: z.string().regex(/^\d{5}$/, "Invalid ZIP code (must be 5 digits)"),
  city: z.string().min(2, "City is required"),
  state: z.string().length(2, "State must be a 2-letter abbreviation"),
  country: z.string().min(2, "Country is required"),
  alternatePhone: z
    .string()
    .refine((val) => !val || /^\+?[1-9]\d{1,14}$/.test(val), {
      message: "Invalid phone number format",
    })
    .optional(),
});

export type AddressFormInput = z.infer<typeof addressSchema>;
