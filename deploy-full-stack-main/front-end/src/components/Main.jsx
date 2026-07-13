import React from "react";
import { Link } from "react-router-dom";
import ItemList from "./ItemList";
import { getArtists, getSongs } from "../assets/database/apiFallback";

const Main = ({ type }) => {
  const showArtists = type === "artists" || type === undefined;
  const showSongs = type === "songs" || type === undefined;
  const artistArray = getArtists();
  const songsArray = getSongs();

  return (
    <div className="main">
      {showArtists || showSongs ? (
        <section className="hero-card">
          <div>
            <p className="hero-card__eyebrow">Aplicativo musical moderno</p>
            <h2>Descubra novos sons com uma experiência premium e preparada para mobile.</h2>
            <p>
              O Riffly reúne artistas, playlists e uma navegação orientada a
              performance para evoluir em direção a um app de streaming completo.
            </p>
          </div>

          <div className="hero-actions">
            <Link to="/artists" className="hero-actions__button">
              Explorar artistas
            </Link>
            <Link to="/songs" className="hero-actions__button hero-actions__button--secondary">
              Ver músicas
            </Link>
          </div>
        </section>
      ) : null}

      <section className="feature-grid">
        <article className="feature-card">
          <h3>Stream-ready</h3>
          <p>Interface pensada para navegação fluida em telas pequenas e Android.</p>
        </article>
        <article className="feature-card">
          <h3>Descoberta rápida</h3>
          <p>Exploração de artistas e músicas em poucos toques.</p>
        </article>
        <article className="feature-card">
          <h3>Roadmap premium</h3>
          <p>Favoritos, playlists, login e modo offline entram no próximo passo.</p>
        </article>
      </section>

      {/* Item List de Artistas */}
      {showArtists ? (
        <ItemList
          title="Artistas"
          items={10}
          itemsArray={artistArray}
          path="/artists"
          idPath="/artist"
        />
      ) : null}

      {/* Item List de Músicas */}
      {showSongs ? (
        <ItemList
          title="Músicas"
          items={20}
          itemsArray={songsArray}
          path="/songs"
          idPath="/song"
        />
      ) : null}
    </div>
  );
};

export default Main;
