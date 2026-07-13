import { ObjectId } from "mongodb";
import { db } from "../connect.js";
import { fallbackSongs, normalizeSong } from "../utils/catalog.js";

const collection = () => db.collection("songs");

export const songsRepository = {
  async findAll() {
    try {
      const songs = await collection().find({}).toArray();
      return songs.length > 0 ? songs.map(normalizeSong) : fallbackSongs;
    } catch {
      return fallbackSongs;
    }
  },
  async findById(id) {
    try {
      if (!ObjectId.isValid(id)) {
        return fallbackSongs.find((item) => item._id === id || String(item.id) === String(id)) ?? null;
      }
      const song = await collection().findOne({ _id: new ObjectId(id) });
      return song ? normalizeSong(song) : null;
    } catch {
      return fallbackSongs.find((item) => item._id === id || String(item.id) === String(id)) ?? null;
    }
  },
  async create(payload) {
    const result = await collection().insertOne({
      ...payload,
      createdAt: new Date().toISOString(),
    });
    return result.insertedId;
  },
};
