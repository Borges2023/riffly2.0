import { ObjectId } from "mongodb";
import { db } from "../connect.js";

const collection = (name) => db.collection(name);

export const platformRepository = {
  async getOverview() {
    const [uploads, comments, follows, events] = await Promise.all([
      collection("platform_uploads").find({}).sort({ createdAt: -1 }).limit(20).toArray(),
      collection("platform_comments").find({}).sort({ createdAt: -1 }).limit(20).toArray(),
      collection("platform_follows").find({}).sort({ createdAt: -1 }).limit(20).toArray(),
      collection("platform_events").find({}).sort({ createdAt: -1 }).limit(100).toArray(),
    ]);

    return { uploads, comments, follows, events };
  },
  async createUpload(upload) {
    return collection("platform_uploads").insertOne(upload);
  },
  async createEvent(event) {
    return collection("platform_events").insertOne(event);
  },
  async createComment(comment) {
    return collection("platform_comments").insertOne(comment);
  },
  async upsertFollow(follow) {
    return collection("platform_follows").updateOne(
      { artist: follow.artist, userId: follow.userId },
      { $set: follow },
      { upsert: true }
    );
  },
  async deleteEvent(id) {
    return collection("platform_events").deleteOne({ _id: new ObjectId(id) });
  },
};
