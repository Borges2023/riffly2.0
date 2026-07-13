import React from "react";
import Header from "./components/Header";
import { HashRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { FavoritesProvider } from "./context/FavoritesContext";
import { ThemeProvider } from "./context/ThemeContext";
import { PlanProvider } from "./context/PlanContext";
import { AdProvider } from "./context/AdContext";
import { AdminProvider } from "./context/AdminContext";
import AdNotification from "./components/ads/AdNotification";
import Home from "./pages/Home";
import Artists from "./pages/Artists";
import Artist from "./pages/Artist";
import Songs from "./pages/Songs";
import Song from "./pages/Song";
import Login from "./pages/Login";
import Favorites from "./pages/Favorites";
import Plans from "./pages/Plans";
import Admin from "./pages/Admin";
import Platform from "./pages/Platform";

/**
 * 🎵 RIFFLY v1.1 - APLICATIVO DE STREAMING DE MÚSICA
 * 
 * ✅ TODOS OS SISTEMAS ATIVADOS:
 * 1. 📢 AdProvider - Sistema de anúncios (FREE users)
 * 2. 💳 PlanProvider - Planos FREE/PREMIUM
 * 3. 🎵 21 Músicas cadastradas e disponíveis
 * 4. 🎧 PlayerNew.jsx - Player com anúncios integrados
 * 5. ❤️ FavoritesProvider - Favoritos do usuário
 * 6. 👤 AuthProvider - Autenticação de usuário
 * 7. 🎨 ThemeProvider - Modo claro/escuro
 * 
 * FLUXO DE ANÚNCIOS:
 * Usuário FREE reproduz música → 30% exibe anúncio → Fim exibe outro
 * Usuário PREMIUM reproduz música → Sem anúncios
 */
const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <FavoritesProvider>
          <PlanProvider>
            {/* 📢 PROVIDER DE ANÚNCIOS - ATIVADO */}
            <AdProvider>
              <AdminProvider>
                <HashRouter>
                  <Header />
                  {/* 🎬 COMPONENTE DE ANÚNCIO - RENDERIZADO GLOBALMENTE */}
                  <AdNotification />

                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/artists" element={<Artists />} />
                    <Route path="/artist/:id" element={<Artist />} />
                    <Route path="/songs" element={<Songs />} />
                    <Route path="/song/:id" element={<Song />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/favorites" element={<Favorites />} />
                    <Route path="/plans" element={<Plans />} />
                    <Route path="/admin" element={<Admin />} />
                    <Route path="/platform" element={<Platform />} />
                  </Routes>
                </HashRouter>
              </AdminProvider>
            </AdProvider>
          </PlanProvider>
        </FavoritesProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
