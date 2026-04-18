import express from "express";
import dotenv from "dotenv";
dotenv.config();
const PORT = process.env.PORT || 3000;
import cookieParser from "cookie-parser";
import cors from "cors";

import userRoutes from "./routes/user.routes";
import errorMiddleware from "./middlewares/error-handler.middleware";
import authRoutes from "./routes/auth.routes";
import { globalLimiter, authLimiter } from "./middlewares/rateLimiter";
import { BaseError } from "./utils/error-handler/base_error";

const app = express();

app.use(cookieParser());
app.use(express.json());

app.use(cors({
  origin: "*",
  credentials: true,
}));

app.use(globalLimiter);
app.use("/auth", authLimiter, authRoutes);
app.use("/users", userRoutes);
app.use((req, res, next) => {
  next(BaseError.NotFound("Page not found"));
});

app.use(errorMiddleware)

const startServer = async () => {
  app.listen(PORT, () => {
    console.log("Server running on port: " + PORT);
  });
};

startServer().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});
