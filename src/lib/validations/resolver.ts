import { FieldValues, Resolver } from "react-hook-form";
import { ZodSchema } from "zod";

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
    } catch (error: any) {
      if (error && error.issues) {
        const errors = error.issues.reduce((allErrors: any, currentError: any) => {
          const path = currentError.path[0];
          if (path) {
            allErrors[path] = {
              type: currentError.code,
              message: currentError.message,
            };
          }
          return allErrors;
        }, {});
        return {
          values: {},
          errors,
        };
      }
      return {
        values: {},
        errors: {
          root: {
            type: "validate",
            message: "Validation failed",
          },
        },
      };
    }
  };
};
