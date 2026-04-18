import { Router } from "express";
import { validate } from "../middlewares/validator.middleware";
import {
  registerSchema,
  loginSchema,
} from "../validators/user.validator";
import * as controller from "../controllers/auth.controller";

const router = Router();

router.post("/register", validate(registerSchema), controller.register);
router.post("/login", validate(loginSchema), controller.login);

export default router;
