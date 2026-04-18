import rateLimit from 'express-rate-limit';

export const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        success: false,
        status: 429,
        message: "Too many requests from this IP, please try again later.",
        error: "Too Many Requests"
    },
    standardHeaders: true,
    legacyHeaders: false,
});

export const authLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 5,
    message: {
        success: false,
        status: 429,
        message: "Too many login attempts, please try again after a minute.",
        error: "Brute Force Protection"
    },
    standardHeaders: true,
    legacyHeaders: false,
});