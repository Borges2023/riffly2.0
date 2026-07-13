import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBackwardStep,
  faBroadcastTower,
  faChartLine,
  faCloudArrowDown,
  faCloudArrowUp,
  faComment,
  faForwardStep,
  faGaugeHigh,
  faHeart,
  faMicrophoneLines,
  faPause,
  faPlay,
  faPodcast,
  faRadio,
  faRepeat,
  faSearch,
  faShareNodes,
  faShuffle,
  faSliders,
  faStar,
  faTowerBroadcast,
  faUserCheck,
} from "@fortawesome/free-solid-svg-icons";
import { getArtists, getSongs, normalizeCatalogItems } from "../../../../database/apiFallback.js";
import { Card, Search } from "../design-system/index.js";
import "../styles/platform.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

const fallbackOverview = {
  features: [
    "Login social",
    "Upload de musicas",
    "Upload de capas",
    "Player profissional",
    "Playlist",
    "Favoritos",
    "Historico",
    "Busca",
    "Letras sincronizadas",
    "Karaoke",
    "Podcasts",
    "Audiobooks",
    "Radio",
    "Download offline",
    "Chromecast",
    "Android Auto",
    "Apple CarPlay",
    "Equalizador",
    "Compartilhamento",
    "Comentarios",
    "Seguir artistas",
    "Notificacoes",
    "Estatisticas",
    "Painel admin",
    "API documentada",
    "IA para recomendacoes",
  ],
  playlists: [
    { id: "weekly-ranking", name: "Ranking semanal", description: "Mais tocadas da semana.", followers: 12840 },
    { id: "trending", name: "Trending", description: "Faixas acelerando agora.", followers: 9910 },
    { id: "discoveries", name: "Descobertas", description: "Novidades e apostas editoriais.", followers: 8320 },
  ],
  shows: [
    { id: "podcast-produtores", type: "podcast", title: "Dentro do Beat", category: "Musica e carreira", duration: "42 min", episodes: 18 },
    { id: "audiobook-artista", type: "audiobook", title: "Manual do Artista Independente", category: "Educacao", duration: "5 h 20 min", episodes: 12 },
    { id: "radio-trending", type: "radio", title: "Radio Trending Brasil", category: "Hits 24/7", duration: "Ao vivo", episodes: 1 },
  ],
  stats: { plays: 18420, downloads: 1220, shares: 3760, uploads: 64, comments: 912, followers: 7400, activeListeners: 28400 },
  realtime: [],
  uploads: [],
  comments: [],
};

const lyricLines = [
  { time: "00:04", text: "A primeira nota acende a sala" },
  { time: "00:12", text: "Todo mundo canta junto no refrao" },
  { time: "00:20", text: "Riffly leva o palco para a palma da mao" },
  { time: "00:32", text: "No modo karaoke, a voz principal e sua" },
];

const initialUpload = {
  title: "",
  artist: "",
  genre: "Independente",
  audioUrl: "",
  coverUrl: "",
  lyrics: "",
};

const formatNumber = (value) => new Intl.NumberFormat("pt-BR", { notation: "compact" }).format(value || 0);
const getSongAudio = (song) => song?.streamUrl || song?.audio || song?.audioFallback || "";

