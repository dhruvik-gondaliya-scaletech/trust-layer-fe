import { FieldErrors, FieldValues, Resolver } from "react-hook-form";
import { ZodError, ZodSchema } from "zod";

export const zodResolver = <TFieldValues extends FieldValues>(
  schema: ZodSchema<TFieldValues>
): Resolver<TFieldValues> => {
  return async (values) => {
    try {
      const data = schema.parse(values);
      return {
        values: data,
        errors: {},
      };
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        const errors = error.issues.reduce<Record<string, { type: string; message: string }>>((allErrors, currentError) => {
          const path = currentError.path[0];
          if (typeof path === "string") {
            allErrors[path] = {
              type: currentError.code,
              message: currentError.message,
            };
          }
          return allErrors;
        }, {});
        return {
          values: {},
          errors: errors as unknown as FieldErrors<TFieldValues>,
        };
      }
      return {
        values: {},
        errors: {
          root: {
            type: "validate",
            message: "Validation failed",
          },
        } as unknown as FieldErrors<TFieldValues>,
      };
    }
  };
};
