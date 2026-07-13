import { db } from "../connect.js";
import { ObjectId } from "mongodb";

const collection = () => db.collection("users");

export const usersRepository = {
  async findByEmail(email) {
    return collection().findOne({ email });
  },
  async findById(id) {
    try {
      return collection().findOne({ _id: new ObjectId(id) });
    } catch {
      return null;
    }
  },
  async createUser(payload) {
    const now = new Date().toISOString();
    const doc = { ...payload, createdAt: now, updatedAt: now };
    const result = await collection().insertOne(doc);
    return result.insertedId;
  },
};
