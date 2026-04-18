import { z } from "zod";

export const UpdateUserSchema = z.object({
    fullName: z.string().min(3).optional(),
    birthDate: z.coerce.date().optional(),
});

export type UpdateUserDto = z.infer<typeof UpdateUserSchema>;

export interface UserResponseDto {
    id: string;
    email: string;
    fullName: string;
    birthDate: Date;
    role: string;
    isActive: boolean;
}

export interface UsersListResponseDto {
    users: Array<Pick<UserResponseDto, "id" | "email" | "fullName" | "role" | "isActive">>;
    totalCount: number;
}
