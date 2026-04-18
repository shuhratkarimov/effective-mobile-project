import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt/jwt";
import { AuthPayload } from "../utils/jwt/jwt";
import { BaseError } from "../utils/error-handler/base_error";
import { findActiveUserById } from "../services/user.service";

export interface AuthRequest extends Request {
    user?: AuthPayload;
}

const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.cookies.accessToken;

    if (!token) return next(BaseError.UnauthorizedError());

    try {
        const decoded = verifyAccessToken(token);
        const user = await findActiveUserById(decoded.userId);

        if (!user) {
            res.clearCookie("accessToken");
            res.clearCookie("refreshToken");
            return next(BaseError.Forbidden("Your account is blocked"));
        }

        req.user = decoded;
        next();
    } catch (err) {
        next(err);
    }
};

export default authMiddleware;
