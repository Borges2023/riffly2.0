import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Card, Badge } from "../design-system/index.js";
import { useFavorites } from "../context/FavoritesContext";

const Library = () => {
  const { favorites, playlists, downloads, history, following, recordPlay, addDownload } = useFavorites();
  const [selectedTab, setSelectedTab] = useState("favorites");

  const tabItems = [
    { id: "favorites", label: "Favoritos" },
    { id: "downloads", label: "Baixados" },
    { id: "history", label: "Histórico" },
    { id: "liked", label: "Curtidas" },
    { id: "recent", label: "Últimos Tocados" },
    { id: "playlists", label: "Playlists" },
    { id: "following", label: "Seguindo" },
  ];

  const currentItems = useMemo(() => {
    switch (selectedTab) {
      case "downloads":
        return downloads;
      case "history":
        return history;
      case "liked":
        return favorites;
      case "recent":
        return history.slice(0, 10);
      case "playlists":
        return playlists;
      case "following":
        return following;
      default:
        return favorites;
    }
  }, [selectedTab, favorites, downloads, history, playlists, following]);

  return (
    <div className="main library-page">
      <section className="page-header">
        <div>
          <h1>Minha Biblioteca</h1>
          <p>Organize seus favoritos, histórico, playlists e artistas que você segue em um só lugar.</p>
        </div>
        <Badge tone="success">Biblioteca completa</Badge>
      </section>

      <section className="library-tabs">
        {tabItems.map((tab) => (
          <button
            key={tab.id}
            className={`tab-button ${selectedTab === tab.id ? "active" : ""}`}
            type="button"
            onClick={() => setSelectedTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </section>

      <section className="library-content">
        {selectedTab === "playlists" ? (
          playlists.length > 0 ? (
            <div className="playlists-grid">
              {playlists.map((playlist) => (
                <Card key={playlist.id} className="playlist-card">
                  <div className="playlist-card__header">
                    <h3>{playlist.name}</h3>
                    <span>{playlist.songs.length} músicas</span>
                  </div>
                  <p className="playlist-card__date">Criado em {new Date(playlist.createdAt).toLocaleDateString("pt-BR")}</p>
                  <Link to="/favorites" className="btn btn--secondary">
                    Abrir playlist
                  </Link>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <p>Você ainda não criou nenhuma playlist. Vá para Favoritos e crie a sua primeira playlist.</p>
            </Card>
          )
        ) : selectedTab === "following" ? (
          following.length > 0 ? (
            <div className="follow-grid">
              {following.map((artist) => (
                <Card key={artist.name} className="follow-card">
                  <strong>{artist.name}</strong>
                  <p>{artist.bio || "Artista favorito"}</p>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <p>Você ainda não segue nenhum artista. Explore artistas e siga os seus favoritos.</p>
            </Card>
          )
        ) : currentItems.length > 0 ? (
          <div className="music-grid">
            {currentItems.map((song) => (
              <Card key={song._id || song.id || song.name} className="music-card">
                <div className="music-card__meta">
                  <strong>{song.name || song.title}</strong>
                  <span>{song.artist || song.label || "Desconhecido"}</span>
                </div>
                <div className="music-card__actions">
                  {selectedTab !== "downloads" ? (
                    <button type="button" className="btn btn--secondary" onClick={() => addDownload(song)}>
                      Baixar
                    </button>
                  ) : null}
                  {selectedTab !== "history" ? (
                    <button type="button" className="btn btn--secondary" onClick={() => recordPlay(song)}>
                      Tocar novamente
                    </button>
                  ) : null}
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <p>Sem registros nesta categoria ainda. Navegue pelo aplicativo para adicionar itens.</p>
          </Card>
        )}
      </section>

      <section className="library-actions">
        <p>Quer adicionar novos artistas, álbuns e playlists inteligentes?</p>
        <Link to="/platform" className="btn btn--primary">
          Descobrir agora
        </Link>
      </section>
    </div>
  );
};

export default Library;
