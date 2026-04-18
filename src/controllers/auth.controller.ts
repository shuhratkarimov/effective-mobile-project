import { NextFunction } from "express";
import * as userService from "../services/user.service";
import bcrypt from "bcrypt";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../utils/jwt/jwt";
import { Role } from "../enums/role.enum";
import { Request, Response } from "express";
import { BaseError } from "../utils/error-handler/base_error";
import {
    LoginDto,
    LoginResponseDto,
    RegisterDto,
    RegisterResponseDto
} from "../dto/auth.dto";

const isSecure = process.env.NODE_ENV === "production";

const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await userService.createUser(req.body as RegisterDto);
        const response: RegisterResponseDto = {
            success: true,
            message: "User successfully registered.",
            requiresVerification: true,
            user: {
                id: user.id,
                email: user.email,
                fullName: user.fullName
            }
        };
        res.status(201).json(response);
    } catch (error) {
        next(error);
    }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body as LoginDto;
        const user = await userService.findByEmail(email);

        if (!user) throw BaseError.NotFound("User not found");

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw BaseError.BadRequest("Wrong password");

        if (!user.isActive) {
            throw BaseError.Forbidden("Your account is blocked, please contact the administrator");
        }

        const payload = { userId: user.id, role: user.role as Role };
        const accessToken = signAccessToken(payload);
        const refreshToken = signRefreshToken(payload);

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: isSecure,
            sameSite: isSecure ? "strict" : "lax",
            maxAge: 15 * 60 * 1000,
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: isSecure,
            sameSite: isSecure ? "strict" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        const response: LoginResponseDto = {
            success: true,
            message: "User successfully logged in",
            user: {
                id: user.id,
                email: user.email,
                fullName: user.fullName,
                role: user.role as Role
            }
        };

        res.json(response);
    } catch (error) {
        next(error);
    }
};

export { register, login };
