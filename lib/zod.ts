import { z, ZodNumber } from "zod";

export const requiredMessage = "This field is required!";
export const invalidNumberMessage = "This field is not valid!";

const customErrorMap: z.ZodErrorMap = (issue, ctx) => {
  if (issue.code === z.ZodIssueCode.invalid_type) {
    if (issue.expected === "string" || issue.expected === "number") {
      return { message: requiredMessage };
    }
  }
  if (issue.code === z.ZodIssueCode.too_small) {
    if (
      issue.type === "string" &&
      (issue.minimum === 1 || (issue.minimum > 1 && ctx.data.length === 0))
    )
      return { message: requiredMessage };
    if (issue.minimum > 1 && issue.type === "string")
      return {
        message: `The ${issue.path} must be at least ${issue.minimum} characters long.`,
      };
  }

  if (issue.code === z.ZodIssueCode.too_big) {
    if (issue.maximum > 1 && issue.type === "string")
      return {
        message: `The ${issue.path} may not be longer than ${issue.maximum} characters.`,
      };
  }

  return { message: ctx.defaultError };
};

z.setErrorMap(customErrorMap);

export const requiredNumericString = z
  .custom<number>()
  .refine((value) => value ?? false, requiredMessage)
  .refine((value) => Number.isFinite(Number(value)), invalidNumberMessage)
  .transform((value) => Number(value));

export const zodInputStringPipe = (numbericPipe: ZodNumber) =>
  z
    .string()
    .transform((value) => (value === "" ? null : value))
    .nullable()
    .refine(
      (value) => {
        return value !== null && !isNaN(Number(value));
      },
      {
        message: requiredMessage,
      }
    )
    .transform((value) => (value === null ? 0 : Number(value)))
    .or(z.number().pipe(numbericPipe))
    .pipe(numbericPipe);
