import React, { useEffect, useState } from "react";
import { useAdmin } from "../context/AdminContext";
import "../styles/admin.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

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

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [songForm, setSongForm] = useState({
    name: "",
    artist: "",
    image: "",
    duration: "03:00",
    genre: "Independente",
    streamUrl: "",
  });
  const [songStatus, setSongStatus] = useState("");
  const [platformOverview, setPlatformOverview] = useState(null);
  const [metricsLoading, setMetricsLoading] = useState(false);
  const [metricsError, setMetricsError] = useState(null);

  useEffect(() => {
    const fetchOverview = async () => {
      setMetricsLoading(true);
      try {
        const response = await fetch("http://localhost:3001/api/platform/overview");
        const data = await response.json();
        setPlatformOverview(data);
      } catch (err) {
        setMetricsError("Não foi possível carregar os indicadores do painel.");
      } finally {
        setMetricsLoading(false);
      }
    };

    fetchOverview();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    const success = await login(username, password);
    if (success) {
      setUsername("");
      setPassword("");
      setTimeout(fetchUsers, 500);
    } else {
      setLoginError("Credenciais inválidas");
    }
  };

  const handleSongSubmit = async (e) => {
    e.preventDefault();
    setSongStatus("");

    if (!songForm.name || !songForm.artist || !songForm.streamUrl) {
      setSongStatus("Preencha nome, artista e link.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/songs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(songForm),
      });

      if (!response.ok) {
        throw new Error("Falha ao cadastrar música");
      }

      setSongStatus("Música cadastrada com sucesso.");
      setSongForm({
        name: "",
        artist: "",
        image: "",
        duration: "03:00",
        genre: "Independente",
        streamUrl: "",
      });
    } catch (error) {
      setSongStatus("Não foi possível cadastrar a música.");
    }
  };

  if (!isAdminLoggedIn) {
    return (
      <div className="admin-page">
        <div className="admin-login-container">
          <div className="admin-login-card">
            <h1>Painel de Administração</h1>
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
              <h3>Credenciais de Demonstração</h3>
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
          <h1>Painel de Administração</h1>
          <p>Bem-vindo, {adminUsername}!</p>
        </div>
        <button onClick={logout} className="btn-logout">
          Sair
        </button>
      </div>

      <section className="admin-metrics">
        <div className="metrics-grid">
          <article className="metric-card">
            <h3>Usuários</h3>
            <strong>{users.length}</strong>
          </article>
          <article className="metric-card">
            <h3>Reproduções</h3>
            <strong>{platformOverview?.stats?.plays ?? "---"}</strong>
          </article>
          <article className="metric-card">
            <h3>Ativos</h3>
            <strong>{platformOverview?.stats?.activeListeners ?? "---"}</strong>
          </article>
          <article className="metric-card">
            <h3>Uploads</h3>
            <strong>{platformOverview?.uploads?.length ?? "---"}</strong>
          </article>
          <article className="metric-card">
            <h3>Comentários</h3>
            <strong>{platformOverview?.comments?.length ?? "---"}</strong>
          </article>
          <article className="metric-card">
            <h3>Seguidores</h3>
            <strong>{platformOverview?.follows?.length ?? "---"}</strong>
          </article>
        </div>
        {metricsLoading && <div className="metric-loading">Atualizando métricas...</div>}
        {metricsError && <div className="alert-message">{metricsError}</div>}
      </section>

      <div className="admin-content">
        <section className="admin-section">
          <h2>Ações Rápidas</h2>
          <div className="actions-grid">
            <button
              onClick={() => {
                promoteAllToPremium();
                setTimeout(fetchUsers, 500);
              }}
              className="btn-action btn-primary"
            >
              Liberar Premium para Todos
            </button>
            <button onClick={fetchUsers} className="btn-action btn-secondary" disabled={loading}>
              Atualizar Lista
            </button>
          </div>
        </section>

        <section className="admin-section">
          <h2>Gerenciar Usuários</h2>

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
                    <tr key={user.id} className={user.plan === "premium" ? "premium" : ""}>
                      <td className="id">{user.id?.toString().slice(-8)}</td>
                      <td className="email">{user.email || "N/A"}</td>
                      <td className="plan">
                        <span className={`badge badge-${user.plan}`}>
                          {user.plan === "premium" ? "Premium" : "Free"}
                        </span>
                      </td>
                      <td className="date">{new Date(user.createdAt).toLocaleDateString("pt-BR")}</td>
                      <td className="actions">
                        {user.plan === "free" && (
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
                        {user.plan === "premium" && <span className="badge-checked">Premium</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="admin-section">
          <h2>Cadastrar Música por Link</h2>
          <form onSubmit={handleSongSubmit} className="platform-form">
            <input
              type="text"
              placeholder="Nome da música"
              value={songForm.name}
              onChange={(e) => setSongForm({ ...songForm, name: e.target.value })}
            />
            <input
              type="text"
              placeholder="Artista"
              value={songForm.artist}
              onChange={(e) => setSongForm({ ...songForm, artist: e.target.value })}
            />
            <input
              type="url"
              placeholder="Link do áudio"
              value={songForm.streamUrl}
              onChange={(e) => setSongForm({ ...songForm, streamUrl: e.target.value })}
            />
            <input
              type="url"
              placeholder="Link da capa"
              value={songForm.image}
              onChange={(e) => setSongForm({ ...songForm, image: e.target.value })}
            />
            <input
              type="text"
              placeholder="Duração"
              value={songForm.duration}
              onChange={(e) => setSongForm({ ...songForm, duration: e.target.value })}
            />
            <input
              type="text"
              placeholder="Gênero"
              value={songForm.genre}
              onChange={(e) => setSongForm({ ...songForm, genre: e.target.value })}
            />
            {songStatus && <div className="info-box">{songStatus}</div>}
            <button type="submit" className="btn-action btn-primary">
              Publicar música
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
