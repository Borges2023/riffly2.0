import { playableSongsArray } from "../../../database/songs.js";

export const normalizeSong = (song, index = 0) => ({
  ...song,
  _id: song._id ?? song.id ?? `song-${index + 1}`,
  id: song.id ?? song._id ?? index + 1,
  streamUrl: song.streamUrl ?? song.audio ?? song.audioFallback ?? "",
  audio: song.audio ?? song.streamUrl ?? song.audioFallback ?? "",
  audioFallback: song.audioFallback ?? song.audio ?? song.streamUrl ?? "",
});

export const fallbackSongs = playableSongsArray.map(normalizeSong);

export const fallbackArtists = Array.from(
  new Map(
    fallbackSongs.map((song, index) => [
      song.artist,
      {
        _id: `artist-${index + 1}`,
        id: index + 1,
        name: song.artist,
        artist: song.artist,
        image: song.image,
        banner: song.image,
      },
    ])
  ).values()
);
