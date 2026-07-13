import { artistsService } from "../services/artistsService.js";

export const artistsController = {
  list: async (req, res) => res.status(200).json(await artistsService.list()),
  getById: async (req, res) => {
    const artist = await artistsService.getById(req.params.id);
    if (!artist) return res.status(404).json({ error: "Artista não encontrado" });
    return res.status(200).json(artist);
  },
};
