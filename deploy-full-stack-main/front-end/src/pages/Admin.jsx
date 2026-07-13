import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import '../styles/admin.css';

export default function Admin() {
  const {
    isAdminLoggedIn,
    adminUsername,
    users,
    loading,
    error,
    login,
    logout,
    fetchUsers,
    promoteUserToPremium,
    promoteAllToPremium,
  } = useAdmin();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    const success = await login(username, password);
    if (success) {
      setUsername('');
      setPassword('');
      // Buscar usuários após login
      setTimeout(fetchUsers, 500);
    } else {
      setLoginError('Credenciais inválidas');
    }
  };

  if (!isAdminLoggedIn) {
    return (
      <div className="admin-page">
        <div className="admin-login-container">
          <div className="admin-login-card">
            <h1>🔐 Painel de Administração</h1>
            <p>Riffly - Sistema de Gerenciamento</p>

            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label htmlFor="username">Usuário</label>
                <input
                  id="username"
                  type="text"
                  placeholder="Digite o usuário"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Senha</label>
                <input
                  id="password"
                  type="password"
                  placeholder="Digite a senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {loginError && <div className="error-message">{loginError}</div>}

              <button type="submit" className="btn-login">
                Entrar
              </button>
            </form>

            <div className="info-box">
              <h3>📌 Credenciais de Demonstração</h3>
              <p>
                <strong>Usuário:</strong> <code>admin_riffly</code>
              </p>
              <p>
                <strong>Senha:</strong> <code>RifflyAdmin@2024</code>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div className="header-content">
          <h1>⚙️ Painel de Administração</h1>
          <p>Bem-vindo, {adminUsername}!</p>
        </div>
        <button onClick={logout} className="btn-logout">
          Sair
        </button>
      </div>

      <div className="admin-content">
        {/* Seção de Ações Rápidas */}
        <section className="admin-section">
          <h2>⚡ Ações Rápidas</h2>
          <div className="actions-grid">
            <button
              onClick={() => {
                promoteAllToPremium();
                setTimeout(fetchUsers, 500);
              }}
              className="btn-action btn-primary"
            >
              👑 Liberar Premium para Todos
            </button>
            <button
              onClick={fetchUsers}
              className="btn-action btn-secondary"
              disabled={loading}
            >
              🔄 Atualizar Lista
            </button>
          </div>
        </section>

        {/* Seção de Usuários */}
        <section className="admin-section">
          <h2>👥 Gerenciar Usuários</h2>

          {error && <div className="error-message">{error}</div>}

          {loading ? (
            <div className="loading">Carregando...</div>
          ) : users.length === 0 ? (
            <div className="empty-state">
              <p>Nenhum usuário encontrado</p>
              <button onClick={fetchUsers} className="btn-secondary">
                Buscar Usuários
              </button>
            </div>
          ) : (
            <div className="users-table">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Email</th>
                    <th>Plano</th>
                    <th>Criado em</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className={user.plan === 'premium' ? 'premium' : ''}>
                      <td className="id">{user.id?.toString().slice(-8)}</td>
                      <td className="email">{user.email || 'N/A'}</td>
                      <td className="plan">
                        <span className={`badge badge-${user.plan}`}>
                          {user.plan === 'premium' ? '👑 Premium' : '🆓 Free'}
                        </span>
                      </td>
                      <td className="date">
                        {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="actions">
                        {user.plan === 'free' && (
                          <button
                            onClick={() => {
                              promoteUserToPremium(user.email);
                              setTimeout(fetchUsers, 500);
                            }}
                            className="btn-small btn-promote"
                          >
                            Promover
                          </button>
                        )}
                        {user.plan === 'premium' && (
                          <span className="badge-checked">✓ Premium</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="user-stats">
            <div className="stat">
              <span className="stat-label">Total de Usuários</span>
              <span className="stat-value">{users.length}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Premium</span>
              <span className="stat-value">
                {users.filter((u) => u.plan === 'premium').length}
              </span>
            </div>
            <div className="stat">
              <span className="stat-label">Free</span>
              <span className="stat-value">
                {users.filter((u) => u.plan === 'free').length}
              </span>
            </div>
          </div>
        </section>

        {/* Seção de Informações */}
        <section className="admin-section">
          <h2>ℹ️ Informações do Sistema</h2>
          <div className="info-grid">
            <div className="info-card">
              <h3>🔐 Segurança</h3>
              <p>Usar HTTPS em produção</p>
              <p>Implementar 2FA</p>
              <p>Hash de senhas com bcrypt</p>
            </div>
            <div className="info-card">
              <h3>📊 Monitoramento</h3>
              <p>Rastreamento de planos ativo</p>
              <p>Anúncios registrados</p>
              <p>Métricas em tempo real</p>
            </div>
            <div className="info-card">
              <h3>🚀 Versão</h3>
              <p>Riffly v1.1+</p>
              <p>Admin Panel v1.0</p>
              <p>Database: MongoDB</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
