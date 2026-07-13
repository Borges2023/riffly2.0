// Middleware de tratamento de erros global
export const errorHandler = (err, req, res, next) => {
  console.error("❌ Erro:", {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  const statusCode = err.statusCode || 500;
  const isDevelopment = process.env.NODE_ENV === "development";

  res.status(statusCode).json({
    error: {
      message: err.message || "Erro interno do servidor",
      ...(isDevelopment && { stack: err.stack })
    }
  });
};

// Middleware para log de requisições
export const requestLogger = (req, res, next) => {
  const startTime = Date.now();
  
  res.on("finish", () => {
    const duration = Date.now() - startTime;
    console.log(`📊 [${req.method}] ${req.path} - ${res.statusCode} - ${duration}ms`);
  });
  
  next();
};
