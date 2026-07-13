const isHttpUrl = (value) => typeof value === "string" && /^https?:\/\//i.test(value);

const supportsNativeDash = () => typeof window !== "undefined" && typeof window.MediaSource !== "undefined";

export const getStreamingSources = (song) => {
  const sources = [];

  if (song?.hlsManifestUrl) sources.push(song.hlsManifestUrl);
  if (song?.dashManifestUrl) sources.push(song.dashManifestUrl);
  if (song?.streamUrl) sources.push(song.streamUrl);
  if (song?.audio) sources.push(song.audio);
  if (song?.audioFallback) sources.push(song.audioFallback);

  return Array.from(new Set(sources)).filter(isHttpUrl);
};

export const getBestAudioSource = (song) => getStreamingSources(song)[0] || "";

export const getPreferredStreamSource = (song) => {
  if (!song) return "";
  if (song.hlsManifestUrl && supportsNativeHls()) return song.hlsManifestUrl;
  if (song.dashManifestUrl && supportsNativeDash()) return song.dashManifestUrl;
  return getBestAudioSource(song);
};

export const getNextPreloadSource = (songs = [], currentSong) => {
  if (!songs.length || !currentSong) return "";

  const currentIndex = songs.findIndex(
    (song) => song?._id === currentSong?._id || String(song?.id) === String(currentSong?.id)
  );

  const nextSong = songs[(currentIndex + 1) % songs.length];
  return getBestAudioSource(nextSong);
};

export const supportsNativeHls = () => {
  if (typeof document === "undefined") return false;
  const video = document.createElement("video");
  return Boolean(video.canPlayType("application/vnd.apple.mpegurl"));
};
