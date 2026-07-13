import express from "express";
import { songsController } from "../controllers/songsController.js";

const router = express.Router();

router.get("/", songsController.list);
router.get("/:id", songsController.getById);
router.post("/", songsController.create);

export default router;
