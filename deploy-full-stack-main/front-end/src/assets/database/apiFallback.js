import { sampleArtists, sampleSongs } from "./mockData";

const getStoredData = () => {
  if (typeof window !== "undefined") {
    try {
      const stored = window.localStorage.getItem("riffly-data");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.artists && parsed.songs) {
          return parsed;
        }
      }
    } catch (error) {
      console.warn("Falha ao ler dados locais", error);
    }
  }
  return { artists: sampleArtists, songs: sampleSongs };
};

export const getArtists = () => {
  const fallback = getStoredData();
  return fallback.artists;
};

export const getSongs = () => {
  const fallback = getStoredData();
  return fallback.songs;
};

export const persistFallbackData = (artists, songs) => {
  if (typeof window !== "undefined") {
    window.localStorage.setItem("riffly-data", JSON.stringify({ artists, songs }));
  }
};
