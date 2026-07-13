import riffly from "../assets/logo/riffly.png";
import ThemeToggle from "./ThemeToggle";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faUser, faList, faRocket } from "@fortawesome/free-solid-svg-icons";
import { Navbar, Sidebar, Button } from "../design-system/index.js";

const Header = () => {
  const { isAuthenticated, user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <Navbar
        brand={
          <span className="header__brand">
            <img src={riffly} alt="Riffly" className="header__logo" />
            <span className="header__brand-text">
              <strong>Riffly</strong>
              <small>Seu player musical inteligente</small>
            </span>
          </span>
        }
        items={[
          { to: "/platform", label: <FontAwesomeIcon icon={faRocket} title="Plataforma" /> },
          { to: "/library", label: <FontAwesomeIcon icon={faList} title="Biblioteca" /> },
          { to: "/analytics", label: <FontAwesomeIcon icon={faHeart} title="Analytics" /> },
          { to: "/favorites", label: <FontAwesomeIcon icon={faHeart} title="Favoritos" /> },
          { to: isAuthenticated ? "/profile" : "/login", label: <FontAwesomeIcon icon={faUser} title={isAuthenticated ? `${user?.name}` : "Fazer login"} /> },
        ]}
        rightSlot={
          <div className="header__actions">
            <Button variant="secondary" className="header__menu-button" onClick={() => setMobileMenuOpen(true)}>
              Menu
            </Button>
            <ThemeToggle />
          </div>
        }
      />

      {mobileMenuOpen ? (
        <Sidebar title="Navegação">
          <button type="button" className="header__sidebar-close" onClick={() => setMobileMenuOpen(false)}>
            Fechar
          </button>
          <div className="header__sidebar-links">
            <a href="#/platform">Plataforma</a>
            <a href="#/library">Biblioteca</a>
            <a href="#/analytics">Analytics</a>
            <a href="#/favorites">Favoritos</a>
            <a href={isAuthenticated ? "#/profile" : "#/login"}>{isAuthenticated ? user?.name : "Login"}</a>
          </div>
        </Sidebar>
      ) : null}
    </>
  );
};

export default Header;
