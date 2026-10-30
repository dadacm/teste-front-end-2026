
import { z } from "zod";

export const registerSchema = z.strictObject({
  email: z
    .email()
    .trim()
    .toLowerCase()
    .max(254),

  password: z
    .string()
    .min(12)
    .max(128),
});

export type RegisterInput = z.infer<
  typeof registerSchema
>;
