import express from "express";
import { ObjectId } from "mongodb";
import { db } from "../connect.js";

const router = express.Router();

const now = () => new Date().toISOString();

const seedPlaylists = [
  {
    id: "weekly-ranking",
    name: "Ranking semanal",
    description: "As musicas mais tocadas da semana no Riffly.",
    mood: "trending",
    songIds: [1, 2, 3, 4, 5],
    followers: 12840,
  },
  {
    id: "discoveries",
    name: "Descobertas",
    description: "Novidades e artistas em crescimento para voce conhecer.",
    mood: "discovery",
    songIds: [6, 7, 8, 9, 10],
    followers: 8320,
  },
  {
    id: "karaoke-night",
    name: "Karaoke sincronizado",
    description: "Faixas com letras sincronizadas e modo karaoque.",
    mood: "karaoke",
    songIds: [1, 3, 5, 7, 9],
    followers: 5940,
  },
];

const seedShows = [
  {
    id: "podcast-produtores",
    type: "podcast",
    title: "Dentro do Beat",
    host: "Riffly Studios",
    category: "Musica e carreira",
    duration: "42 min",
    episodes: 18,
  },
  {
    id: "audiobook-artista",
    type: "audiobook",
    title: "Manual do Artista Independente",
    host: "Riffly Audio",
    category: "Educacao",
    duration: "5 h 20 min",
    episodes: 12,
  },
  {
    id: "radio-trending",
    type: "radio",
    title: "Radio Trending Brasil",
    host: "Ao vivo",
    category: "Hits, funk e sertanejo",
    duration: "24/7",
    episodes: 1,
  },
];

const seedFeatureMatrix = [
  "Login social",
  "Upload de musicas",
  "Upload de capas",
  "Player profissional",
  "Playlists",
  "Favoritos",
  "Historico",
  "Busca",
  "Letras sincronizadas",
  "Karaoke",
  "Podcasts",
  "Audiobooks",
  "Radio online",
  "Download offline",
  "Chromecast",
  "Android Auto",
  "Apple CarPlay",
  "Equalizador",
  "Compartilhamento",
  "Comentarios",
  "Seguir artistas",
  "Notificacoes",
  "Estatisticas",
  "Painel admin",
  "API documentada",
  "IA para recomendacoes",
];

const collection = (name) => db.collection(name);

router.get("/overview", async (req, res) => {
  try {
    const [uploads, comments, follows, events] = await Promise.all([
      collection("platform_uploads").find({}).sort({ createdAt: -1 }).limit(20).toArray(),
      collection("platform_comments").find({}).sort({ createdAt: -1 }).limit(20).toArray(),
      collection("platform_follows").find({}).sort({ createdAt: -1 }).limit(20).toArray(),
      collection("platform_events").find({}).sort({ createdAt: -1 }).limit(100).toArray(),
    ]);

    const plays = events.filter((event) => event.type === "play").length;
    const downloads = events.filter((event) => event.type === "offline_download").length;
    const shares = events.filter((event) => event.type === "share").length;

    res.status(200).json({
      generatedAt: now(),
      features: seedFeatureMatrix,
      playlists: seedPlaylists,
      shows: seedShows,
      uploads,
      comments,
      follows,
      stats: {
        plays,
        downloads,
        shares,
        uploads: uploads.length,
        comments: comments.length,
        followers: follows.length,
        activeListeners: Math.max(2400, plays * 12 + 2400),
      },
      realtime: events.slice(0, 8),
    });
  } catch (error) {
    console.error("Erro no overview da plataforma:", error);
    res.status(500).json({ error: "Erro ao carregar plataforma" });
  }
});

router.post("/upload", async (req, res) => {
  try {
    const { title, artist, genre, audioUrl, coverUrl, lyrics } = req.body;

    if (!title || !artist) {
      return res.status(400).json({ error: "Titulo e artista sao obrigatorios" });
    }

    const upload = {
      title,
      artist,
      genre: genre || "Independente",
      audioUrl: audioUrl || "",
      coverUrl: coverUrl || "",
      lyrics: lyrics || "",
      status: "processing",
      pipeline: ["upload", "ffmpeg-transcode", "cover-optimization", "moderation"],
      createdAt: now(),
    };

    const result = await collection("platform_uploads").insertOne(upload);
    await collection("platform_events").insertOne({
      type: "upload",
      label: `${artist} enviou ${title}`,
      createdAt: now(),
    });

    res.status(201).json({ ...upload, _id: result.insertedId });
  } catch (error) {
    console.error("Erro no upload:", error);
    res.status(500).json({ error: "Erro ao registrar upload" });
  }
});

router.post("/events", async (req, res) => {
  try {
    const { type, label, songId, metadata } = req.body;

    if (!type) {
      return res.status(400).json({ error: "Tipo do evento e obrigatorio" });
    }

    const event = {
      type,
      label: label || type,
      songId: songId || null,
      metadata: metadata || {},
      createdAt: now(),
    };

    const result = await collection("platform_events").insertOne(event);
    res.status(201).json({ ...event, _id: result.insertedId });
  } catch (error) {
    console.error("Erro ao registrar evento:", error);
    res.status(500).json({ error: "Erro ao registrar evento" });
  }
});

router.post("/comments", async (req, res) => {
  try {
    const { songId, author, text } = req.body;

    if (!songId || !text) {
      return res.status(400).json({ error: "Musica e comentario sao obrigatorios" });
    }

    const comment = {
      songId,
      author: author || "Ouvinte Riffly",
      text,
      createdAt: now(),
    };

    const result = await collection("platform_comments").insertOne(comment);
    res.status(201).json({ ...comment, _id: result.insertedId });
  } catch (error) {
    console.error("Erro ao comentar:", error);
    res.status(500).json({ error: "Erro ao comentar" });
  }
});

router.post("/follow", async (req, res) => {
  try {
    const { artist, userId } = req.body;

    if (!artist) {
      return res.status(400).json({ error: "Artista e obrigatorio" });
    }

    const follow = {
      artist,
      userId: userId || "demo-user",
      verifiedArtist: true,
      createdAt: now(),
    };

    await collection("platform_follows").updateOne(
      { artist: follow.artist, userId: follow.userId },
      { $set: follow },
      { upsert: true }
    );

    res.status(201).json(follow);
  } catch (error) {
    console.error("Erro ao seguir artista:", error);
    res.status(500).json({ error: "Erro ao seguir artista" });
  }
});

router.get("/docs", (req, res) => {
  res.status(200).json({
    title: "Riffly Platform API",
    version: "2.0-demo",
    swaggerReady: true,
    endpoints: [
      "GET /api/platform/overview",
      "POST /api/platform/upload",
      "POST /api/platform/events",
      "POST /api/platform/comments",
      "POST /api/platform/follow",
      "GET /api/platform/docs",
    ],
  });
});

router.delete("/events/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "ID invalido" });
    }

    await collection("platform_events").deleteOne({ _id: new ObjectId(id) });
    res.status(204).send();
  } catch (error) {
    console.error("Erro ao remover evento:", error);
    res.status(500).json({ error: "Erro ao remover evento" });
  }
});

export default router;
