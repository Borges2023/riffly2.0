import express from "express";
import { artistsController } from "../controllers/artistsController.js";

const router = express.Router();

router.get("/", artistsController.list);
router.get("/:id", artistsController.getById);

export default router;
