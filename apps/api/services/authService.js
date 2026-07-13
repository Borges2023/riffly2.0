import { usersRepository } from "../repositories/usersRepository.js";
import bcrypt from "bcryptjs";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/jwt.js";
import redisClient, { connectRedis } from "../redisClient.js";

const REFRESH_KEY_PREFIX = "refresh:";

export const authService = {
  async register({ name, email, password }) {
    const existing = await usersRepository.findByEmail(email);
    if (existing) {
      const err = new Error("Email já cadastrado");
      err.statusCode = 400;
      throw err;
    }
    const hash = await bcrypt.hash(password, 10);
    const userId = await usersRepository.createUser({ name, email, passwordHash: hash, plan: "free" });
    return { success: true, userId };
  },

  async login({ email, password }) {
    const user = await usersRepository.findByEmail(email);
    if (!user) {
      const err = new Error("Credenciais inválidas");
      err.statusCode = 401;
      throw err;
    }
    const match = await bcrypt.compare(password, user.passwordHash || "");
    if (!match) {
      const err = new Error("Credenciais inválidas");
      err.statusCode = 401;
      throw err;
    }

    const payload = { id: user._id?.toString ? user._id.toString() : user._id, email: user.email, name: user.name };
    const token = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    await connectRedis();
    await redisClient.set(REFRESH_KEY_PREFIX + refreshToken, JSON.stringify(payload), { EX: 30 * 24 * 3600 });

    return { success: true, token, refreshToken, user: { id: payload.id, email: payload.email, name: payload.name } };
  },

  async refresh(refreshToken) {
    if (!refreshToken) {
      const err = new Error("Refresh token é obrigatório");
      err.statusCode = 401;
      throw err;
    }
    await connectRedis();
    const key = REFRESH_KEY_PREFIX + refreshToken;
    const exists = await redisClient.exists(key);
    if (!exists) {
      const err = new Error("Refresh token inválido ou expirado");
      err.statusCode = 401;
      throw err;
    }

    let payload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch (err) {
      await redisClient.del(key);
      const error = new Error("Refresh token inválido ou expirado");
      error.statusCode = 401;
      throw error;
    }

    const token = generateAccessToken({ id: payload.id, email: payload.email, name: payload.name });
    return { success: true, token };
  },

  async logout(refreshToken) {
    if (!refreshToken) return { success: true };
    await connectRedis();
    await redisClient.del(REFRESH_KEY_PREFIX + refreshToken);
    return { success: true };
  },
};
