// JavaScript Assincrono
// await async
// Fullfilled
import { MongoClient } from "mongodb";

// URI carregada de variáveis de ambiente
const URI = process.env.MONGODB_URI;

const DB_NAME = process.env.DB_NAME || "spotifyAula";

if (!URI) {
  throw new Error("MONGODB_URI não está definida");
}

const client = new MongoClient(URI);

export const db = client.db(DB_NAME);

// Será atualizado com dotenv na v1.1 quando rede estiver disponível
