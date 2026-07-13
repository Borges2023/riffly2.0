import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getArtists, getSongs, normalizeCatalogItems } from "../../../../database/apiFallback.js";
import { usePlayback } from "../context/PlaybackContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

const Song = () => {
  const { id } = useParams();
  const [songsArray, setSongsArray] = useState(getSongs());
  const [artistArray, setArtistArray] = useState(getArtists());
  const { setCurrentSong, setSongs } = usePlayback();

  useEffect(() => {
    let ignore = false;
    Promise.all([
      fetch(`${API_URL}/artists`).then((res) => (res.ok ? res.json() : Promise.reject(res))),
      fetch(`${API_URL}/songs`).then((res) => (res.ok ? res.json() : Promise.reject(res))),
    ])
      .then(([artists, songs]) => {
        if (!ignore) {
          const normalizedArtists = normalizeCatalogItems(artists);
          const normalizedSongs = normalizeCatalogItems(songs);
          setArtistArray(normalizedArtists);
          setSongsArray(normalizedSongs);
          setSongs(normalizedSongs);
        }
      })
      .catch(() => {});

    return () => {
      ignore = true;
    };
  }, [setSongs]);

  const currentSong = songsArray.find((song) => song._id === id || String(song.id) === String(id));

  useEffect(() => {
    if (currentSong) setCurrentSong(currentSong);
  }, [currentSong, setCurrentSong]);

  if (!currentSong) {
    return (
      <div className="song">
        <div className="song__container">
          <p>Música não encontrada.</p>
        </div>
      </div>
    );
  }

  const { image, name, artist } = currentSong;
  const artistObj = artistArray.find((item) => item.name === artist);

  return (
    <div className="song">
      <div className="song__container">
        <div className="song__image-container">
          <img src={image} alt={`Imagem da música ${name}`} />
        </div>
      </div>

      <div className="song__bar">
        <Link to={`/artist/${artistObj?._id || artistObj?.id || "#"}`} className="song__artist-image">
          <img width={75} height={75} src={artistObj?.image || ""} alt={`Imagem do Artista ${artist}`} />
        </Link>

        <div>
          <p className="song__name">{name}</p>
          <p>{artist}</p>
        </div>
      </div>
    </div>
  );
};

export default Song;
