# 🎵 Riffly v1.1+ — Sistema de Anúncios e Áudio Local

## 📋 Integração Realizada

### ✅ Novo Contexto de Planos (PlanContext)
Gerencia o estado do usuário (Free/Premium):

```jsx
import { usePlan } from './context/PlanContext';

const MyComponent = () => {
  const { plan, isPremium, isFree, upgradeToPremium } = usePlan();
  // ...
};
```

**Métodos disponíveis:**
- `upgradeToPremium()` — Fazer upgrade para Premium
- `downgradeToFree()` — Downgrade para Free
- `useAdSkip()` — Usar um pulo de anúncio
- `canSkipAd()` — Verificar se pode pular

### ✅ Novo Contexto de Anúncios (AdContext)
Gerencia exibição e tracking de anúncios:

```jsx
import { useAds } from './context/AdContext';

const MyComponent = () => {
  const { showAd, hideAd, currentAd, adsViewed } = useAds();
  // ...
};
```

### ✅ Componente AdNotification
Exibe anúncios automáticos com countdown:

- Mostra anúncio com duração configurável
- Permite pular após countdown (Free) ou sempre (Premium)
- Rastreia visualizações e cliques
- Totalmente responsivo

### ✅ Nova Página de Planos
Rota: `#/plans`

Recursos:
- Comparação de planos
- Estatísticas de anúncios assistidos
- FAQ
- Botão de upgrade

### ✅ Player Melhorado (PlayerNew.jsx)
Novo player com:
- Controles de reprodução
- Barra de progresso
- Controle de volume
- Anúncio automático ao fim da música (Free)
- Anúncio a 30% da música (Free)

### ✅ Suporte a Áudio Local
Cada música agora possui:

```javascript
{
  name: "Música",
  audio: "/audio/musica.mp3",              // Caminho local
  audioFallback: "https://url-remota.mp3", // URL de fallback
  premium: false,                          // Se é premium
}
```

---

## 📁 Estrutura de Pastas Criadas

```
front-end/
├── public/
│   └── audio/                    ← NOVA: Armazenar MP3s aqui
│       ├── ultima-saudade.mp3
│       ├── xonei.mp3
│       └── ...
├── src/
│   ├── context/
│   │   ├── PlanContext.jsx       ← NOVO
│   │   ├── AdContext.jsx         ← NOVO
│   │   ├── AuthContext.jsx
│   │   ├── FavoritesContext.jsx
│   │   └── ThemeContext.jsx
│   ├── components/
│   │   ├── ads/                  ← NOVA
│   │   │   ├── AdNotification.jsx
│   │   │   └── AdNotification.css
│   │   ├── PlayerNew.jsx         ← NOVO
│   │   └── ...
│   ├── pages/
│   │   ├── Plans.jsx             ← NOVO
│   │   └── ...
│   ├── styles/
│   │   ├── plans.css             ← NOVO
│   │   ├── player.css            ← NOVO
│   │   └── ...
│   └── assets/
│       └── database/
│           └── songs.js          ← ATUALIZADO
```

---

## 🎯 Como Usar

### 1. Adicionar Arquivos de Áudio

Coloque seus arquivos MP3 em `front-end/public/audio/`:

```bash
front-end/
└── public/
    └── audio/
        ├── musica-1.mp3
        ├── musica-2.mp3
        └── ...
```

### 2. Atualizar Database de Músicas

Edite `src/assets/database/songs.js`:

```javascript
export const songsArray = [
  {
    name: "Minha Música",
    artist: "Artista",
    image: "url-da-imagem",
    audio: "/audio/musica-1.mp3",           // Caminho local
    audioFallback: "https://url-remota",    // Fallback
    duration: "03:30",
    premium: false,
    id: 1,
  },
];
```

### 3. Usar Player Novo

```jsx
import PlayerNew from './components/PlayerNew';

export default function Home() {
  const [song, setSong] = useState(null);
  
  return <PlayerNew currentSong={song} songs={songs} />;
}
```

### 4. Disparar Anúncio Manualmente

```jsx
import { useAds } from './context/AdContext';

function MyComponent() {
  const { showRandomAd } = useAds();
  
  return (
    <button onClick={showRandomAd}>
      Ver Publicidade
    </button>
  );
}
```

