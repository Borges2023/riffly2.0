/* eslint-disable react/prop-types, react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState } from "react";

const PlaybackContext = createContext(null);

export const PlaybackProvider = ({ children }) => {
  const [currentSong, setCurrentSong] = useState(null);
  const [songs, setSongs] = useState([]);
  const [isMiniPlayer, setIsMiniPlayer] = useState(false);

  const value = useMemo(
    () => ({
      currentSong,
      setCurrentSong,
      songs,
      setSongs,
      isMiniPlayer,
      setIsMiniPlayer,
    }),
    [currentSong, songs, isMiniPlayer]
  );

  return <PlaybackContext.Provider value={value}>{children}</PlaybackContext.Provider>;
};

export const usePlayback = () => {
  const context = useContext(PlaybackContext);
  if (!context) {
    throw new Error("usePlayback deve ser usado dentro de PlaybackProvider");
  }
  return context;
};
