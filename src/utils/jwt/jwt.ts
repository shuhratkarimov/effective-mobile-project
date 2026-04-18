import jwt, { SignOptions } from "jsonwebtoken";
import config from "./jwt-config";
import { Role } from "../../enums/role.enum";

export interface AuthPayload {
  userId: string;
  role: Role;
}

export const signAccessToken = (payload: AuthPayload) => {
  return jwt.sign(payload, config.jwt.secret as string, {
    expiresIn: config.jwt.expiresIn as SignOptions["expiresIn"],
  });
};

export const signRefreshToken = (payload: AuthPayload) => {
  return jwt.sign(payload, config.refresh.secret as string, {
    expiresIn: config.refresh.expiresIn as SignOptions["expiresIn"],
  });
};

export const verifyAccessToken = <T = AuthPayload>(token: string) => {
  return jwt.verify(token, config.jwt.secret as string) as T;
};

export const verifyRefreshToken = <T = AuthPayload>(token: string) => {
  return jwt.verify(token, config.refresh.secret as string) as T;
};