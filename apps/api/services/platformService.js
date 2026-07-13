import { platformRepository } from "../repositories/platformRepository.js";

const seedPlaylists = [
  { id: "weekly-ranking", name: "Ranking semanal", description: "As musicas mais tocadas da semana no Riffly.", mood: "trending", songIds: [1, 2, 3, 4, 5], followers: 12840 },
  { id: "discoveries", name: "Descobertas", description: "Novidades e artistas em crescimento para voce conhecer.", mood: "discovery", songIds: [6, 7, 8, 9, 10], followers: 8320 },
  { id: "karaoke-night", name: "Karaoke sincronizado", description: "Faixas com letras sincronizadas e modo karaoque.", mood: "karaoke", songIds: [1, 3, 5, 7, 9], followers: 5940 },
];

const seedShows = [
  { id: "podcast-produtores", type: "podcast", title: "Dentro do Beat", host: "Riffly Studios", category: "Musica e carreira", duration: "42 min", episodes: 18 },
  { id: "audiobook-artista", type: "audiobook", title: "Manual do Artista Independente", host: "Riffly Audio", category: "Educacao", duration: "5 h 20 min", episodes: 12 },
  { id: "radio-trending", type: "radio", title: "Radio Trending Brasil", host: "Ao vivo", category: "Hits, funk e sertanejo", duration: "24/7", episodes: 1 },
];

const seedFeatureMatrix = ["Login social","Upload de musicas","Upload de capas","Player profissional","Playlists","Favoritos","Historico","Busca","Letras sincronizadas","Karaoke","Podcasts","Audiobooks","Radio online","Download offline","Chromecast","Android Auto","Apple CarPlay","Equalizador","Compartilhamento","Comentarios","Seguir artistas","Notificacoes","Estatisticas","Painel admin","API documentada","IA para recomendacoes"];

export const platformService = {
  async overview() {
    const { uploads, comments, follows, events } = await platformRepository.getOverview();
    const plays = events.filter((event) => event.type === "play").length;
    const downloads = events.filter((event) => event.type === "offline_download").length;
    const shares = events.filter((event) => event.type === "share").length;
    return {
      generatedAt: new Date().toISOString(),
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
    };
  },
  upload: (payload) => platformRepository.createUpload(payload),
  event: (payload) => platformRepository.createEvent(payload),
  comment: (payload) => platformRepository.createComment(payload),
  follow: (payload) => platformRepository.upsertFollow(payload),
  deleteEvent: (id) => platformRepository.deleteEvent(id),
};