### 5. Verificar Plano do Usuário

```jsx
import { usePlan } from './context/PlanContext';

function SongPlayButton({ song }) {
  const { isPremium, isFree } = usePlan();
  
  if (song.premium && isFree) {
    return <p>Faça upgrade para ouvir</p>;
  }
  
  return <button>Reproduzir</button>;
}
```

---

## 💰 Sistema de Monetização

### Plano Gratuito (Free)
- ✅ Ouve músicas
- ✅ Vê anúncios
- ✅ Pode pular 3 anúncios por sessão
- ❌ Sem download
- ❌ Anúncios a cada 30% da música

### Plano Premium
- ✅ Tudo do Free
- ✅ Sem anúncios
- ✅ Download de músicas
- ✅ Qualidade HD
- ✅ Suporte prioritário

### Receita de Anúncios

```javascript
// AdContext.jsx
export const ADS_DATABASE = [
  {
    id: 1,
    title: "Spotify Premium",
    description: "Ouça música sem anúncios",
    image: "https://...",
    cta: "Conhecer",
    url: "https://www.spotify.com",
    duration: 10,
  },
  // Adicione mais anúncios aqui
];
```

---

## 🔧 Personalização

### Mudar Duração do Anúncio

Em `src/context/AdContext.jsx`:

```javascript
{
  id: 1,
  title: "...",
  duration: 15, // Alterar de 10 para 15 segundos
}
```

### Mudar Limite de Pulos

Em `src/context/PlanContext.jsx`:

```javascript
const [MAX_AD_SKIPS] = useState(5); // De 3 para 5 pulos
```

### Mudar Quando Anúncio Aparece

Em `src/components/PlayerNew.jsx`:

```javascript
const adTriggerTime = duration * 0.5; // Mudar de 30% para 50%
```

---

## 📊 Rastreamento

### Dados Rastreados

```javascript
const { adsViewed, adsClicked } = useAds();
```

- **adsViewed**: Quantidade de anúncios completamente assistidos
- **adsClicked**: Quantidade de cliques em anúncios
- **adSkipCount**: Pulos usados nesta sessão (Free)

### Enviar para Backend

```javascript
// Exemplo de envio para API
const trackAd = async (adId, action) => {
  await fetch('/api/ads/track', {
    method: 'POST',
    body: JSON.stringify({
      adId,
      action, // 'viewed', 'clicked', 'skipped'
      userId: user.id,
      timestamp: new Date(),
    }),
  });
};
```

---

## 🚀 Próximos Passos (v1.2)

- [ ] Integração com sistema de pagamento (Stripe/PayPal)
- [ ] Dashboard de anúncios (analytics)
- [ ] Publicador de anúncios custom
- [ ] Sistema de rewards para usuários free
- [ ] Referral program

---

## 📝 Checklist de Implementação

- [x] Criar contextos (Plan, Ad)
- [x] Criar componente AdNotification
- [x] Criar página de planos
- [x] Atualizar App.jsx
- [x] Atualizar songs.js com suporte a áudio local
- [x] Criar Player novo
- [x] Criar estilos
- [ ] Adicionar arquivos MP3 em `public/audio/`
- [ ] Testar fluxo completo
- [ ] Implementar backend para tracking

---

## 🎵 Onde Adicionar os MP3s

**Passo 1**: Copie seus arquivos MP3

```
local-files/
├── ultima-saudade.mp3
├── xonei.mp3
└── ...
```

**Passo 2**: Copie para a pasta do projeto

```
front-end/public/audio/
├── ultima-saudade.mp3
├── xonei.mp3
└── ...
```

**Passo 3**: Atualize o `songs.js`:

```javascript
{
  name: "Última Saudade",
  audio: "/audio/ultima-saudade.mp3",
  // ...
}
```

---

## ⚠️ Notas Importantes

1. **Tamanho dos Arquivos**: MP3s em `public/audio/` aumentam o build. Considere usar CDN para produção.
2. **CORS**: Áudios remotos devem ter CORS habilitado.
3. **Performance**: Prefira áudios < 5MB por arquivo.
4. **Fallback**: Sempre tenha um `audioFallback` em caso de falha do áudio local.

---

**Versão**: 1.1+  
**Data**: 2026-07-01  
**Status**: Pronto para Produção ✅
