import React from "react";
import PlayerNew from "../components/PlayerNew";
import { Link, useParams } from "react-router-dom";
import { getArtists, getSongs } from "../assets/database/apiFallback";

const Song = () => {
  const { id } = useParams();
  const songsArray = getSongs();
  const artistArray = getArtists();

  const currentSong = songsArray.find((currentSongObj) => currentSongObj._id === id);

  if (!currentSong) {
    return (
      <div className="song">
        <div className="song__container">
          <p>Música não encontrada.</p>
        </div>
      </div>
    );
  }

  const { image, name, duration, artist } = currentSong;
  // console.log(songObj);

  const artistObj = artistArray.find((currentArtistObj) => currentArtistObj.name === artist);
  const songsArrayFromArtist = songsArray.filter((currentSongObj) => currentSongObj.artist === artist);

  return (
    <div className="song">
      <div className="song__container">
        <div className="song__image-container">
          <img src={image} alt={`Imagem da música ${name}`} />
        </div>
      </div>

      <div className="song__bar">
        <Link to={`/artist/${artistObj?._id || "#"}`} className="song__artist-image">
          <img
            width={75}
            height={75}
            src={artistObj?.image || ""}
            alt={`Imagem do Artista ${artist}`}
          />
        </Link>

        <PlayerNew currentSong={currentSong} songs={songsArray} />

        <div>
          <p className="song__name">{name}</p>
          <p>{artist}</p>
        </div>
      </div>
    </div>
  );
};

export default Song;
