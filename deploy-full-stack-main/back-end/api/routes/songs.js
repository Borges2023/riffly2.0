import express from "express";
import { db } from "../connect.js";

const router = express.Router();

// GET /api/songs - Listar todas as músicas
router.get("/", async (req, res) => {
  try {
    const songs = await db.collection("songs").find({}).toArray();
    res.status(200).json(songs);
  } catch (error) {
    console.error("Erro ao buscar músicas:", error);
    res.status(500).json({ error: "Erro ao buscar músicas" });
  }
});

// GET /api/songs/:id - Buscar música por ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    // Validar se o ID é válido (ObjectId do MongoDB)
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: "ID inválido" });
    }
    const song = await db.collection("songs").findOne({ _id: new (await import("mongodb")).ObjectId(id) });
    
    if (!song) {
      return res.status(404).json({ error: "Música não encontrada" });
    }
    
    res.status(200).json(song);
  } catch (error) {
    console.error("Erro ao buscar música:", error);
    res.status(500).json({ error: "Erro ao buscar música" });
  }
});

export default router;
