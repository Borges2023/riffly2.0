// src/context/FavoritesContext.jsx
import React, { createContext, useState, useContext, useEffect } from "react";

const FavoritesContext = createContext();

const STORAGE_KEY = "riffly-favorites";

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [playlists, setPlaylists] = useState([]);

  // Carregar favoritos do localStorage ao montar
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const { favorites: fav, playlists: pl } = JSON.parse(saved);
        setFavorites(fav || []);
        setPlaylists(pl || []);
      }
    } catch (error) {
      console.warn("Falha ao carregar favoritos", error);
    }
  }, []);

  // Salvar favoritos no localStorage sempre que mudam
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ favorites, playlists }));
    } catch (error) {
      console.warn("Falha ao salvar favoritos", error);
    }
  }, [favorites, playlists]);

  const toggleFavorite = (song) => {
    setFavorites((prev) => {
      const isFavorited = prev.some((s) => s._id === song._id);
      if (isFavorited) {
        return prev.filter((s) => s._id !== song._id);
      } else {
        return [...prev, song];
      }
    });
  };

  const isFavorite = (songId) => {
    return favorites.some((s) => s._id === songId);
  };

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
        pl.id === playlistId
          ? { ...pl, songs: [...pl.songs, song] }
          : pl
      )
    );
  };

  const removeFromPlaylist = (playlistId, songId) => {
    setPlaylists((prev) =>
      prev.map((pl) =>
        pl.id === playlistId
          ? { ...pl, songs: pl.songs.filter((s) => s._id !== songId) }
          : pl
      )
    );
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        playlists,
        toggleFavorite,
        isFavorite,
        createPlaylist,
        addToPlaylist,
        removeFromPlaylist,
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
