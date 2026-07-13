import React from "react";
import riffly from "../assets/logo/riffly.png";
import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import { useAuth } from "../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faUser, faList, faRocket } from "@fortawesome/free-solid-svg-icons";

const Header = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <header className="header">
      <Link to="/" className="header__brand">
        <img src={riffly} alt="Riffly" className="header__logo" />
        <div className="header__brand-text">
          <h1>Riffly</h1>
          <p>Seu player musical inteligente</p>
        </div>
      </Link>

      <nav className="header__nav">
        <Link to="/platform" title="Plataforma" className="header__icon">
          <FontAwesomeIcon icon={faRocket} />
        </Link>
        <Link to="/plans" title="Planos" className="header__icon">
          <FontAwesomeIcon icon={faList} />
        </Link>
        <Link to="/favorites" title="Favoritos" className="header__icon">
          <FontAwesomeIcon icon={faHeart} />
        </Link>
        <Link to={isAuthenticated ? "/" : "/login"} title={isAuthenticated ? `${user?.name}` : "Fazer login"} className="header__icon">
          <FontAwesomeIcon icon={faUser} />
        </Link>
        <ThemeToggle />
      </nav>
    </header>
  );
};

export default Header;
