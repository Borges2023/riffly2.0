// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from "react";
import { useGoogleLogin } from "@react-oauth/google";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState(null);
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";
  const googleConfigured = googleClientId && googleClientId !== "YOUR_GOOGLE_CLIENT_ID";
  const facebookAppId = import.meta.env.VITE_FACEBOOK_APP_ID || "";
  const facebookConfigured = facebookAppId && facebookAppId !== "YOUR_FACEBOOK_APP_ID";

  // Google Login Configuration
  const googleLogin = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      try {
        if (!codeResponse?.id_token) {
          throw new Error("Token do Google não foi retornado.");
        }

        const response = await fetch("https://oauth2.googleapis.com/tokeninfo?id_token=" + codeResponse.id_token);
        const tokenInfo = await response.json();

        const googleUser = {
          name: tokenInfo.name || "Usuário Google",
          email: tokenInfo.email || "",
          avatar: tokenInfo.picture || "",
          provider: "google",
        };

        setUser(googleUser);
        setIsAuthenticated(true);
        setAuthError(null);
        localStorage.setItem("user", JSON.stringify(googleUser));
      } catch (error) {
        console.error("Erro ao fazer login com Google:", error);
        setAuthError("Erro ao autenticar com Google. Verifique a configuração do cliente OAuth.");
      }
    },
    onError: () => {
      console.log("Falha no login do Google");
      setAuthError("Falha no login do Google. Tente novamente mais tarde.");
    },
    flow: "implicit",
  });

  const loginGoogle = () => {
    if (!googleConfigured) {
      setAuthError("Google OAuth não está configurado. Use o login de convidado ou email local.");
      return;
    }
    googleLogin();
  };

  const loginGuest = () => {
    const guest = {
      name: "Usuário Convidado",
      email: "convidado@riffly.local",
      avatar: "",
      provider: "local",
    };
    setUser(guest);
    setIsAuthenticated(true);
    setAuthError(null);
    localStorage.setItem("user", JSON.stringify(guest));
  };

  const loginLocal = ({ name, email }) => {
    const localUser = {
      name: name || "Usuário Local",
      email: email || "local@riffly.local",
      avatar: "",
      provider: "local",
    };
    setUser(localUser);
    setIsAuthenticated(true);
    setAuthError(null);
    localStorage.setItem("user", JSON.stringify(localUser));
  };

  const loginFacebook = async () => {
    if (!facebookConfigured) {
      setAuthError("Facebook OAuth não está configurado. Use o login de convidado ou email local.");
      return;
    }

    if (!window.FB) {
      const script = document.createElement("script");
      script.src = `https://connect.facebook.net/pt_BR/sdk.js#xfbml=1&version=v18.0&appId=${facebookAppId}`;
      document.body.appendChild(script);
      script.onload = () => {
        window.FB?.init({ appId: facebookAppId, cookie: true, xfbml: true, version: "v18.0" });
        triggerFacebookLogin();
      };
      return;
    }

    window.FB.init({ appId: facebookAppId, cookie: true, xfbml: true, version: "v18.0" });
    triggerFacebookLogin();
  };

  const triggerFacebookLogin = () => {
    window.FB?.login(
      (response) => {
        if (response.authResponse) {
          window.FB?.api("/me", { fields: "id,name,email,picture" }, (userInfo) => {
            const facebookUser = {
              name: userInfo.name,
              email: userInfo.email || "",
              avatar: userInfo.picture?.data?.url || "",
              provider: "facebook",
            };
            setUser(facebookUser);
            setIsAuthenticated(true);
            setAuthError(null);
            localStorage.setItem("user", JSON.stringify(facebookUser));
          });
        }
      },
      { scope: "public_profile,email" }
    );
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setAuthError(null);
    localStorage.removeItem("user");
  };

  // Check for saved user on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loginGoogle,
        loginFacebook,
        loginGuest,
        loginLocal,
        logout,
        authError,
        googleConfigured,
        facebookConfigured,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }
  return context;
};
