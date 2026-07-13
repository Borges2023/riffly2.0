import jwt from "jsonwebtoken";

const ACCESS_SECRET = process.env.JWT_SECRET || "riffly-secret-2026";
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "riffly-refresh-2026";
const ACCESS_EXPIRES_IN = "20m";
const REFRESH_EXPIRES_IN = "30d";

export const generateAccessToken = (payload) => {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRES_IN });
};

export const generateRefreshToken = (payload) => {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES_IN });
};

export const verifyAccessToken = (token) => {
  return jwt.verify(token, ACCESS_SECRET);
};

export const verifyRefreshToken = (token) => {
  return jwt.verify(token, REFRESH_SECRET);
};
