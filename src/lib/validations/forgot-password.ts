import { z } from "zod";

export const forgotEmailSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" }),
});

export type ForgotEmailInput = z.infer<typeof forgotEmailSchema>;

export const forgotOtpSchema = z.object({
  code: z
    .string()
    .length(6, { message: "Code must be exactly 6 digits" })
    .regex(/^\d+$/, { message: "Code must contain only digits" }),
});

export type ForgotOtpInput = z.infer<typeof forgotOtpSchema>;

export const forgotResetSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .max(64, { message: "Password must be less than 64 characters" })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
        message: "Password must contain at least one uppercase letter, one lowercase letter, and one number",
      }),
    confirmPassword: z
      .string()
      .min(1, { message: "Please confirm your password" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ForgotResetInput = z.infer<typeof forgotResetSchema>;
