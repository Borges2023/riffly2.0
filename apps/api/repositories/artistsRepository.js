import { ObjectId } from "mongodb";
import { db } from "../connect.js";
import { fallbackArtists } from "../utils/catalog.js";

const collection = () => db.collection("artists");

export const artistsRepository = {
  async findAll() {
    try {
      const artists = await collection().find({}).toArray();
      return artists.length > 0 ? artists : fallbackArtists;
    } catch {
      return fallbackArtists;
    }
  },
  async findById(id) {
    try {
      if (!ObjectId.isValid(id)) {
        return fallbackArtists.find((item) => item._id === id || String(item.id) === String(id)) ?? null;
      }
      const artist = await collection().findOne({ _id: new ObjectId(id) });
      return artist ?? null;
    } catch {
      return fallbackArtists.find((item) => item._id === id || String(item.id) === String(id)) ?? null;
    }
  },
};
