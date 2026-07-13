// JavaScript Assincrono
// await async
// Fullfilled
import { MongoClient } from "mongodb";

// URI será carregada de variáveis de ambiente quando dotenv estiver disponível
// Por enquanto, usando .env.example como referência
const URI = process.env.MONGODB_URI || 
  "mongodb+srv://fullstackjornada:qojI71xVU2aV8UKC@cluster0.v1qra.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const DB_NAME = process.env.DB_NAME || "spotifyAula";

if (!URI) {
  throw new Error("MONGODB_URI não está definida");
}

const client = new MongoClient(URI);

export const db = client.db(DB_NAME);

// Será atualizado com dotenv na v1.1 quando rede estiver disponível
