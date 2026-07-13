/* eslint-disable react/prop-types */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faPause,
  faStepBackward,
  faStepForward,
  faVolumeUp,
  faMusic,
  faSliders,
  faRandom,
  faWindowMinimize,
  faClosedCaptioning,
  faDisplay,
  faKeyboard,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { usePlan } from "../context/PlanContext";
import { useAds } from "../context/AdContext";
import { usePlayback } from "../context/PlaybackContext";
import { useFavorites } from "../context/FavoritesContext";
import { getPreferredStreamSource, getStreamingSources, getNextPreloadSource } from "../utils/streaming.js";
import { Badge, Card } from "../design-system/index.js";
import "../styles/player.css";

const lyrics = [
  { time: "00:04", text: "A primeira nota acende a sala" },
  { time: "00:12", text: "Todo mundo canta junto no refrão" },
  { time: "00:20", text: "Riffly leva o palco para a palma da mão" },
  { time: "00:32", text: "No modo karaoke, a voz principal é sua" },
];

const formatTime = (time) => {
  if (!time || Number.isNaN(time)) return "0:00";
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

const Player = ({ currentSong: currentSongProp, songs: songsProp = [] }) => {
  const { currentSong: playbackSong, songs: playbackSongs, setCurrentSong, isMiniPlayer, setIsMiniPlayer } = usePlayback();
  const { recordPlay } = useFavorites();
  const currentSong = currentSongProp || playbackSong;
  const songs = songsProp.length ? songsProp : playbackSongs;
  const audioRef = useRef(null);
  const nextAudioRef = useRef(null);
  const sourceIndexRef = useRef(0);
  const wasPlayingBeforeAdRef = useRef(false);
  const hasMidAdShownRef = useRef(false);
  const hasEndAdShownRef = useRef(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [crossfadeEnabled, setCrossfadeEnabled] = useState(true);
  const [gaplessEnabled, setGaplessEnabled] = useState(true);
  const [showLyrics, setShowLyrics] = useState(true);
  const [showQueue, setShowQueue] = useState(true);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [equalizer, setEqualizer] = useState({ bass: 50, mid: 50, treble: 50 });
  const [audioSources, setAudioSources] = useState(() => getStreamingSources(currentSong));
  const [audioSource, setAudioSource] = useState(() => getPreferredStreamSource(currentSong));
  const [adPaused, setAdPaused] = useState(false);
  const navigate = useNavigate();
  const { isFree } = usePlan();
  const { showRandomAd, showAd } = useAds();

  const queue = useMemo(() => {
    if (!songs.length || !currentSong) return [];
    const currentIndex = songs.findIndex(
      (song) => song?._id === currentSong?._id || String(song?.id) === String(currentSong?.id)
    );
    if (currentIndex < 0) return songs.slice(0, 6);
    return [...songs.slice(currentIndex + 1), ...songs.slice(0, currentIndex)].slice(0, 6);
  }, [songs, currentSong]);

  const currentLyricLine = useMemo(() => {
    if (!duration) return lyrics[0];
    const ratio = currentTime / Math.max(duration, 1);
    if (ratio > 0.75) return lyrics[3];
    if (ratio > 0.5) return lyrics[2];
    if (ratio > 0.25) return lyrics[1];
    return lyrics[0];
  }, [currentTime, duration]);

  const handlePlayPause = useCallback(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  }, [isPlaying]);

  useEffect(() => {
    if (currentSong && isPlaying) {
      recordPlay(currentSong);
    }
  }, [currentSong, isPlaying, recordPlay]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration || 0);
    const handleEnded = () => {
      setIsPlaying(false);
      if (isFree && !hasEndAdShownRef.current) {
        hasEndAdShownRef.current = true;
        setTimeout(() => showRandomAd(), 500);
      }
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);
    audio.playbackRate = playbackRate;

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [isFree, showRandomAd, playbackRate]);

  useEffect(() => {
    if (!currentSong) return;
    hasMidAdShownRef.current = false;
    hasEndAdShownRef.current = false;
    sourceIndexRef.current = 0;
    setAdPaused(false);
    setCurrentTime(0);
    setDuration(0);
    const nextSources = getStreamingSources(currentSong);
    setAudioSources(nextSources);
    setAudioSource(getPreferredStreamSource(currentSong));
    if (audioRef.current) {
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play().catch(() => {});
      }
    }
  }, [currentSong, isPlaying]);

  useEffect(() => {
    if (!currentSong || !audioRef.current) return;
    audioRef.current.playbackRate = playbackRate;
    audioRef.current.volume = volume;
  }, [currentSong, playbackRate, volume]);

  useEffect(() => {
    if (!audioRef.current) return;
    if (showAd) {
      if (!audioRef.current.paused) {
        wasPlayingBeforeAdRef.current = true;
        audioRef.current.pause();
        setAdPaused(true);
        setIsPlaying(false);
      }
      return;
    }
    if (adPaused && audioRef.current && !audioRef.current.ended) {
      if (wasPlayingBeforeAdRef.current) {
        audioRef.current.play().catch(() => {});
      }
      wasPlayingBeforeAdRef.current = false;
      setAdPaused(false);
      setIsPlaying(true);
    }
  }, [showAd, adPaused]);

  useEffect(() => {
    if (!isFree || !isPlaying || duration === 0 || hasMidAdShownRef.current || showAd) return;
    const adTriggerTime = duration * 0.3;
    if (currentTime >= adTriggerTime) {
      hasMidAdShownRef.current = true;
      showRandomAd();
    }
  }, [currentTime, duration, isFree, isPlaying, showAd, showRandomAd]);

  const handleSeek = useCallback((delta) => {
    if (!audioRef.current) return;
    const nextTime = Math.min(Math.max((audioRef.current.currentTime || 0) + delta, 0), duration || 0);
    audioRef.current.currentTime = nextTime;
    setCurrentTime(nextTime);
  }, [duration]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.target && ["INPUT", "TEXTAREA", "SELECT"].includes(event.target.tagName)) return;
      if (event.code === "Space") {
        event.preventDefault();
        handlePlayPause();
      }
      if (event.code === "ArrowRight") {
        event.preventDefault();
        handleSeek(10);
      }
      if (event.code === "ArrowLeft") {
        event.preventDefault();
        handleSeek(-10);
      }
      if (event.key?.toLowerCase() === "m") {
        event.preventDefault();
        setVolume((value) => (value > 0 ? 0 : 1));
      }
      if (event.key?.toLowerCase() === "l") {
        event.preventDefault();
        setShowLyrics((value) => !value);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlePlayPause, handleSeek]);

  const findCurrentIndex = () =>
    songs.findIndex((song) => song?._id === currentSong?._id || String(song?.id) === String(currentSong?.id));

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) audioRef.current.volume = newVolume;
  };

  const handleProgressChange = (e) => {
    const newTime = parseFloat(e.target.value);
    if (audioRef.current) audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const fadeAudio = (audio, from, to, durationMs = 300) =>
    new Promise((resolve) => {
      if (!audio) {
        resolve();
        return;
      }
      const steps = 10;
      const interval = durationMs / steps;
      let step = 0;
      audio.volume = from;
      const timer = window.setInterval(() => {
        step += 1;
        const nextVolume = from + ((to - from) * step) / steps;
        audio.volume = Math.max(0, Math.min(1, nextVolume));
        if (step >= steps) {
          window.clearInterval(timer);
          resolve();
        }
      }, interval);
    });

  const startSongWithTransition = async (song) => {
    if (!song || !audioRef.current) return;
    const nextSource = getPreferredStreamSource(song);
    if (!nextSource) return;

    if (!isPlaying) {
      setCurrentSong(song);
      return;
    }

    if (crossfadeEnabled) {
      const nextAudio = nextAudioRef.current || new Audio();
      nextAudioRef.current = nextAudio;
      nextAudio.src = nextSource;
      nextAudio.preload = "auto";
      nextAudio.crossOrigin = "anonymous";
      nextAudio.volume = 0;
      nextAudio.playbackRate = playbackRate;
      nextAudio.load();

      try {
        await nextAudio.play();
      } catch {
        setCurrentSong(song);
        return;
      }

      await fadeAudio(audioRef.current, volume, 0, 250);
      setCurrentSong(song);
      audioRef.current.src = nextSource;
      audioRef.current.load();
      audioRef.current.playbackRate = playbackRate;
      audioRef.current.volume = 0;
      await audioRef.current.play().catch(() => {});
      await fadeAudio(audioRef.current, 0, volume, 250);
      nextAudio.pause();
      return;
    } else {
      if (gaplessEnabled) {
        setCurrentSong(song);
        return;
      }
      await fadeAudio(audioRef.current, volume, 0, 120);
      setCurrentSong(song);
      audioRef.current.src = nextSource;
      audioRef.current.load();
      await audioRef.current.play().catch(() => {});
      audioRef.current.volume = volume;
    }
  };

  const handlePrevious = () => {
    if (!songs.length) return;
    const currentIndex = findCurrentIndex();
    const previousSong = songs[(currentIndex - 1 + songs.length) % songs.length];
    if (previousSong) startSongWithTransition(previousSong).then(() => navigate(`/song/${previousSong._id ?? previousSong.id}`));
  };

  const handleNext = () => {
    if (!songs.length) return;
    const currentIndex = findCurrentIndex();
    const nextSong = songs[(currentIndex + 1) % songs.length];
    if (nextSong) startSongWithTransition(nextSong).then(() => navigate(`/song/${nextSong._id ?? nextSong.id}`));
  };

  const preloadNextTrack = () => {
    const nextSource = getNextPreloadSource(songs, currentSong);
    if (!nextSource) return;
    const preloader = new Audio();
    preloader.preload = "auto";
    preloader.src = nextSource;
    preloader.load();
  };

  const toggleMiniPlayer = () => {
    setIsMiniPlayer((value) => !value);
  };

  const togglePiP = async () => {
    if (!document.pictureInPictureEnabled) return;
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else if (audioRef.current) {
        const video = document.createElement("video");
        video.src = audioRef.current.src;
        await video.requestPictureInPicture();
      }
    } catch {
      // Browser may block PiP for audio-only media.
    }
  };

  const formatEqualizerLabel = (value) => `${value}%`;

  if (!currentSong) {
    return (
      <div className="player-container">
        <div className="player-placeholder">
          <FontAwesomeIcon icon={faMusic} />
          <p>Selecione uma música para reproduzir</p>
        </div>
      </div>
    );
  }

  return (
    <Card className={`player-container ${isMiniPlayer ? "is-mini" : ""}`}>
      <audio
        ref={audioRef}
        src={audioSource}
        preload="auto"
        crossOrigin="anonymous"
        onError={() => {
          const nextIndex = sourceIndexRef.current + 1;
          const nextSource = audioSources[nextIndex];
          if (nextSource) {
            sourceIndexRef.current = nextIndex;
            setAudioSource(nextSource);
            if (audioRef.current) {
              audioRef.current.load();
              if (isPlaying) {
                audioRef.current.play().catch(() => {});
              }
            }
          }
        }}
        onCanPlay={() => {
          if (audioRef.current) audioRef.current.playbackRate = playbackRate;
        }}
      />

      <div className="player-visualizer" aria-hidden="true">
        {[1, 2, 3, 4, 5, 6].map((bar) => (
          <span key={bar} className={`player-visualizer__bar player-visualizer__bar--${bar}`} />
        ))}
      </div>

      <div className="player-info">
        <img src={currentSong.image} alt={currentSong.name} className="player-album" />
        <div className="player-details">
          <h3 className="player-song-name">{currentSong.name}</h3>
          <p className="player-artist-name">{currentSong.artist}</p>
          {isFree ? <Badge tone="success">Versão Free - anúncios ativados</Badge> : null}
          <div className="player-meta-row">
            <span>{crossfadeEnabled ? "Crossfade ativo" : "Crossfade desligado"}</span>
            <span>{gaplessEnabled ? "Gapless ativo" : "Gapless desligado"}</span>
            <span>Replay Gain: Auto</span>
          </div>
        </div>
      </div>

      <div className="player-progress">
        <span className="player-time">{formatTime(currentTime)}</span>
        <input
          type="range"
          min="0"
          max={duration || 0}
          value={currentTime}
          onChange={handleProgressChange}
          className="player-progress-bar"
        />
        <span className="player-time">{formatTime(duration)}</span>
      </div>

      <div className="player-lyrics-preview">
        <button type="button" className="player-pill" onClick={() => setShowLyrics((value) => !value)}>
          <FontAwesomeIcon icon={faClosedCaptioning} /> {showLyrics ? "Ocultar letras" : "Mostrar letras"}
        </button>
        <p className="player-lyrics-line">
          <strong>{currentLyricLine.time}</strong> {currentLyricLine.text}
        </p>
      </div>

      {showLyrics ? (
        <div className="player-lyrics-panel">
          {lyrics.map((line) => (
            <p key={line.time} className={line.time === currentLyricLine.time ? "is-current" : ""}>
              <span>{line.time}</span>
              {line.text}
            </p>
          ))}
        </div>
      ) : null}

      {showQueue ? (
        <div className="player-queue">
          <div className="player-section-header">
            <h4>Fila inteligente</h4>
            <button type="button" className="player-link-button" onClick={() => setShowQueue(false)}>
              Ocultar
            </button>
          </div>
          {queue.map((song) => (
            <button
              key={song._id ?? song.id}
              type="button"
              className="player-queue-item"
              onClick={() => navigate(`/song/${song._id ?? song.id}`)}
            >
              <img src={song.image} alt="" />
              <span>
                <strong>{song.name}</strong>
                <small>{song.artist}</small>
              </span>
            </button>
          ))}
        </div>
      ) : (
        <button type="button" className="player-pill player-pill--floating" onClick={() => setShowQueue(true)}>
          Mostrar fila
        </button>
      )}

      <div className="player-controls">
        <button type="button" className="player-button" onClick={handlePrevious} title="Anterior">
          <FontAwesomeIcon icon={faStepBackward} />
        </button>
        <button type="button" className="player-button player-play-button" onClick={handlePlayPause} title={isPlaying ? "Pausar" : "Reproduzir"}>
          <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
        </button>
        <button type="button" className="player-button" onClick={handleNext} title="Próxima">
          <FontAwesomeIcon icon={faStepForward} />
        </button>
        <button type="button" className="player-button" onClick={preloadNextTrack} title="Pré-carregar próxima">
          <FontAwesomeIcon icon={faMusic} />
        </button>
        <button type="button" className="player-button" onClick={() => setCrossfadeEnabled((value) => !value)} title="Crossfade">
          <FontAwesomeIcon icon={faRandom} />
        </button>
        <button type="button" className="player-button" onClick={() => setGaplessEnabled((value) => !value)} title="Gapless">
          <FontAwesomeIcon icon={faSliders} />
        </button>
        <button type="button" className="player-button" onClick={toggleMiniPlayer} title="Mini player">
          <FontAwesomeIcon icon={faWindowMinimize} />
        </button>
        <button type="button" className="player-button" onClick={togglePiP} title="Picture in Picture">
          <FontAwesomeIcon icon={faDisplay} />
        </button>
        <button type="button" className="player-button" onClick={() => setShowShortcuts((value) => !value)} title="Atalhos">
          <FontAwesomeIcon icon={faKeyboard} />
        </button>
        <div className="player-volume">
          <FontAwesomeIcon icon={faVolumeUp} className="player-volume-icon" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={handleVolumeChange}
            className="player-volume-slider"
            title="Volume"
          />
        </div>
      </div>

      <div className="player-settings">
        <label>
          <span>Velocidade</span>
          <select
            value={playbackRate}
            onChange={(event) => {
              const rate = Number(event.target.value);
              setPlaybackRate(rate);
              if (audioRef.current) audioRef.current.playbackRate = rate;
            }}
          >
            <option value="0.75">0.75x</option>
            <option value="1">1x</option>
            <option value="1.25">1.25x</option>
            <option value="1.5">1.5x</option>
          </select>
        </label>
        <label>
          <span>Baixo {formatEqualizerLabel(equalizer.bass)}</span>
          <input
            type="range"
            min="0"
            max="100"
            value={equalizer.bass}
            onChange={(event) => setEqualizer({ ...equalizer, bass: Number(event.target.value) })}
          />
        </label>
        <label>
          <span>Médio {formatEqualizerLabel(equalizer.mid)}</span>
          <input
            type="range"
            min="0"
            max="100"
            value={equalizer.mid}
            onChange={(event) => setEqualizer({ ...equalizer, mid: Number(event.target.value) })}
          />
        </label>
        <label>
          <span>Agudo {formatEqualizerLabel(equalizer.treble)}</span>
          <input
            type="range"
            min="0"
            max="100"
            value={equalizer.treble}
            onChange={(event) => setEqualizer({ ...equalizer, treble: Number(event.target.value) })}
          />
        </label>
      </div>

      {showShortcuts ? (
        <div className="player-shortcuts">
          <strong>Atalhos</strong>
          <span>Space: play/pause</span>
          <span>←/→: voltar/avançar 10s</span>
          <span>M: mute</span>
          <span>L: letras</span>
        </div>
      ) : null}
    </Card>
  );
};

export default Player;
