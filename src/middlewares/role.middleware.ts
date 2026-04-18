import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware";
import { BaseError } from "../utils/error-handler/base_error";
import { Role } from "../enums/role.enum";

export const roleMiddleware = (roles: Role[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        const user = req.user;

        if (!user) {
            return next(BaseError.UnauthorizedError());
        }

        if (!roles.includes(user.role as Role)) {
            return next(BaseError.Forbidden("You don't have permission to access this resource"));
        }

        next();
    };
};