/* eslint-disable react/prop-types */
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ItemList from "./ItemList";
import { getArtists, getSongs, normalizeCatalogItems } from "../../../../database/apiFallback.js";
import { buildSearchSuggestions, searchCatalog } from "../utils/searchCatalog.js";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

const Main = ({ type, searchQuery = "" }) => {
  const showArtists = type === "artists" || type === undefined;
  const showSongs = type === "songs" || type === undefined;
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

  const filteredSongs = useMemo(() => {
    if (!searchQuery) return songsArray;
    return searchCatalog({ query: searchQuery, songs: songsArray, artists: artistArray }).filter((item) => item.kind === "song");
  }, [searchQuery, songsArray, artistArray]);
  const searchSuggestions = useMemo(() => buildSearchSuggestions(songsArray, artistArray), [songsArray, artistArray]);

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
          itemsArray={filteredSongs}
          path="/songs"
          idPath="/song"
        />
      ) : null}

      {searchQuery ? (
        <section className="search-results">
          <div className="search-results__header">
            <h3>Resultados inteligentes</h3>
            <span>{searchSuggestions.slice(0, 4).join(" • ")}</span>
          </div>
        </section>
      ) : null}
    </div>
  );
};

export default Main;
