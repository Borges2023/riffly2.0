import express from "express";
import { adminController } from "../controllers/adminController.js";
import { verifyAdminToken } from "../middlewares/auth.js";

const router = express.Router();

router.post("/login", adminController.login);
router.post("/refresh", adminController.refresh);
router.post("/logout", adminController.logout);
router.get("/users", verifyAdminToken, adminController.users);
router.put("/users/:userId/plan", verifyAdminToken, adminController.updatePlan);
router.post("/users/upgrade-all", verifyAdminToken, adminController.upgradeAll);
router.post("/users/promote", verifyAdminToken, adminController.promote);
router.get("/credentials", verifyAdminToken, adminController.credentials);

export default router;
