import React, { useRef, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faPause,
  faStepBackward,
  faStepForward,
  faVolumeUp,
  faMusic,
} from "@fortawesome/free-solid-svg-icons";
import { usePlan } from "../context/PlanContext";
import { useAds } from "../context/AdContext";
import "../styles/player.css";

/**
 * 🎵 PLAYER COM SISTEMA DE ANÚNCIOS ATIVO
 * 
 * Funcionalidades:
 * ✅ Reprodução de áudio local e remoto (fallback)
 * ✅ Anúncios para usuários FREE em 2 pontos:
 *    - 30% de progresso da música
 *    - Ao final da música
 * ✅ Sem anúncios para PREMIUM
 * ✅ Métrica de visualizações rastreada
 * 
 * Componentes usados:
 * - usePlan: Determina se usuário é FREE ou PREMIUM
 * - useAds: Controla exibição de anúncios (showRandomAd)
 */
const Player = ({ currentSong, songs = [] }) => {
  const audioRef = useRef(null);
  const wasPlayingBeforeAdRef = useRef(false);
  const hasMidAdShownRef = useRef(false);
  const hasEndAdShownRef = useRef(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [audioSource, setAudioSource] = useState(currentSong?.audio || currentSong?.audioFallback || "");
  const [adPaused, setAdPaused] = useState(false);
  const { isFree } = usePlan(); // ✅ Identifica usuários FREE
  const { showRandomAd, showAd } = useAds(); // ✅ Função para mostrar anúncios e estado de exibição

  // Event listeners para o áudio
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      // 📢 ANÚNCIO #2: Ao final da música (USUÁRIOS FREE)
      if (isFree && !hasEndAdShownRef.current) {
        hasEndAdShownRef.current = true;
        setTimeout(() => {
          showRandomAd(); // ✅ ATIVA ANÚNCIO
        }, 500);
      }
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [isFree, showRandomAd]);

  useEffect(() => {
    if (!currentSong) return;
    hasMidAdShownRef.current = false;
    hasEndAdShownRef.current = false;
    setAdPaused(false);
    setAudioSource(currentSong.audio || currentSong.audioFallback || "");
  }, [currentSong?.audio, currentSong?.audioFallback]);

  useEffect(() => {
    if (!audioRef.current) return;

    if (showAd) {
      if (!audioRef.current.paused) {
        wasPlayingBeforeAdRef.current = true;
        audioRef.current.pause();
        setAdPaused(true);
        setIsPlaying(false);
      }
    } else if (adPaused && audioRef.current && !audioRef.current.ended) {
      if (wasPlayingBeforeAdRef.current) {
        audioRef.current.play().catch(() => {});
      }
      wasPlayingBeforeAdRef.current = false;
      setAdPaused(false);
      setIsPlaying(true);
    }
  }, [showAd, adPaused]);

  /**
   * 📢 ANÚNCIO #1: Mostrar anúncio a cada 30% da música
   * Apenas para usuários FREE durante reprodução
   */
  useEffect(() => {
    if (!isFree || !isPlaying || duration === 0 || hasMidAdShownRef.current || showAd) return;

    const adTriggerTime = duration * 0.3; // 30% da música

    if (currentTime >= adTriggerTime) {
      hasMidAdShownRef.current = true;
      showRandomAd(); // ✅ ATIVA ANÚNCIO
    }
  }, [currentTime, duration, isFree, isPlaying, showAd, showRandomAd]);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const handleProgressChange = (e) => {
    const newTime = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
    setCurrentTime(newTime);
  };

  const handlePrevious = () => {
    // Implementar lógica de música anterior
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  };

  const handleNext = () => {
    // Implementar lógica de próxima música
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  };

  const formatTime = (time) => {
    if (!time || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

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
    <div className="player-container">
      {/* 
        📁 SISTEMA DE CARREGAMENTO DE ÁUDIO:
        1. Tenta carregar audio LOCAL (/audio/xxx.mp3)
        2. Se local falhar, carrega audioFallback (S3 AWS)
        3. crossOrigin="anonymous" permite CORS
      */}
      <audio
        ref={audioRef}
        src={audioSource}
        crossOrigin="anonymous"
        onError={() => {
          if (audioSource !== currentSong.audioFallback && currentSong.audioFallback) {
            setAudioSource(currentSong.audioFallback);
          }
        }}
      />

      {/* Song Info */}
      <div className="player-info">
        <img src={currentSong.image} alt={currentSong.name} className="player-album" />
        <div className="player-details">
          <h3 className="player-song-name">{currentSong.name}</h3>
          <p className="player-artist-name">{currentSong.artist}</p>
          {isFree && (
            <span className="player-free-badge">
              🆓 Versão Free - Anúncios ativados
            </span>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="player-progress">
        <span className="player-time">{formatTime(currentTime)}</span>
        <input
          type="range"
          min="0"
          max={duration}
          value={currentTime}
          onChange={handleProgressChange}
          className="player-progress-bar"
        />
        <span className="player-time">{formatTime(duration)}</span>
      </div>

      {/* Controls */}
      <div className="player-controls">
        <button
          className="player-button"
          onClick={handlePrevious}
          title="Anterior"
        >
          <FontAwesomeIcon icon={faStepBackward} />
        </button>

        <button
          className="player-button player-play-button"
          onClick={handlePlayPause}
          title={isPlaying ? "Pausar" : "Reproduzir"}
        >
          <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
        </button>

        <button
          className="player-button"
          onClick={handleNext}
          title="Próxima"
        >
          <FontAwesomeIcon icon={faStepForward} />
        </button>

        {/* Volume Control */}
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
    </div>
  );
};

export default Player;
