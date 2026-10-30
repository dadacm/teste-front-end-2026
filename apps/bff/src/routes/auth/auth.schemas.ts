
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


export const loginSchema = z.strictObject({
    email: z
      .string()
      .trim()
      .toLowerCase()
      .pipe(z.email()),

    password: z.string().min(1),
  });

  export type LoginInput = z.infer<typeof loginSchema>;