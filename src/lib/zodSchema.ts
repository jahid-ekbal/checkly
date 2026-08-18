import { z } from "zod";

export const passwordPolicy = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password must be at most 128 characters")
  .regex(/[a-z]/, "Password must contain a lowercase letter")
  .regex(/[A-Z]/, "Password must contain an uppercase letter")
  .regex(/[0-9]/, "Password must contain a number");

export const signInSchema = z.object({
  email: z.email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().default(true),
});
export type SignInInput = z.infer<typeof signInSchema>;

export const signUpSchema = z
  .object({
    name: z.string().trim().min(2, "Name must be at least 2 characters"),
    email: z.email("Enter a valid email"),
    password: passwordPolicy,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
export type SignUpInput = z.infer<typeof signUpSchema>;

export const createUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Enter a valid email"),
  password: passwordPolicy,
  role: z.enum(["admin", "user"]),
});
export type CreateUserInput = z.infer<typeof createUserSchema>;

export const updateWorkspaceSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().max(500, "Description too long"),
});
export type UpdateWorkspaceInput = z.infer<typeof updateWorkspaceSchema>;

export const updateProfileSchema = z
  .object({
    name: z.string().trim().min(2, "Name must be at least 2 characters"),
    email: z.email("Enter a valid email"),
    bio: z.string().max(200, "Bio must be 200 characters or fewer"),
    image: z.string().nullable().optional(),
    banner: z.string().nullable().optional(),
  })
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Nothing to update",
  });
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: passwordPolicy,
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

const prioritySchema = z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]);
export type Priority = z.infer<typeof prioritySchema>;

export const createTaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(120, "Title too long"),
  description: z.string().trim().max(5000, "Description too long").optional(),
  priority: prioritySchema.default("MEDIUM"),
  dueDate: z.string().datetime().nullable().optional(),
  effortHours: z.coerce.number().min(0).max(1000).nullable().optional(),
  assigneeId: z.string().nullable().optional(),
  labelIds: z.array(z.string()).default([]),
  image: z.string().nullable().optional(),
});
export type CreateTaskInput = z.infer<typeof createTaskSchema>;

export const updateTaskSchema = createTaskSchema
  .partial()
  .extend({ done: z.boolean().optional() });
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;

export const labelSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(30, "Name too long"),
  color: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, "Invalid color")
    .default("#6366f1"),
});
export type LabelInput = z.infer<typeof labelSchema>;
