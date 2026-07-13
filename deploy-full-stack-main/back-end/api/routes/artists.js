import express from "express";
import { db } from "../connect.js";

const router = express.Router();

// GET /api/artists - Listar todos os artistas
router.get("/", async (req, res) => {
  try {
    const artists = await db.collection("artists").find({}).toArray();
    res.status(200).json(artists);
  } catch (error) {
    console.error("Erro ao buscar artistas:", error);
    res.status(500).json({ error: "Erro ao buscar artistas" });
  }
});

// GET /api/artists/:id - Buscar artista por ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    // Validar se o ID é válido (ObjectId do MongoDB)
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: "ID inválido" });
    }
    const artist = await db.collection("artists").findOne({ _id: new (await import("mongodb")).ObjectId(id) });
    
    if (!artist) {
      return res.status(404).json({ error: "Artista não encontrado" });
    }
    
    res.status(200).json(artist);
  } catch (error) {
    console.error("Erro ao buscar artista:", error);
    res.status(500).json({ error: "Erro ao buscar artista" });
  }
});

export default router;
