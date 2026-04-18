import { Router } from "express";
import * as controller from "../controllers/user.controller";
import authMiddleware from "../middlewares/auth.middleware";
import { roleMiddleware } from "../middlewares/role.middleware";
import { Role } from "../enums/role.enum";

const router = Router();

router.get("/:id", authMiddleware, controller.getUser);
router.get("/", authMiddleware, roleMiddleware([Role.ADMIN]), controller.getAllUsers);
router.patch("/block/:id", authMiddleware, controller.block);
 
export default router;
