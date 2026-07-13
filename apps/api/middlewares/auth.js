import { verifyAccessToken } from "../utils/jwt.js";

export const verifyAdminToken = (req, res, next) => {
  const authorization = req.headers.authorization || "";
  const token = authorization.startsWith("Bearer ") ? authorization.split(" ")[1] : null;
  if (!token) {
    return res.status(401).json({ success: false, message: "Token de autenticação não fornecido." });
  }

  try {
    const payload = verifyAccessToken(token);
    req.admin = payload;
    return next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Token inválido ou expirado." });
  }
};
