import Header from "./components/Header";
import { HashRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { AuthProvider } from "./context/AuthContext";
import { FavoritesProvider } from "./context/FavoritesContext";
import { ThemeProvider } from "./context/ThemeContext";
import { PlanProvider } from "./context/PlanContext";
import { AdProvider } from "./context/AdContext";
import { AdminProvider } from "./context/AdminContext";
import { PlaybackProvider } from "./context/PlaybackContext";
import { UiFeedbackProvider } from "./context/UiFeedbackContext.jsx";
import AdNotification from "./components/ads/AdNotification";
import PlayerNew from "./components/PlayerNew";
import { ToastViewport } from "./components/ui/ToastViewport.jsx";

const Home = lazy(() => import("./pages/Home"));
const Artists = lazy(() => import("./pages/Artists"));
const Artist = lazy(() => import("./pages/Artist"));
const Songs = lazy(() => import("./pages/Songs"));
const Song = lazy(() => import("./pages/Song"));
const Login = lazy(() => import("./pages/Login"));
const Favorites = lazy(() => import("./pages/Favorites"));
const Plans = lazy(() => import("./pages/Plans"));
const Admin = lazy(() => import("./pages/Admin"));
const Platform = lazy(() => import("./pages/Platform"));
const Library = lazy(() => import("./pages/Library"));
const Profile = lazy(() => import("./pages/Profile"));
const Analytics = lazy(() => import("./pages/Analytics"));

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <FavoritesProvider>
          <PlanProvider>
            <AdProvider>
              <UiFeedbackProvider>
                <PlaybackProvider>
                  <AdminProvider>
                    <HashRouter>
                      <Header />
                      <AdNotification />
                      <Suspense fallback={<div className="loading-screen">Carregando...</div>}>
                        <Routes>
                          <Route path="/" element={<Home />} />
                          <Route path="/artists" element={<Artists />} />
                          <Route path="/artist/:id" element={<Artist />} />
                          <Route path="/songs" element={<Songs />} />
                          <Route path="/song/:id" element={<Song />} />
                          <Route path="/login" element={<Login />} />
                          <Route path="/favorites" element={<Favorites />} />
                          <Route path="/library" element={<Library />} />
                          <Route path="/profile" element={<Profile />} />
                          <Route path="/analytics" element={<Analytics />} />
                          <Route path="/plans" element={<Plans />} />
                          <Route path="/admin" element={<Admin />} />
                          <Route path="/platform" element={<Platform />} />
                        </Routes>
                      </Suspense>
                      <PlayerNew />
                      <ToastViewport />
                    </HashRouter>
                  </AdminProvider>
                </PlaybackProvider>
              </UiFeedbackProvider>
            </AdProvider>
          </PlanProvider>
        </FavoritesProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
