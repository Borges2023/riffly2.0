import { songsRepository } from "../repositories/songsRepository.js";

export const songsService = {
  list: () => songsRepository.findAll(),
  getById: (id) => songsRepository.findById(id),
  create: async (body) => {
    const { name, artist, image = "", duration = "00:00", genre = "Independente", streamUrl, audio, audioFallback, explicit = false, premium = false } = body;
    const finalStreamUrl = streamUrl || audio || audioFallback;
    if (!name || !artist || !finalStreamUrl) {
      const error = new Error("name, artist e streamUrl são obrigatórios");
      error.statusCode = 400;
      throw error;
    }
    const payload = {
      name,
      artist,
      image,
      duration,
      genre,
      explicit: Boolean(explicit),
      premium: Boolean(premium),
      streamUrl: finalStreamUrl,
      audio: audio || finalStreamUrl,
      audioFallback: audioFallback || finalStreamUrl,
    };
    const insertedId = await songsRepository.create(payload);
    return { ...payload, _id: insertedId };
  },
};
