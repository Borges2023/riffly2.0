import { MongoClient } from "mongodb";

const URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME || "spotifyAula";

if (!URI) throw new Error("MONGODB_URI não está definida");

const client = new MongoClient(URI);

let db;
async function connectDB() {
  await client.connect();
  db = client.db(DB_NAME);
  console.log("✅ MongoDB conectado");
}

connectDB().catch(console.error);

export { db, connectDB };
