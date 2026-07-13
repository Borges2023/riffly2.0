// src/pages/Favorites.jsx
import React, { useState } from "react";
import { useFavorites } from "../context/FavoritesContext";
import SongList from "../components/SongList";
import { Link } from "react-router-dom";

const Favorites = () => {
  const { favorites, playlists, createPlaylist, removeFromPlaylist } = useFavorites();
  const [playlistName, setPlaylistName] = useState("");
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);

  const handleCreatePlaylist = () => {
    if (playlistName.trim()) {
      createPlaylist(playlistName);
      setPlaylistName("");
    }
  };

  return (
    <div className="main">
      <section className="favorites-hero">
        <h1>❤️ Seus Favoritos</h1>
        <p>{favorites.length} músicas salvas</p>
      </section>

      {favorites.length > 0 ? (
        <div className="favorites-section">
          <h2>Músicas Favoritas</h2>
          <SongList songsArray={favorites} />
        </div>
      ) : (
        <div className="empty-state">
          <p>Você ainda não tem músicas favoritas.</p>
          <Link to="/songs" className="btn btn--primary">
            Explorar Músicas
          </Link>
        </div>
      )}

      <section className="playlists-section">
        <h2>🎵 Suas Playlists</h2>

        <div className="create-playlist">
          <input
            type="text"
            placeholder="Nome da nova playlist..."
            value={playlistName}
            onChange={(e) => setPlaylistName(e.target.value)}
          />
          <button onClick={handleCreatePlaylist} className="btn btn--primary">
            Criar
          </button>
        </div>

        {playlists.length > 0 ? (
          <div className="playlists-grid">
            {playlists.map((playlist) => (
              <div key={playlist.id} className="playlist-card">
                <h3>{playlist.name}</h3>
                <p>{playlist.songs.length} músicas</p>
                <button
                  onClick={() => setSelectedPlaylist(playlist)}
                  className="btn btn--secondary"
                >
                  Ver
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p>Você ainda não criou playlists.</p>
        )}
      </section>

      {selectedPlaylist && (
        <div className="modal-overlay" onClick={() => setSelectedPlaylist(null)}>
          <div className="modal-content">
            <h2>{selectedPlaylist.name}</h2>
            {selectedPlaylist.songs.length > 0 ? (
              <SongList songsArray={selectedPlaylist.songs} />
            ) : (
              <p>Essa playlist está vazia.</p>
            )}
            <button onClick={() => setSelectedPlaylist(null)} className="btn">
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Favorites;
