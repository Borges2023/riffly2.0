// src/context/FavoritesContext.jsx
import React, { createContext, useState, useContext, useEffect } from "react";

const FavoritesContext = createContext();

const STORAGE_KEY = "riffly-favorites";

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [downloads, setDownloads] = useState([]);
  const [history, setHistory] = useState([]);
  const [following, setFollowing] = useState([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const { favorites: fav, playlists: pl, downloads: dl, history: hs, following: fw } = JSON.parse(saved);
        setFavorites(fav || []);
        setPlaylists(pl || []);
        setDownloads(dl || []);
        setHistory(hs || []);
        setFollowing(fw || []);
      }
    } catch (error) {
      console.warn("Falha ao carregar a biblioteca", error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ favorites, playlists, downloads, history, following })
      );
    } catch (error) {
      console.warn("Falha ao salvar a biblioteca", error);
    }
  }, [favorites, playlists, downloads, history, following]);

  const toggleFavorite = (song) => {
    setFavorites((prev) => {
      const isFavorited = prev.some((s) => s._id === song._id);
      if (isFavorited) {
        return prev.filter((s) => s._id !== song._id);
      }
      return [...prev, song];
    });
  };

  const isFavorite = (songId) => favorites.some((s) => s._id === songId);

  const createPlaylist = (name) => {
    const newPlaylist = {
      id: Date.now().toString(),
      name,
      songs: [],
      createdAt: new Date().toISOString(),
    };
    setPlaylists((prev) => [...prev, newPlaylist]);
    return newPlaylist;
  };

  const addToPlaylist = (playlistId, song) => {
    setPlaylists((prev) =>
      prev.map((pl) =>
        pl.id === playlistId ? { ...pl, songs: [...pl.songs.filter((item) => item._id !== song._id), song] } : pl
      )
    );
  };

  const removeFromPlaylist = (playlistId, songId) => {
    setPlaylists((prev) =>
      prev.map((pl) =>
        pl.id === playlistId ? { ...pl, songs: pl.songs.filter((s) => s._id !== songId) } : pl
      )
    );
  };

  const addDownload = (song) => {
    setDownloads((prev) => {
      const existing = prev.some((item) => item._id === song._id);
      if (existing) return prev;
      return [...prev, { ...song, downloadedAt: new Date().toISOString() }];
    });
  };

  const recordPlay = (song) => {
    setHistory((prev) => {
      const playEntry = { ...song, playedAt: new Date().toISOString() };
      return [playEntry, ...prev].slice(0, 50);
    });
  };

  const followArtist = (artist) => {
    setFollowing((prev) => {
      if (prev.some((item) => item.name === artist.name)) return prev;
      return [...prev, { ...artist, followedAt: new Date().toISOString() }];
    });
  };

  const unfollowArtist = (artistName) => {
    setFollowing((prev) => prev.filter((item) => item.name !== artistName));
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        playlists,
        downloads,
        history,
        following,
        toggleFavorite,
        isFavorite,
        createPlaylist,
        addToPlaylist,
        removeFromPlaylist,
        addDownload,
        recordPlay,
        followArtist,
        unfollowArtist,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites deve ser usado dentro de FavoritesProvider");
  }
  return context;
};
