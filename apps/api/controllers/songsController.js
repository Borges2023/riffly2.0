import { songsService } from "../services/songsService.js";

export const songsController = {
  list: async (req, res) => res.status(200).json(await songsService.list()),
  getById: async (req, res) => {
    const song = await songsService.getById(req.params.id);
    if (!song) return res.status(404).json({ error: "Música não encontrada" });
    return res.status(200).json(song);
  },
  create: async (req, res) => {
    try {
      const song = await songsService.create(req.body);
      return res.status(201).json(song);
    } catch (error) {
      return res.status(error.statusCode || 500).json({ error: error.message || "Erro ao cadastrar música" });
    }
  },
};
