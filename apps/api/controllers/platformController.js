import { platformService } from "../services/platformService.js";

export const platformController = {
  overview: async (req, res) => res.status(200).json(await platformService.overview()),
  upload: async (req, res) => {
    try {
      const { title, artist, genre, audioUrl, coverUrl, lyrics } = req.body;
      if (!title || !artist) return res.status(400).json({ error: "Titulo e artista sao obrigatorios" });
      const upload = { title, artist, genre: genre || "Independente", audioUrl: audioUrl || "", coverUrl: coverUrl || "", lyrics: lyrics || "", status: "processing", pipeline: ["upload", "ffmpeg-transcode", "cover-optimization", "moderation"], createdAt: new Date().toISOString() };
      const result = await platformService.upload(upload);
      await platformService.event({ type: "upload", label: `${artist} enviou ${title}`, createdAt: new Date().toISOString() });
      return res.status(201).json({ ...upload, _id: result.insertedId });
    } catch (error) {
      return res.status(500).json({ error: "Erro ao registrar upload" });
    }
  },
  event: async (req, res) => {
    try {
      const { type, label, songId, metadata } = req.body;
      if (!type) return res.status(400).json({ error: "Tipo do evento e obrigatorio" });
      const event = { type, label: label || type, songId: songId || null, metadata: metadata || {}, createdAt: new Date().toISOString() };
      const result = await platformService.event(event);
      return res.status(201).json({ ...event, _id: result.insertedId });
    } catch {
      return res.status(500).json({ error: "Erro ao registrar evento" });
    }
  },
  comment: async (req, res) => {
    try {
      const { songId, author, text } = req.body;
      if (!songId || !text) return res.status(400).json({ error: "Musica e comentario sao obrigatorios" });
      const comment = { songId, author: author || "Ouvinte Riffly", text, createdAt: new Date().toISOString() };
      const result = await platformService.comment(comment);
      return res.status(201).json({ ...comment, _id: result.insertedId });
    } catch {
      return res.status(500).json({ error: "Erro ao comentar" });
    }
  },
  follow: async (req, res) => {
    try {
      const { artist, userId } = req.body;
      if (!artist) return res.status(400).json({ error: "Artista e obrigatorio" });
      const follow = { artist, userId: userId || "demo-user", verifiedArtist: true, createdAt: new Date().toISOString() };
      await platformService.follow(follow);
      return res.status(201).json(follow);
    } catch {
      return res.status(500).json({ error: "Erro ao seguir artista" });
    }
  },
  docs: (req, res) => res.status(200).json({ title: "Riffly Platform API", version: "2.0-demo", swaggerReady: true, endpoints: ["GET /api/platform/overview","POST /api/platform/upload","POST /api/platform/events","POST /api/platform/comments","POST /api/platform/follow","GET /api/platform/docs"] }),
  deleteEvent: async (req, res) => {
    try {
      const { id } = req.params;
      await platformService.deleteEvent(id);
      return res.status(204).send();
    } catch {
      return res.status(500).json({ error: "Erro ao remover evento" });
    }
  },
};
