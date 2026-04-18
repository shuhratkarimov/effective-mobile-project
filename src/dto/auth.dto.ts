import { z } from "zod";
import { Role } from "../enums/role.enum";

export const registerSchema = z.object({
  fullName: z.string({ message: "Full name must be at least 3 characters long" }).min(3),
  birthDate: z.coerce
    .date({ message: "Invalid birth date" })
    .max(new Date(), { message: "Birth date cannot be greater than today" })
    .refine((date) => {
      const minDate = new Date();
      minDate.setFullYear(minDate.getFullYear() - 150);
      return date > minDate;
    }, { message: "Birth date cannot be greater than 150 years ago" }),
  email: z.email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[@$!%*?&.]/, {
      message: "Password must contain at least one special character (@, $, !, %, *, ?, &, .)",
    }),
});

export const loginSchema = z.object({
  email: z.email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[@$!%*?&.]/, {
      message: "Password must contain at least one special character (@, $, !, %, *, ?, &, .)",
    }),
});

export const verifyEmailSchema = z.object({
  email: z.email({ message: "Invalid email address" }),
  code: z
    .string()
    .regex(/^\d{6}$/, { message: "Verification code must be 6 digits" }),
});

export type RegisterDto = z.infer<typeof registerSchema>;
export type LoginDto = z.infer<typeof loginSchema>;
export type VerifyEmailDto = z.infer<typeof verifyEmailSchema>;

export interface AuthUserDto {
  id: string;
  email: string;
  fullName?: string;
  role: Role;
  isActive?: boolean;
}

export interface RegisterResponseDto {
  success: true;
  message: string;
  requiresVerification: true;
  user: Pick<AuthUserDto, "id" | "email" | "fullName">;
}

export interface LoginResponseDto {
  success: true;
  message: string;
  user: AuthUserDto;
}
