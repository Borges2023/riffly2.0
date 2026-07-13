# 🎵 Riffly — v1.1

> Uma plataforma moderna de streaming de música, pronta para produção. Aplicativo mobile-first com PWA, preparado para Google Play e App Store.

## 📋 Sobre esta versão

**Versão 1.1** — Infraestrutura Profissional

- ✅ Projeto limpo e organizado
- ✅ Backend com segurança aprimorada (CORS, headers, validação)
- ✅ Variáveis de ambiente (.env)
- ✅ Rotas modulares e bem organizadas
- ✅ Middlewares de erro e logging
- ✅ Código pronto para produção
- ✅ Capacitor configurado para Android/iOS

**Próximas versões:**
- v1.2: Autenticação JWT, Login, Cadastro
- v1.3: Favoritos e Playlists
- v1.4: Upload de música
- v2.0: Publicação em produção

---

## 🚀 Quick Start

### Pré-requisitos
- Node.js 18+
- npm ou yarn
- MongoDB Atlas (ou local)

### Instalação

#### 1. Backend
```bash
cd back-end
npm install
cp .env.example .env
# Editar .env com suas credenciais MongoDB
npm start
```

#### 2. Frontend
```bash
cd front-end
npm install
npm run dev
```

### Acessar
- **App**: http://localhost:5173
- **API**: http://localhost:3001/api

---

## 📁 Estrutura do Projeto

```
deploy-full-stack/
├── back-end/
│   ├── api/
│   │   ├── routes/          # Rotas modulares
│   │   │   ├── artists.js
│   │   │   └── songs.js
│   │   ├── middlewares/     # Middlewares customizados
│   │   │   └── errorHandler.js
│   │   ├── connect.js       # Conexão MongoDB
│   │   └── server.js        # Servidor principal
│   ├── .env                 # Variáveis de ambiente (não commitar)
│   ├── .env.example         # Template de .env
│   ├── .gitignore
│   └── package.json
├── front-end/
│   ├── src/
│   │   ├── components/      # Componentes React
│   │   ├── pages/           # Páginas
│   │   ├── context/         # Contextos de estado
│   │   ├── assets/          # Imagens, dados, etc
│   │   ├── styles/          # CSS
│   │   └── App.jsx
│   ├── public/
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── README.md
```

---

## 🔐 Segurança (v1.1)

### ✅ Implementado
- CORS configurável via .env
- Headers de segurança (X-Frame-Options, X-XSS-Protection, etc)
- Validação de IDs MongoDB
- Variáveis de ambiente sensíveis protegidas
- Tratamento de erros global

### 🔜 Próximas (v1.2+)
- [ ] Helmet.js
- [ ] Rate Limiting
- [ ] Compression
- [ ] JWT Authentication
- [ ] HTTPS em produção
- [ ] Criptografia de senhas

---

## 📱 Capacitor (Android/iOS)

### Preparar para Android

```bash
cd front-end
npm run build
npm install @capacitor/core @capacitor/cli
npx cap init
npx cap add android
npx cap sync
```

### Compilar APK
```bash
npx cap open android
# Abrir Android Studio e compilar
```

---

## 🛠️ Desenvolvimento

### Scripts disponíveis

**Backend**
```bash
npm start          # Inicia servidor (porta 3001)
npm run dev        # Com nodemon (quando instalado)
```

**Frontend**
```bash
npm run dev        # Vite dev server (porta 5173)
npm run build      # Build para produção
npm run preview    # Preview do build
npm run lint       # ESLint
```

---

## 🌍 Variáveis de Ambiente

### Back-end (.env)

```env
# MongoDB
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/...
DB_NAME=spotifyAula

# Server
PORT=3001
NODE_ENV=development

# CORS
CORS_ORIGIN=http://localhost:5173

# Rate Limiting (futuro)
RATE_LIMIT_WINDOW_MS=15000
RATE_LIMIT_MAX_REQUESTS=100
```

---

## 📊 Endpoints da API

### Artists
- `GET /api/artists` — Lista todos os artistas
- `GET /api/artists/:id` — Detalhes de um artista

### Songs
- `GET /api/songs` — Lista todas as músicas
- `GET /api/songs/:id` — Detalhes de uma música

---

## 🎨 Stack Técnico

### Frontend
- **React 19** — UI Components
- **Vite** — Build tool
- **React Router** — Navegação
- **FontAwesome** — Ícones
- **Axios** — HTTP client
- **Capacitor** — Mobile

### Backend
- **Node.js + Express** — API REST
- **MongoDB** — Database
- **CORS** — Cross-origin requests
- **Dotenv** — Variáveis de ambiente

---

## 📝 Próximos Passos (v1.2)

- [ ] Implementar JWT Authentication
- [ ] Criar endpoints de autenticação (login/cadastro)
- [ ] Adicionar modelo de usuário
- [ ] Implementar contexto de autenticação
- [ ] Adicionar login modal funcional
- [ ] Sistema de favoritos e playlists

---

## 🐛 Troubleshooting

### Erro: "ENOTFOUND registry.npmjs.org"
```
npm install --registry https://registry.npmmirror.com
```

### MongoDB não conecta
- Verificar string de conexão em `.env`
- Confirmar IP whitelisted em MongoDB Atlas
- Validar credenciais

### Porta 3001 já em uso
```bash
netstat -ano | findstr :3001    # Windows
kill -9 $(lsof -t -i:3001)      # Mac/Linux
```

---

## 📞 Suporte

Para dúvidas ou issues, abra uma issue no GitHub.

---

## 📄 Licença

MIT © 2025 Riffly Project

---

**Made with ❤️ for music lovers**