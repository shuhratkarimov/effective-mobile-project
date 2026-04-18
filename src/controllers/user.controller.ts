import { AuthRequest } from "../middlewares/auth.middleware";
import { Request, Response, NextFunction } from "express";
import * as userService from "../services/user.service";
import { BaseError } from "../utils/error-handler/base_error";
import { Role } from "@prisma/client";
import { paginationQuerySchema, userIdParamSchema } from "../dto/user.query.dto";

export const getUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = userIdParamSchema.parse(req.params);
        const user = await userService.findById(id);
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (error) {
        return next(error);
    }
};

export const getAllUsers = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { page, limit } = paginationQuerySchema.parse(req.query);

        const { users, totalCount } = await userService.getUsers(page, limit);

        res.json({
            success: true,
            data: users,
            meta: {
                total: totalCount,
                page,
                limit,
                totalPages: Math.ceil(totalCount / limit)
            }
        });
    } catch (error) {
        return next(error);
    }
};

export const block = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = userIdParamSchema.parse(req.params);
        const currentUser = req.user;

        if (!currentUser) throw BaseError.UnauthorizedError();

        const isAdmin = currentUser.role === Role.ADMIN;
        const isSelf = currentUser.userId === id;

        if (isAdmin && isSelf) {
            throw BaseError.Forbidden("Admin cannot block themselves!");
        }

        if (!isAdmin && !isSelf) {
            throw BaseError.Forbidden("Users can only block themselves!");
        }

        const user = await userService.blockUser(id);

        if (!user) throw BaseError.NotFound("User not found");

        if (isSelf) {
            res.clearCookie("accessToken");
            res.clearCookie("refreshToken");
        }

        res.json({
            success: true,
            message: "User blocked successfully",
            data: user
        });
    } catch (error) {
        next(error);
    }
};
