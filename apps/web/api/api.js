import axios from "axios";

const URL = import.meta.env.VITE_API_URL || "https://deploy-jornada-full-stack.onrender.com/api";

export async function fetchArtists() {
  const res = await axios.get(`${URL}/artists`);
  return res.data;
}

export async function fetchSongs() {
  const res = await axios.get(`${URL}/songs`);
  return res.data;
}
