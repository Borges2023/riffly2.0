import { Link } from "react-router-dom";
import Main from "../components/Main";
import { Card, Badge } from "../design-system/index.js";
import { getArtists, getSongs } from "../../../../database/apiFallback.js";

const homeSections = [
  { title: "Continue ouvindo", subtitle: "Retome onde parou", target: "/songs" },
  { title: "Recomendados", subtitle: "Baseado no seu gosto", target: "/songs" },
  { title: "Mix Diário", subtitle: "Selecao dinamica para hoje", target: "/platform" },
  { title: "Em Alta", subtitle: "O que esta crescendo agora", target: "/songs" },
  { title: "Lancamentos", subtitle: "Novidades do catalogo", target: "/songs" },
  { title: "Playlists", subtitle: "Colecoes prontas para tocar", target: "/favorites" },
  { title: "Podcasts", subtitle: "Conteudo falado e series", target: "/platform" },
  { title: "Artistas", subtitle: "Quem esta em destaque", target: "/artists" },
  { title: "Categorias", subtitle: "Navegue por clima e genero", target: "/platform" },
];

const Home = () => {
  const songs = getSongs().slice(0, 12);
  const artists = getArtists().slice(0, 6);
  const featuredSongs = songs.slice(0, 6);
  const rows = homeSections.map((section, index) => ({
    ...section,
    accent: ["#f97316", "#22c55e", "#0ea5e9", "#f43f5e"][index % 4],
  }));

  return (
    <div className="home-page">
      <section className="home-hero">
        <div className="home-hero__copy">
          <Badge>Bom dia</Badge>
          <h1>Sua musica, podcasts e descobertas em um unico lugar.</h1>
          <p>
            A Home agora funciona como painel editorial, com blocos pensados para retomada,
            descoberta rapida e navegação por contexto.
          </p>
          <div className="home-hero__actions">
            <Link to="/songs" className="hero-actions__button">Tocar agora</Link>
            <Link to="/platform" className="hero-actions__button hero-actions__button--secondary">Explorar plataforma</Link>
          </div>
        </div>

        <Card className="home-hero__card">
          <p className="home-hero__label">Continue ouvindo</p>
          <div className="home-hero__queue">
            {featuredSongs.map((song) => (
              <article key={song.id} className="home-track">
                <img src={song.image} alt="" />
                <div>
                  <strong>{song.name}</strong>
                  <span>{song.artist}</span>
                </div>
              </article>
            ))}
          </div>
        </Card>
      </section>

      <section className="home-panels">
        {rows.map((section) => (
          <Card className="home-panel" key={section.title}>
            <span className="home-panel__accent" style={{ backgroundColor: section.accent }} />
            <div>
              <p>{section.title}</p>
              <strong>{section.subtitle}</strong>
            </div>
            <Link to={section.target}>Abrir</Link>
          </Card>
        ))}
      </section>

      <section className="home-grid">
        <Card>
          <div className="home-section__header">
            <h2>Continue ouvindo</h2>
            <Link to="/songs">Ver tudo</Link>
          </div>
          <div className="home-list">
            {songs.slice(0, 4).map((song) => (
              <article key={song.id} className="home-list__item">
                <img src={song.image} alt="" />
                <div>
                  <strong>{song.name}</strong>
                  <span>{song.artist}</span>
                </div>
              </article>
            ))}
          </div>
        </Card>

        <Card>
          <div className="home-section__header">
            <h2>Recomendados</h2>
            <Link to="/songs">Ver tudo</Link>
          </div>
          <div className="home-badges">
            {["Sertanejo", "Funk", "Pop", "Ao vivo", "Romanticas", "Top 50"].map((item) => (
              <Badge key={item}>{item}</Badge>
            ))}
          </div>
        </Card>
      </section>

      <section className="home-grid home-grid--wide">
        <Card>
          <div className="home-section__header">
            <h2>Artistas em destaque</h2>
            <Link to="/artists">Ver artistas</Link>
          </div>
          <div className="home-artists">
            {artists.map((artist) => (
              <article key={artist.id || artist._id} className="home-artist">
                <img src={artist.image} alt="" />
                <strong>{artist.name}</strong>
              </article>
            ))}
          </div>
        </Card>

        <Card>
          <div className="home-section__header">
            <h2>Mix Diário</h2>
            <Link to="/platform">Abrir</Link>
          </div>
          <p className="home-copy">
            Um bloco editorial com recomendacoes, tendências e atalhos para podcasts,
            categorias e playlists.
          </p>
        </Card>
      </section>

      <Main />
    </div>
  );
};

export default Home;
