import { z } from "zod";

export const emailSchema = z.string().trim().toLowerCase().email();

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(72, "Password too long");

export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  // allow optionally creating an admin in dev for testing
  role: z.enum(["USER", "ADMIN"]).optional(),
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1),
});

export const taskCreateSchema = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().max(2000).optional(),
});

export const taskUpdateSchema = z.object({
  title: z.string().trim().min(1).max(200).optional(),
  description: z.string().trim().max(2000).nullable().optional(),
  completed: z.boolean().optional(),
});

