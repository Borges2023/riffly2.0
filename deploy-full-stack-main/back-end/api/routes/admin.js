import express from 'express';
import { db } from '../connect.js';

const router = express.Router();

// Dados do Admin (em produção, usar banco de dados)
const ADMIN_CREDENTIALS = {
  username: 'admin_riffly',
  password: 'RifflyAdmin@2024',
};

// Middleware para validar token de admin
const validateAdminToken = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token || token !== ADMIN_CREDENTIALS.password) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

// Login Admin
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (
    username === ADMIN_CREDENTIALS.username &&
    password === ADMIN_CREDENTIALS.password
  ) {
    return res.json({
      success: true,
      message: 'Login bem-sucedido',
      token: ADMIN_CREDENTIALS.password,
      admin: {
        username: ADMIN_CREDENTIALS.username,
        role: 'admin',
      },
    });
  }

  res.status(401).json({
    success: false,
    message: 'Credenciais inválidas',
  });
});

// Listar todos os usuários
router.get('/users', validateAdminToken, async (req, res) => {
  try {
    const users = await db.collection('users').find({}).toArray();
    res.json({
      success: true,
      total: users.length,
      users: users.map((u) => ({
        id: u._id,
        email: u.email,
        plan: u.plan || 'free',
        createdAt: u.createdAt,
      })),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Atualizar plano do usuário
router.put('/users/:userId/plan', validateAdminToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const { plan } = req.body;

    if (!['free', 'premium'].includes(plan)) {
      return res.status(400).json({ error: 'Plano inválido' });
    }

    const result = await db.collection('users').updateOne(
      { _id: userId },
      {
        $set: {
          plan,
          updatedAt: new Date(),
          updatedBy: 'admin',
        },
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.json({
      success: true,
      message: `Plano atualizado para ${plan}`,
      userId,
      plan,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Liberar Premium para todo usuário
router.post('/users/upgrade-all', validateAdminToken, async (req, res) => {
  try {
    const result = await db.collection('users').updateMany(
      {},
      {
        $set: {
          plan: 'premium',
          upgradedAt: new Date(),
          upgradedBy: 'admin',
        },
      }
    );

    res.json({
      success: true,
      message: 'Todos os usuários foram atualizados para Premium',
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Liberar Premium para um usuário específico por email
router.post('/users/promote', validateAdminToken, async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email é obrigatório' });
    }

    const result = await db.collection('users').updateOne(
      { email },
      {
        $set: {
          plan: 'premium',
          promotedAt: new Date(),
          promotedBy: 'admin',
        },
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.json({
      success: true,
      message: `Usuário ${email} promovido para Premium`,
      email,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obter credenciais do Admin (apenas para logging/debug)
router.get('/credentials', (req, res) => {
  // APENAS PARA DESENVOLVIMENTO - REMOVER EM PRODUÇÃO
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ error: 'Acesso negado em produção' });
  }

  res.json({
    warning: 'APENAS PARA DESENVOLVIMENTO - NÃO COMPARTILHE ESSAS CREDENCIAIS',
    admin: {
      username: ADMIN_CREDENTIALS.username,
      password: ADMIN_CREDENTIALS.password,
    },
  });
});

export default router;
