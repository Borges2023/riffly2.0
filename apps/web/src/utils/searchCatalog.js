import { normalizeCatalogItems } from "../../../../database/apiFallback.js";

const normalizeText = (value) =>
  String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

const splitQuery = (query) =>
  normalizeText(query)
    .replace(/[^\w\s-]/g, " ")
    .split(/\s+/)
    .filter(Boolean);

const matchScore = (text, tokens) => {
  const normalized = normalizeText(text);
  if (!tokens.length) return 0;

  return tokens.reduce((score, token) => {
    if (!token) return score;
    if (normalized.includes(token)) return score + 2;
    return score;
  }, 0);
};

const typeWeight = (item, tokens) => {
  const joined = normalizeText(
    [
      item.name,
      item.artist,
      item.genre,
      item.album,
      item.playlist,
      item.username,
      item.user,
      item.type,
      item.category,
    ]
      .filter(Boolean)
      .join(" "),
  );

  let score = matchScore(joined, tokens);

  if (tokens.some((token) => ["artista", "artist"].includes(token)) && item.artist) score += 4;
  if (tokens.some((token) => ["musica", "música", "song", "faixa"].includes(token)) && item.name) score += 4;
  if (tokens.some((token) => ["album", "álbum"].includes(token)) && item.album) score += 4;
  if (tokens.some((token) => ["genero", "gênero", "genre"].includes(token)) && item.genre) score += 4;
  if (tokens.some((token) => ["playlist", "listas"].includes(token)) && item.playlist) score += 4;
  if (tokens.some((token) => ["usuario", "usuário", "user"].includes(token)) && (item.username || item.user)) score += 4;

  return score;
};

export const buildSearchSuggestions = (songs = [], artists = []) => {
  const songSuggestions = songs.slice(0, 6).map((song) => song.name);
  const artistSuggestions = artists.slice(0, 6).map((artist) => artist.name);
  return [...new Set([...songSuggestions, ...artistSuggestions])].slice(0, 8);
};

export const searchCatalog = ({ query, songs = [], artists = [], playlists = [], users = [], albums = [] }) => {
  const normalizedSongs = normalizeCatalogItems(songs);
  const normalizedArtists = normalizeCatalogItems(artists);
  const normalizedPlaylists = normalizeCatalogItems(playlists);
  const normalizedUsers = normalizeCatalogItems(users);
  const normalizedAlbums = normalizeCatalogItems(albums);
  const tokens = splitQuery(query);

  const ranked = [
    ...normalizedSongs.map((item) => ({ ...item, kind: "song", score: typeWeight(item, tokens) })),
    ...normalizedArtists.map((item) => ({ ...item, kind: "artist", score: typeWeight(item, tokens) })),
    ...normalizedPlaylists.map((item) => ({ ...item, kind: "playlist", score: typeWeight(item, tokens) })),
    ...normalizedUsers.map((item) => ({ ...item, kind: "user", score: typeWeight(item, tokens) })),
    ...normalizedAlbums.map((item) => ({ ...item, kind: "album", score: typeWeight(item, tokens) })),
  ];

  return ranked
    .filter((item) => !tokens.length || item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 24);
};

export const getSearchTypes = () => [
  { label: "Artistas", value: "artist" },
  { label: "Albuns", value: "album" },
  { label: "Musicas", value: "song" },
  { label: "Generos", value: "genre" },
  { label: "Playlists", value: "playlist" },
  { label: "Usuarios", value: "user" },
];
