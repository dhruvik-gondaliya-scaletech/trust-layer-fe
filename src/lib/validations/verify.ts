import { z } from "zod";

export const emailVerifySchema = z.object({
  code: z
    .string()
    .length(6, { message: "Code must be exactly 6 digits" })
    .regex(/^\d+$/, { message: "Code must contain only digits" }),
});

export type EmailVerifyInput = z.infer<typeof emailVerifySchema>;

export const phoneInputSchema = z.object({
  phoneNumber: z
    .string()
    .min(10, { message: "Phone number must be at least 10 characters" })
    .regex(/^\+?[0-9\s\-()]+$/, {
      message: "Please enter a valid phone number (e.g., +1 (202) 555-1234)",
    }),
});

export type PhoneInputInput = z.infer<typeof phoneInputSchema>;

export const phoneVerifySchema = z.object({
  code: z
    .string()
    .length(6, { message: "Code must be exactly 6 digits" })
    .regex(/^\d+$/, { message: "Code must contain only digits" }),
});

export type PhoneVerifyInput = z.infer<typeof phoneVerifySchema>;

export const profileSetupSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters" })
    .max(30, { message: "Username must be less than 30 characters" })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: "Username can only contain letters, numbers, and underscores",
    }),
  bio: z
    .string()
    .max(160, { message: "Bio must be less than 160 characters" })
    .optional(),
  avatar: z.string().optional(),
});

export type ProfileSetupInput = z.infer<typeof profileSetupSchema>;
