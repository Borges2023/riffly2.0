import { adminRepository } from "../repositories/adminRepository.js";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/jwt.js";

const ADMIN_CREDENTIALS = {
  username: "admin_riffly",
  password: "RifflyAdmin@2024",
};

const refreshTokens = new Set();

const buildAdminPayload = () => ({ username: ADMIN_CREDENTIALS.username, role: "admin" });

export const adminService = {
  credentials: ADMIN_CREDENTIALS,
  login: ({ username, password }) => {
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      const admin = buildAdminPayload();
      const token = generateAccessToken(admin);
      const refreshToken = generateRefreshToken(admin);
      refreshTokens.add(refreshToken);
      return {
        success: true,
        message: "Login bem-sucedido",
        token,
        refreshToken,
        admin,
      };
    }
    const error = new Error("Credenciais inválidas");
    error.statusCode = 401;
    throw error;
  },
  refresh: (refreshToken) => {
    if (!refreshToken || !refreshTokens.has(refreshToken)) {
      const error = new Error("Refresh token inválido ou expirado");
      error.statusCode = 401;
      throw error;
    }

    try {
      const payload = verifyRefreshToken(refreshToken);
      const token = generateAccessToken({ username: payload.username, role: payload.role });
      return { success: true, token, admin: payload };
    } catch (err) {
      refreshTokens.delete(refreshToken);
      const error = new Error("Refresh token inválido ou expirado");
      error.statusCode = 401;
      throw error;
    }
  },
  logout: (refreshToken) => {
    if (refreshToken) {
      refreshTokens.delete(refreshToken);
    }
    return { success: true, message: "Logout realizado" };
  },
  listUsers: async () => adminRepository.findUsers(),
  changePlan: async (userId, plan) => {
    if (!["free", "premium"].includes(plan)) {
      const error = new Error("Plano inválido");
      error.statusCode = 400;
      throw error;
    }
    return adminRepository.updateUserPlan(userId, plan);
  },
  upgradeAll: () => adminRepository.upgradeAllUsers(),
  promote: async (email) => {
    if (!email) {
      const error = new Error("Email é obrigatório");
      error.statusCode = 400;
      throw error;
    }
    return adminRepository.promoteUserByEmail(email);
  },
};
