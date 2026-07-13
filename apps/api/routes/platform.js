import express from "express";
import { platformController } from "../controllers/platformController.js";

const router = express.Router();

router.get("/overview", platformController.overview);
router.post("/upload", platformController.upload);
router.post("/events", platformController.event);
router.post("/comments", platformController.comment);
router.post("/follow", platformController.follow);
router.get("/docs", platformController.docs);
router.delete("/events/:id", platformController.deleteEvent);

export default router;
