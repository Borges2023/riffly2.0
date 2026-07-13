import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlay } from "@fortawesome/free-solid-svg-icons";
import { Link, useParams } from "react-router-dom";
import SongList from "../components/SongList";
import { getArtists, getSongs, normalizeCatalogItems } from "../../../../database/apiFallback.js";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

const Artist = () => {
  const { id } = useParams();
  const [artistArray, setArtistArray] = useState(getArtists());
  const [songsArray, setSongsArray] = useState(getSongs());

  useEffect(() => {
    let ignore = false;
    Promise.all([
      fetch(`${API_URL}/artists`).then((res) => (res.ok ? res.json() : Promise.reject(res))),
      fetch(`${API_URL}/songs`).then((res) => (res.ok ? res.json() : Promise.reject(res))),
    ])
      .then(([artists, songs]) => {
        if (!ignore) {
          setArtistArray(normalizeCatalogItems(artists));
          setSongsArray(normalizeCatalogItems(songs));
        }
      })
      .catch(() => {});

    return () => {
      ignore = true;
    };
  }, []);

  const currentArtist = artistArray.find((currentArtistObj) => currentArtistObj._id === id || String(currentArtistObj.id) === String(id));

  if (!currentArtist) {
    return (
      <div className="artist">
        <div className="artist__body">
          <p>Artista não encontrado.</p>
        </div>
      </div>
    );
  }

  const { name, banner } = currentArtist;
  const songsArrayFromArtist = songsArray.filter((currentSongObj) => currentSongObj.artist === name);
  const randomSong = songsArrayFromArtist[Math.floor(Math.random() * songsArrayFromArtist.length)];

  return (
    <div className="artist">
      <div
        className="artist__header"
        style={{
          backgroundImage: `linear-gradient(to bottom, var(--_shade), var(--_shade)),url(${banner})`,
        }}
      >
        <h2 className="artist__title">{name}</h2>
      </div>

      <div className="artist__body">
        <h2>Populares</h2>
        <SongList songsArray={songsArrayFromArtist} />
      </div>

      {randomSong ? (
        <Link to={`/song/${randomSong._id ?? randomSong.id}`}>
          <FontAwesomeIcon className="single-item__icon single-item__icon--artist" icon={faCirclePlay} />
        </Link>
      ) : null}
    </div>
  );
};

export default Artist;
