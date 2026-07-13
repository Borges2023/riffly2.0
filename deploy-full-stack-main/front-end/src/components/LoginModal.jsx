// src/components/LoginModal.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle, faFacebook } from "@fortawesome/free-brands-svg-icons";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const LoginModal = ({ isOpen, onClose }) => {
  const {
    loginGoogle,
    loginFacebook,
    loginGuest,
    loginLocal,
    authError,
    googleConfigured,
    facebookConfigured,
    isAuthenticated,
  } = useAuth();

  const [localName, setLocalName] = useState("");
  const [localEmail, setLocalEmail] = useState("");
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    if (isAuthenticated && isOpen) {
      onClose();
    }
  }, [isAuthenticated, isOpen, onClose]);

  if (!isOpen) return null;

  const handleLoginGoogle = () => {
    loginGoogle();
  };

  const handleLoginFacebook = () => {
    loginFacebook();
  };

  const handleLoginGuest = () => {
    loginGuest();
  };

  const handleLoginLocal = () => {
    if (!localName.trim() || !localEmail.trim()) {
      setLocalError("Informe nome e email para entrar localmente.");
      return;
    }
    loginLocal({ name: localName.trim(), email: localEmail.trim() });
    setLocalError("");
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} />
        </button>

        <h2>Bem-vindo ao Riffly</h2>
        <p>Faça login para acessar seus favoritos e playlists</p>

        <div className="login-options">
          <button
            className="login-btn login-btn--google"
            onClick={handleLoginGoogle}
            disabled={!googleConfigured}
            title={!googleConfigured ? "Google OAuth não configurado" : "Continuar com Google"}
          >
            <FontAwesomeIcon icon={faGoogle} />
            Continuar com Google
          </button>

          <button
            className="login-btn login-btn--facebook"
            onClick={handleLoginFacebook}
            disabled={!facebookConfigured}
            title={!facebookConfigured ? "Facebook OAuth não configurado" : "Continuar com Facebook"}
          >
            <FontAwesomeIcon icon={faFacebook} />
            Continuar com Facebook
          </button>
        </div>

        {authError && <p className="login-error">{authError}</p>}

        <div className="login-local-form">
          <h3>Login local</h3>
          <label>
            Nome
            <input
              type="text"
              value={localName}
              onChange={(e) => setLocalName(e.target.value)}
              placeholder="Seu nome"
            />
          </label>
          <label>
            Email
            <input
              type="email"
              value={localEmail}
              onChange={(e) => setLocalEmail(e.target.value)}
              placeholder="seu@email.com"
            />
          </label>
          <button className="login-btn login-btn--local" onClick={handleLoginLocal}>
            Entrar com email local
          </button>
          {localError && <p className="login-error">{localError}</p>}
        </div>

        <button className="login-btn login-btn--guest" onClick={handleLoginGuest}>
          Entrar como convidado
        </button>

        <p className="login-privacy">
          Ao fazer login, você concorda com nossos Termos de Serviço e Política de
          Privacidade.
        </p>
      </div>
    </div>
  );
};

export default LoginModal;