const Platform = () => {
  const audioRef = useRef(null);
  const [songs, setSongs] = useState(() => getSongs().slice(0, 24));
  const [artists, setArtists] = useState(() => getArtists().slice(0, 12));
  const [overview, setOverview] = useState(fallbackOverview);
  const [query, setQuery] = useState("");
  const [activeSong, setActiveSong] = useState(songs[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.85);
  const [bass, setBass] = useState(45);
  const [mid, setMid] = useState(62);
  const [treble, setTreble] = useState(58);
  const [favorites, setFavorites] = useState(() => new Set([songs[0]?.id]));
  const [history, setHistory] = useState([]);
  const [offline, setOffline] = useState(() => new Set());
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [upload, setUpload] = useState(initialUpload);
  const [theme, setTheme] = useState("dark");
  const [notification, setNotification] = useState("IA pronta para recomendar sua proxima faixa.");

  useEffect(() => {
    let ignore = false;

    Promise.all([
      fetch(`${API_URL}/platform/overview`).then((response) => (response.ok ? response.json() : Promise.reject(response))),
      fetch(`${API_URL}/artists`).then((response) => (response.ok ? response.json() : Promise.reject(response))),
      fetch(`${API_URL}/songs`).then((response) => (response.ok ? response.json() : Promise.reject(response))),
    ])
      .then(([overviewData, artistsData, songsData]) => {
        if (!ignore) {
          setOverview({ ...fallbackOverview, ...overviewData });
          setComments(overviewData.comments || []);
          setArtists(normalizeCatalogItems(artistsData).slice(0, 12));
          setSongs(normalizeCatalogItems(songsData).slice(0, 24));
        }
      })
      .catch(() => {
        setOverview(fallbackOverview);
      });

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const filteredSongs = songs.filter((song) => {
    const term = `${song.name} ${song.artist} ${song.genre || ""}`.toLowerCase();
    return term.includes(query.toLowerCase());
  });

  const recommendations = filteredSongs
    .filter((song) => song.id !== activeSong?.id)
    .slice(0, 6);

  const registerEvent = (type, label, metadata = {}) => {
    setOverview((current) => ({
      ...current,
      stats: {
        ...current.stats,
        plays: type === "play" ? current.stats.plays + 1 : current.stats.plays,
        downloads: type === "offline_download" ? current.stats.downloads + 1 : current.stats.downloads,
        shares: type === "share" ? current.stats.shares + 1 : current.stats.shares,
      },
      realtime: [{ type, label, createdAt: new Date().toISOString() }, ...(current.realtime || [])].slice(0, 8),
    }));

    fetch(`${API_URL}/platform/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, label, songId: activeSong?.id, metadata }),
    }).catch(() => {});
  };

  const playSong = (song) => {
    const nextAudio = getSongAudio(song);
    setActiveSong(song);
    setIsPlaying(true);
    setHistory((current) => [song, ...current.filter((item) => item.id !== song.id)].slice(0, 8));
    setNotification(`Tocando agora: ${song.name}`);
    registerEvent("play", `Play em ${song.name}`);
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      audio.src = nextAudio;
      audio.load();
      audio.play().catch(() => setIsPlaying(false));
    }
  };

  const togglePlay = () => {
    if (!activeSong) return;

    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    setIsPlaying(true);
    registerEvent("play", `Play em ${activeSong.name}`);
    audio.src = getSongAudio(activeSong);
    audio.load();
    audio.play().catch(() => setIsPlaying(false));
  };

  const toggleFavorite = (song) => {
    setFavorites((current) => {
      const next = new Set(current);
      if (next.has(song.id)) next.delete(song.id);
      else next.add(song.id);
      return next;
    });
  };

  const toggleOffline = (song) => {
    setOffline((current) => {
      const next = new Set(current);
      if (next.has(song.id)) next.delete(song.id);
      else {
        next.add(song.id);
        registerEvent("offline_download", `Download offline: ${song.name}`);
      }
      return next;
    });
  };

  const shareSong = async () => {
    const text = `Estou ouvindo ${activeSong?.name} de ${activeSong?.artist} no Riffly`;
    registerEvent("share", text);
    setNotification("Link de compartilhamento preparado.");

    if (navigator.share) {
      await navigator.share({ title: "Riffly", text }).catch(() => {});
    }
  };

  const sendComment = (event) => {
    event.preventDefault();
    if (!comment.trim()) return;

    const nextComment = {
      songId: activeSong?.id,
      author: "Ouvinte Riffly",
      text: comment.trim(),
      createdAt: new Date().toISOString(),
    };

    setComments((current) => [nextComment, ...current].slice(0, 8));
    setComment("");

    fetch(`${API_URL}/platform/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nextComment),
    }).catch(() => {});
  };

  const submitUpload = (event) => {
    event.preventDefault();
    if (!upload.title || !upload.artist) {
      setNotification("Preencha titulo e artista para enviar.");
      return;
    }

    setOverview((current) => ({
      ...current,
      uploads: [{ ...upload, status: "processing", createdAt: new Date().toISOString() }, ...(current.uploads || [])],
      stats: { ...current.stats, uploads: current.stats.uploads + 1 },
    }));
    setNotification("Upload recebido. Pipeline FFmpeg/Cloudinary/S3 simulado iniciado.");

    fetch(`${API_URL}/platform/upload`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(upload),
    }).catch(() => {});

    setUpload(initialUpload);
  };

  const followArtist = (artist) => {
    setNotification(`${artist.name} seguido. Notificacoes de lancamento ativadas.`);
    fetch(`${API_URL}/platform/follow`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ artist: artist.name }),
    }).catch(() => {});
  };

  const activeAudio = activeSong?.streamUrl || activeSong?.audio || activeSong?.audioFallback || "";

  useEffect(() => {
    if (!activeSong) return;
    const audio = audioRef.current;
    if (!audio) return;
    audio.src = getSongAudio(activeSong);
    audio.load();
    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false));
    }
  }, [activeSong, isPlaying]);

  return (
    <main className={`platform platform--${theme}`}>
      <section className="platform-hero">
        <div className="platform-hero__copy">
          <p className="platform-kicker">Riffly Platform 2.0</p>
          <h2>Streaming completo para musica, podcasts, radio e artistas.</h2>
          <p>
            Uma experiencia unica com player profissional, uploads, letras sincronizadas,
            downloads offline, estatisticas em tempo real e painel operacional.
          </p>
        </div>
        <div className="platform-hero__actions">
          <button type="button" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            {theme === "dark" ? "Modo claro" : "Modo escuro"}
          </button>
          <button type="button" onClick={() => setNotification("Notificacao enviada para seguidores e admins.")}>
            Notificar
          </button>
        </div>
      </section>

      <section className="platform-stats" aria-label="Estatisticas em tempo real">
        {[
          ["Ouvintes", overview.stats.activeListeners, faBroadcastTower],
          ["Plays", overview.stats.plays, faChartLine],
          ["Offline", overview.stats.downloads, faCloudArrowDown],
          ["Shares", overview.stats.shares, faShareNodes],
          ["Uploads", overview.stats.uploads, faCloudArrowUp],
          ["Seguidores", overview.stats.followers, faUserCheck],
        ].map(([label, value, icon]) => (
          <article className="platform-stat" key={label}>
            <FontAwesomeIcon icon={icon} />
            <span>{label}</span>
            <strong>{formatNumber(value)}</strong>
          </article>
        ))}
      </section>

      <section className="platform-player">
        <div className="platform-player__cover">
          <img src={activeSong?.image} alt={activeSong?.name} />
        </div>
        <div className="platform-player__main">
          <div className="platform-player__meta">
            <p>Player profissional</p>
            <h3>{activeSong?.name}</h3>
            <span>{activeSong?.artist}</span>
          </div>

          <audio ref={audioRef} src={activeAudio} preload="auto" onEnded={() => setIsPlaying(false)} />

          <div className="platform-controls">
            <button type="button" title="Aleatorio"><FontAwesomeIcon icon={faShuffle} /></button>
            <button type="button" title="Anterior"><FontAwesomeIcon icon={faBackwardStep} /></button>
            <button type="button" className="platform-controls__play" title="Reproduzir" onClick={togglePlay}>
              <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
            </button>
            <button type="button" title="Proxima"><FontAwesomeIcon icon={faForwardStep} /></button>
            <button type="button" title="Repetir"><FontAwesomeIcon icon={faRepeat} /></button>
          </div>

          <div className="platform-actions">
            <button type="button" onClick={() => toggleFavorite(activeSong)} className={favorites.has(activeSong?.id) ? "is-active" : ""}>
              <FontAwesomeIcon icon={faHeart} /> Favorito
            </button>
            <button type="button" onClick={() => toggleOffline(activeSong)} className={offline.has(activeSong?.id) ? "is-active" : ""}>
              <FontAwesomeIcon icon={faCloudArrowDown} /> Offline
            </button>
            <button type="button" onClick={shareSong}>
              <FontAwesomeIcon icon={faShareNodes} /> Compartilhar
            </button>
            <button type="button" onClick={() => setNotification("Chromecast, Android Auto e CarPlay preparados na camada Capacitor.")}>
              <FontAwesomeIcon icon={faTowerBroadcast} /> Cast/Auto
            </button>
          </div>
        </div>

        <aside className="platform-eq">
          <h3><FontAwesomeIcon icon={faSliders} /> Equalizador</h3>
          {[
            ["Grave", bass, setBass],
            ["Medio", mid, setMid],
            ["Agudo", treble, setTreble],
            ["Volume", Math.round(volume * 100), (value) => setVolume(value / 100)],
          ].map(([label, value, setter]) => (
            <label key={label}>
              <span>{label}</span>
              <input type="range" min="0" max="100" value={value} onChange={(event) => setter(Number(event.target.value))} />
            </label>
          ))}
        </aside>
      </section>

      <section className="platform-grid">
        <Card className="platform-panel platform-panel--wide">
          <div className="platform-panel__header">
            <h3><FontAwesomeIcon icon={faSearch} /> Busca, trending e novidades</h3>
            <Search value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar musica, artista ou genero" />
          </div>
          <div className="platform-song-list">
            {filteredSongs.slice(0, 10).map((song, index) => (
            <button type="button" className="platform-song-row" key={song._id ?? song.id} onClick={() => playSong(song)}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <img src={song.image} alt="" />
                <strong>{song.name}</strong>
                <em>{song.artist}</em>
                <small>{song.genre || "Musica"}</small>
              </button>
            ))}
          </div>
        </Card>

        <div className="platform-panel">
          <h3><FontAwesomeIcon icon={faMicrophoneLines} /> Letras e karaoke</h3>
          <div className="platform-lyrics">
            {lyricLines.map((line, index) => (
              <p className={index === 1 ? "is-current" : ""} key={line.time}>
                <span>{line.time}</span>{line.text}
              </p>
            ))}
          </div>
        </div>

        <div className="platform-panel">
          <h3><FontAwesomeIcon icon={faGaugeHigh} /> IA recomenda</h3>
          <div className="platform-recs">
            {recommendations.map((song) => (
              <button type="button" key={song._id ?? song.id} onClick={() => playSong(song)}>
                <FontAwesomeIcon icon={faStar} />
                <span>{song.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="platform-panel">
          <h3>Historico recente</h3>
          <div className="platform-recs">
            {history.length ? history.map((song) => (
              <button type="button" key={song._id ?? song.id} onClick={() => playSong(song)}>
                <img src={song.image} alt="" />
                <span>{song.name}</span>
              </button>
            )) : <p>Nenhuma faixa tocada nesta sessao ainda.</p>}
          </div>
        </div>

        <div className="platform-panel">
          <h3><FontAwesomeIcon icon={faPodcast} /> Podcasts, audiobooks e radio</h3>
          <div className="platform-show-list">
            {overview.shows.map((show) => (
              <article key={show.id}>
                <FontAwesomeIcon icon={show.type === "radio" ? faRadio : faPodcast} />
                <div>
                  <strong>{show.title}</strong>
                  <span>{show.category} - {show.duration}</span>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="platform-panel">
          <h3>Playlists</h3>
          <div className="platform-playlists">
            {overview.playlists.map((playlist) => (
              <article key={playlist.id}>
                <strong>{playlist.name}</strong>
                <span>{playlist.description}</span>
                <small>{formatNumber(playlist.followers)} seguidores</small>
              </article>
            ))}
          </div>
        </div>

        <div className="platform-panel">
          <h3>Upload de musica e capa</h3>
          <form className="platform-form" onSubmit={submitUpload}>
            <input value={upload.title} onChange={(event) => setUpload({ ...upload, title: event.target.value })} placeholder="Titulo da faixa" />
            <input value={upload.artist} onChange={(event) => setUpload({ ...upload, artist: event.target.value })} placeholder="Artista" />
            <input value={upload.coverUrl} onChange={(event) => setUpload({ ...upload, coverUrl: event.target.value })} placeholder="URL da capa" />
            <input value={upload.audioUrl} onChange={(event) => setUpload({ ...upload, audioUrl: event.target.value })} placeholder="URL do audio" />
            <button type="submit">Enviar para processamento</button>
          </form>
        </div>

        <div className="platform-panel">
          <h3>Perfil do artista</h3>
          <div className="platform-artists">
            {artists.slice(0, 5).map((artist) => (
              <button type="button" key={artist._id ?? artist.id} onClick={() => followArtist(artist)}>
                <img src={artist.image} alt="" />
                <span>{artist.name}</span>
                <FontAwesomeIcon icon={faUserCheck} />
              </button>
            ))}
          </div>
        </div>

        <div className="platform-panel">
          <h3><FontAwesomeIcon icon={faComment} /> Comentarios</h3>
          <form className="platform-comment" onSubmit={sendComment}>
            <input value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Comentar na faixa atual" />
            <button type="submit">Enviar</button>
          </form>
          <div className="platform-comments">
            {comments.slice(0, 4).map((item, index) => (
              <p key={`${item.createdAt}-${index}`}><strong>{item.author}</strong> {item.text}</p>
            ))}
          </div>
        </div>

        <div className="platform-panel platform-panel--wide">
          <h3>Painel admin e API documentada</h3>
          <div className="platform-admin">
            <div>
              <strong>Pipeline tecnico</strong>
              <span>Node, Express, JWT, MongoDB Atlas, Redis, Socket.IO, Cloudinary, S3, FFmpeg, BullMQ, Swagger, Docker e Nginx preparados como arquitetura alvo.</span>
            </div>
            <div>
              <strong>Eventos recentes</strong>
              <span>{overview.realtime?.[0]?.label || notification}</span>
            </div>
            <div>
              <strong>API</strong>
              <span>GET /api/platform/overview, POST /upload, /events, /comments e /follow.</span>
            </div>
          </div>
        </div>

        <div className="platform-panel platform-panel--wide">
          <h3>Checklist competitivo</h3>
          <div className="platform-features">
            {overview.features.map((feature) => (
              <span key={feature}>{feature}</span>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Platform;
