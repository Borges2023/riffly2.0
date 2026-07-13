# 🎵 Riffly — Roadmap de Desenvolvimento

## Status Atual
- ✅ Branding e identidade visual atualizada para Riffly
- ✅ Estrutura base mobile-ready com PWA
- ✅ Fallback de dados local (mockData)
- ✅ Contextos para Autenticação, Favoritos/Playlists e Tema
- ✅ Componentes de UI para Login e Tema
- ⏳ Integração de rede (pendente rede)

---

## 1️⃣ Setup Inicial (Quando Tiver Rede)

```bash
cd front-end
npm install
npm run dev
```

---

## 2️⃣ Autenticação (Google & Facebook)

### Passo 1: Instalar dependências
```bash
npm install @react-oauth/google react-facebook-login
```

### Passo 2: Integrar no App.jsx
```jsx
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './context/AuthContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { ThemeProvider } from './context/ThemeContext';

export default function App() {
  return (
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
      <AuthProvider>
        <FavoritesProvider>
          <ThemeProvider>
            {/* resto do app */}
          </ThemeProvider>
        </FavoritesProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}
```

### Passo 3: Configurar credenciais
- Google: https://console.cloud.google.com
- Facebook: https://developers.facebook.com

---

## 3️⃣ Tema Escuro

O componente `ThemeToggle.jsx` já está pronto. Adicione ao `Header.jsx`:

```jsx
import ThemeToggle from './ThemeToggle';

// Dentro do componente Header
<ThemeToggle />
```

CSS para suportar modo claro (adicionar em `index.css`):

```css
[data-theme="light"] {
  --green-50: hsl(141deg 75% 10%);
  --green-1000: hsl(141deg 75% 95%);
  /* ... inverter cores */
}
```

---

## 4️⃣ Favoritos e Playlists

O contexto `FavoritesContext.jsx` já está configurado com localStorage.

### Uso em componentes:
```jsx
import { useFavorites } from '../context/FavoritesContext';

function SongCard({ song }) {
  const { toggleFavorite, isFavorite } = useFavorites();

  return (
    <button onClick={() => toggleFavorite(song)}>
      {isFavorite(song._id) ? '❤️' : '🤍'}
    </button>
  );
}
```

---

## 5️⃣ Player em Segundo Plano (Background)

Com Capacitor, será possível rodas Player em background. Para web PWA, usar Web Audio API:

```jsx
// TODO: Implementar com Service Workers
// Ref: https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API
```

---

## 6️⃣ Android com Capacitor

### Passo 1: Instalar Capacitor (quando tiver rede)
```bash
npm install @capacitor/core @capacitor/cli @capacitor/android
npm install -g @capacitor/cli
```

### Passo 2: Build web
```bash
npm run build
```

### Passo 3: Inicializar Capacitor
```bash
npx cap init riffly com.riffly.app
```

### Passo 4: Adicionar Android
```bash
npx cap add android
npx cap sync
npx cap open android
```

### Passo 5: Configurar no Android Studio
- Abrir projeto em `android/` com Android Studio
- Build e testar em emulador
- Gerar APK/AAB para Play Store

---

## 7️⃣ Publicar na Google Play

### Preparação:
1. Criar conta de desenvolvedor Google Play (US$ 25)
2. Assinar APK/AAB com chave
3. Criar listing completo (screenshots, descrição)
4. Submeter para review

### Comandos:
```bash
# Gerar APK assinado
cd android
./gradlew assembleRelease

# Gerar AAB (recomendado)
./gradlew bundleRelease
```

---

## 8️⃣ Próximas Funcionalidades (Roadmap)

- [ ] Equalizador
- [ ] Download offline
- [ ] Notificações push
- [ ] Pesquisa avançada
- [ ] Álbuns
- [ ] Recomendações baseadas em IA
- [ ] Painel administrativo
- [ ] Upload de músicas
- [ ] Estatísticas
- [ ] Plano Premium

---

## 📋 Checklist para Produção

- [ ] Instalar dependências com `npm install`
- [ ] Compilar com `npm run build`
- [ ] Testar todas as rotas
- [ ] Configurar autenticação (Google/Facebook)
- [ ] Testar PWA em mobile
- [ ] Build com Capacitor
- [ ] Testar em emulador Android
- [ ] Configurar kestore para assinatura
- [ ] Gerar APK/AAB
- [ ] Criar conta Google Play
- [ ] Submeter app para review

---

## 📞 Contato & Suporte

Para problemas com a instalação ou desenvolvimento, verifique:
- Node.js v24.14.1+ instalado
- npm v11.11.0+ instalado
- Conexão de rede ativa
- Android Studio instalado (para mobile)

---

**Última atualização:** 2026-06-30
