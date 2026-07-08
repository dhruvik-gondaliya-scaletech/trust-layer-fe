import { FieldValues, Resolver } from "react-hook-form";
import { ZodSchema } from "zod";

export function zodResolver<T extends FieldValues>(schema: ZodSchema<T>): Resolver<T> {
  return async (values) => {
    const result = await schema.safeParseAsync(values);
    if (result.success) {
      return {
        values: result.data,
        errors: {},
      };
    }

    const errors: Record<string, any> = {};
    for (const issue of result.error.issues) {
      const path = issue.path.join(".");
      errors[path] = {
        type: issue.code,
        message: issue.message,
      };
    }

    return {
      values: {},
      errors,
    };
  };
}
