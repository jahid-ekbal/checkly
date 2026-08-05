import { z } from "zod";

export const signInSchema = z.object({
  email: z.email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});
export type SignInInput = z.infer<typeof signInSchema>;

export const createUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["admin", "member", "viewer"]),
});
export type CreateUserInput = z.infer<typeof createUserSchema>;

export const updateWorkspaceSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().max(500, "Description too long"),
});
export type UpdateWorkspaceInput = z.infer<typeof updateWorkspaceSchema>;
