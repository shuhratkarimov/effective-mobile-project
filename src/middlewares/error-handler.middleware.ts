import { Request, Response, NextFunction } from "express";
import { BaseError } from "../utils/error-handler/base_error";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { ZodError } from "zod";

export default function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error("Error Middleware Triggered:", err);

  if (err instanceof BaseError) {
    return res.status(err.status).json({
      success: false,
      message: err.message,
      errors: err.errors || [],
    });
  }

  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: "Validation Error",
      errors: err.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  if (err instanceof JsonWebTokenError) {
    return res.status(401).json({
      success: false,
      message: "Invalid Token",
    });
  }

  if (err instanceof TokenExpiredError) {
    return res.status(401).json({
      success: false,
      message: "Token has expired",
    });
  }

  if (err.status === 403) {
    return res.status(403).json({
      success: false,
      message: "Forbidden: You don't have permission to access this resource",
    });
  }

  if (err.status === 404) {
    return res.status(404).json({
      success: false,
      message: "Resource not found",
    });
  }

  if (err.status === 429) {
    return res.status(429).json({
      success: false,
      message: "Too many requests, please try again later",
    });
  }

  if (err.status === 503) {
    return res.status(503).json({
      success: false,
      message: "Service temporarily unavailable, please try again later",
    });
  }

  if (err.status === 408) {
    return res.status(408).json({
      success: false,
      message: "Request timeout",
    });
  }

  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
    errors: [err.message || "An unexpected error occurred"],
  });
};