import { render, screen } from "@testing-library/react";
import Profile from "../pages/Profile";
import { AuthProvider } from "../context/AuthContext";
import { FavoritesProvider } from "../context/FavoritesContext";

describe("Profile page", () => {
  it("exibe CTA de login quando usuário não está autenticado", () => {
    render(
      <AuthProvider>
        <FavoritesProvider>
          <Profile />
        </FavoritesProvider>
      </AuthProvider>
    );
    expect(screen.getByText(/Faça login para ver seu perfil completo/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Entrar agora/i })).toBeInTheDocument();
  });
});
