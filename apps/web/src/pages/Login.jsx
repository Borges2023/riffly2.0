// src/pages/Login.jsx
import React, { useState } from "react";
import LoginModal from "../components/LoginModal";
import { useAuth } from "../context/AuthContext";
import { usePlan } from "../context/PlanContext";
import { Link } from "react-router-dom";

const Login = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { isPremium } = usePlan();
  const [showModal, setShowModal] = useState(false);

  if (isAuthenticated && user) {
    return (
      <div className="main" style={{ padding: "40px 20px" }}>
        <section className="auth-section">
          <h1>Bem-vindo, {user.name}!</h1>
          <div className="user-profile">
            {user.avatar && <img src={user.avatar} alt={user.name} />}
            <p>Email: {user.email}</p>
          </div>
          <button onClick={logout} className="btn btn--secondary">
            Sair
          </button>
          <Link to="/" className="btn btn--primary" style={{ marginTop: "10px" }}>
            Voltar ao início
          </Link>

          {!isPremium && (
            <div style={{ marginTop: "20px" }}>
              <p>
                Para ativar um plano premium, escolha a forma de pagamento no painel de planos.
              </p>
              <Link to="/plans" className="btn btn--primary">
                Ir para Planos
              </Link>
            </div>
          )}
        </section>
      </div>
    );
  }

  return (
    <div className="main" style={{ padding: "40px 20px" }}>
      <section className="auth-section">
        <h1>Acesse sua conta</h1>
        <p>Faça login para acessar suas músicas, favoritos e playlists.</p>
        <button onClick={() => setShowModal(true)} className="btn btn--primary">
          Fazer login
        </button>
        <Link to="/">Voltar ao início</Link>
      </section>

      <LoginModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
};

export default Login;
