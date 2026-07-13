import { adminService } from "../services/adminService.js";
import { authService } from "../services/authService.js";

export const adminController = {
  login: async (req, res) => {
    try {
      const { username, password } = req.body;
      // allow admin login via adminService for legacy admin users
      if (username && username.startsWith("admin_")) {
        const data = await adminService.login({ username, password });
        return res.json(data);
      }

      // otherwise attempt user login (regular users can become admins via roles)
      const userData = await authService.login({ email: username, password });
      res.json({ ...userData, role: "user" });
    } catch (error) {
      return res.status(error.statusCode || 401).json({ success: false, message: error.message });
    }
  },
  refresh: async (req, res) => {
    try {
      const result = await authService.refresh(req.body.refreshToken);
      return res.json(result);
    } catch (error) {
      return res.status(error.statusCode || 401).json({ success: false, message: error.message });
    }
  },
  logout: async (req, res) => {
    try {
      await authService.logout(req.body.refreshToken);
      return res.json({ success: true, message: "Logout realizado com sucesso." });
    } catch (error) {
      return res.status(error.statusCode || 500).json({ success: false, message: error.message });
    }
  },
  users: async (req, res) => {
    const users = await adminService.listUsers();
    return res.json({
      success: true,
      total: users.length,
      users: users.map((u) => ({ id: u._id, email: u.email, plan: u.plan || "free", createdAt: u.createdAt })),
    });
  },
  updatePlan: async (req, res) => {
    try {
      const result = await adminService.changePlan(req.params.userId, req.body.plan);
      if (result.matchedCount === 0) return res.status(404).json({ error: "Usuário não encontrado" });
      return res.json({ success: true, message: `Plano atualizado para ${req.body.plan}`, userId: req.params.userId, plan: req.body.plan });
    } catch (error) {
      return res.status(error.statusCode || 500).json({ error: error.message });
    }
  },
  upgradeAll: async (req, res) => {
    const result = await adminService.upgradeAll();
    return res.json({ success: true, message: "Todos os usuários foram atualizados para Premium", modifiedCount: result.modifiedCount });
  },
  promote: async (req, res) => {
    try {
      const result = await adminService.promote(req.body.email);
      if (result.matchedCount === 0) return res.status(404).json({ error: "Usuário não encontrado" });
      return res.json({ success: true, message: `Usuário ${req.body.email} promovido para Premium`, email: req.body.email });
    } catch (error) {
      return res.status(error.statusCode || 500).json({ error: error.message });
    }
  },
  credentials: (req, res) => {
    if (process.env.NODE_ENV === "production") return res.status(403).json({ error: "Acesso negado em produção" });
    return res.json({ warning: "APENAS PARA DESENVOLVIMENTO - NÃO COMPARTILHE ESSAS CREDENCIAIS", admin: adminService.credentials });
  },
};
