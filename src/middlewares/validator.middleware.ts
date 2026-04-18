import z from "zod";
import { Request, Response, NextFunction } from "express";

export const validate =
    (schema: z.ZodTypeAny) =>
        (req: Request, res: Response, next: NextFunction) => {
            try {
                req.body = schema.parse(req.body);
                next();
            } catch (e: any) {
                return next(e);
            }
        };