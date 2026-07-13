import { playableSongsArray as sourceSongs } from "./songs.js";
import { sampleArtists } from "./mockData.js";

const normalizeItemIds = (items) =>
  items.map((item, index) => ({
    ...item,
    _id: item._id ?? item.id ?? `item-${index + 1}`,
    id: item.id ?? item._id ?? index + 1,
  }));

const getStoredData = () => {
  return { artists: normalizeItemIds(sampleArtists), songs: normalizeItemIds(sourceSongs) };
};

export const getArtists = () => {
  const fallback = getStoredData();
  return fallback.artists;
};

export const getSongs = () => {
  const fallback = getStoredData();
  return fallback.songs;
};

export const normalizeCatalogItems = (items) => normalizeItemIds(items);

export const persistFallbackData = (artists, songs) => {
  if (typeof window !== "undefined") {
    window.localStorage.setItem("riffly-data", JSON.stringify({ artists, songs }));
  }
};
