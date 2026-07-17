// connect.js
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log(`✅ MongoDB conectado: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ Erro ao conectar ao MongoDB:", error.message);
    process.exit(1); // encerra a aplicação se não conectar
  }
};

// Executa a conexão imediatamente
connectDB();

// Exporta a instância para ser usada em outros módulos
export { connectDB };
