import { z } from "zod";

export const userIdParamSchema = z.object({
  id: z.uuid({ message: "Invalid user id" }),
});

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

export type UserIdParamDto = z.infer<typeof userIdParamSchema>;
export type PaginationQueryDto = z.infer<typeof paginationQuerySchema>;
