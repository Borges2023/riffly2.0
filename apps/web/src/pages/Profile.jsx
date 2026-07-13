import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useFavorites } from "../context/FavoritesContext";
import { Card } from "../design-system/index.js";

const Profile = () => {
  const { user, isAuthenticated } = useAuth();
  const { favorites, history, playlists, following, downloads } = useFavorites();

  const profileStats = useMemo(
    () => ({
      playlists: playlists.length,
      favoritos: favorites.length,
      seguidores: Math.max(12, Math.floor(favorites.length / 2) + 8),
      seguindo: following.length,
      reproducoes: history.length,
      downloads: downloads.length,
    }),
    [favorites.length, history.length, playlists.length, following.length, downloads.length]
  );

  if (!isAuthenticated) {
    return (
      <div className="main profile-page">
        <Card>
          <h1>Perfil</h1>
          <p>Faça login para ver seu perfil completo, estatísticas, biografia e playlists.</p>
          <Link to="/login" className="btn btn--primary">
            Entrar agora
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="main profile-page">
      <div className="profile-banner">
        <div className="profile-banner__overlay" />
        <div className="profile-banner__content">
          <img className="profile-avatar" src={user.avatar || "https://i.scdn.co/image/ab6761610000e5eb5c3d9c2aad0614904e19d77a"} alt={user.name} />
          <div>
            <h1>{user.name}</h1>
            <p>{user.email || "ouvinte@riffly.local"}</p>
            <p className="profile-bio">Apaixonado por música, descobertas inteligentes e playlists que contam histórias. Amo descobrir artistas independentes e compartilhar meus sons favoritos.</p>
          </div>
        </div>
      </div>

      <section className="profile-summary">
        <Card className="profile-summary__card">
          <h2>Estatísticas pessoais</h2>
          <div className="profile-summary__grid">
            <div>
              <strong>{profileStats.playlists}</strong>
              <span>Playlists</span>
            </div>
            <div>
              <strong>{profileStats.favoritos}</strong>
              <span>Curtidas</span>
            </div>
            <div>
              <strong>{profileStats.seguidores}</strong>
              <span>Seguidores</span>
            </div>
            <div>
              <strong>{profileStats.seguindo}</strong>
              <span>Seguindo</span>
            </div>
            <div>
              <strong>{profileStats.reproducoes}</strong>
              <span>Reproduções</span>
            </div>
            <div>
              <strong>{profileStats.downloads}</strong>
              <span>Baixados</span>
            </div>
          </div>
        </Card>
      </section>

      <section className="profile-panels">
        <Card>
          <h2>Playlists</h2>
          {playlists.length > 0 ? (
            <div className="profile-playlists">
              {playlists.map((playlist) => (
                <article key={playlist.id} className="profile-playlist-card">
                  <strong>{playlist.name}</strong>
                  <span>{playlist.songs.length} músicas</span>
                </article>
              ))}
            </div>
          ) : (
            <p>Crie sua primeira playlist em Favoritos para aparecer aqui.</p>
          )}
        </Card>

        <Card>
          <h2>Últimos tocados</h2>
          {history.slice(0, 6).length > 0 ? (
            <ul className="profile-list">
              {history.slice(0, 6).map((item, index) => (
                <li key={`${item._id || item.id}-${index}`}>{item.name || item.title} • {item.artist || item.label}</li>
              ))}
            </ul>
          ) : (
            <p>Suas últimas reproduções aparecerão aqui.</p>
          )}
        </Card>

        <Card>
          <h2>Seguindo</h2>
          {following.length > 0 ? (
            <div className="profile-following-grid">
              {following.map((artist) => (
                <span key={artist.name} className="badge badge-following">{artist.name}</span>
              ))}
            </div>
          ) : (
            <p>Comece a seguir artistas no catálogo para receber recomendações personalizadas.</p>
          )}
        </Card>
      </section>
    </div>
  );
};

export default Profile;
