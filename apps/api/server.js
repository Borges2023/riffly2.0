// API significa Application Programming Interface
// POST, GET, PUT, DELETE
// CRUD - Create Read Update Delete
// Endpoint
// Middleware

import express from "express";
import cors from "cors";
import path from "path";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import fs from "fs";
import dotenv from "dotenv";
import { db } from "./connect.js";
import { errorHandler, requestLogger } from "./middlewares/errorHandler.js";
import artistsRouter from "./routes/artists.js";
import songsRouter from "./routes/songs.js";
import adminRouter from "./routes/admin.js";
import platformRouter from "./routes/platform.js";
import { collectDefaultMetrics, register } from "prom-client";

dotenv.config();

// Configuração
const __dirname = path.resolve();
const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || "development";

// CORS mais flexível para desenvolvimento
let CORS_ORIGIN = process.env.CORS_ORIGIN;
if (!CORS_ORIGIN) {
  // Em desenvolvimento, aceitar múltiplas portas
  if (NODE_ENV === "development") {
  const CORS_ORIGIN = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map(s => s.trim())
  : NODE_ENV === "development"
    ? ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"]
    : ["https://riffly-musical.vercel.app"]; // seu domínio real da Vercel
  }
}

const app = express();

// ✅ MIDDLEWARES DE SEGURANÇA
// CORS configurável por variável de ambiente
app.use(cors({
  origin: CORS_ORIGIN,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(helmet());
app.use(compression());
app.use(mongoSanitize());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Limite de taxa para evitar abusos
app.use(rateLimit({
  windowMs: 1000 * 60,
  max: 150,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Muitas requisições. Tente novamente em alguns segundos.' }
}));

// Middleware de logging
app.use(requestLogger);

// Headers de segurança básicos
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  next();
});

// ✅ ROTAS DE API
app.get("/api/", (request, response) => {
  response.status(200).json({
    message: "Bem-vindo à API Riffly v1.1",
    version: "1.1",
    endpoints: {
      artists: "/api/artists",
      songs: "/api/songs",
      platform: "/api/platform/overview",
      docs: "/api/platform/docs"
    }
  });
});

// ✅ USAR ROTAS MODULARES
app.use("/api/artists", artistsRouter);
app.use("/api/songs", songsRouter);
app.use("/api/admin", adminRouter);
app.use("/api/platform", platformRouter);

// Prometheus metrics collection
collectDefaultMetrics({ timeout: 5000 });

app.get("/metrics", async (req, res) => {
  try {
    res.set("Content-Type", register.contentType);
    res.end(await register.metrics());
  } catch (error) {
    res.status(500).end(error.message);
  }
});

// ✅ SERVIR ARQUIVOS ESTÁTICOS DO FRONTEND QUANDO HOUVER BUILD LOCAL
const frontendDist = path.join(__dirname, "../web/dist");
const frontendIndex = path.join(frontendDist, "index.html");
if (fs.existsSync(frontendIndex)) {
  app.use(express.static(frontendDist));

  // ✅ FALLBACK PARA SPA
  app.get("*", (request, response) => {
    response.sendFile(frontendIndex);
  });
}

// ✅ TRATAMENTO DE ERROS GLOBAL
app.use(errorHandler);

// ✅ INICIAR SERVIDOR
const server = app.listen(PORT, () => {
  console.log(`
🎵 Riffly API v1.1
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Servidor escutando em http://localhost:${PORT}
📡 CORS habilitado para: ${CORS_ORIGIN}
🔒 Ambiente: ${NODE_ENV}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `);
});

// ✅ TRATAMENTO DE SINAIS DE ENCERRAMENTO
process.on("SIGTERM", () => {
  console.log("SIGTERM recebido. Encerrando servidor gracefully...");
  server.close(() => {
    console.log("Servidor encerrado");
    process.exit(0);
  });
});

export { app, server };
