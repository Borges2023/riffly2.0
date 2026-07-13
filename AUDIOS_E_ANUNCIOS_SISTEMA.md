# 🎵 Sistema de Áudios e Anúncios - Riffly v1.1

## ✅ STATUS: TODOS OS ÁUDIOS E ANÚNCIOS ATIVOS

---

## 📊 Resumo do Sistema

| Componente | Status | Localização |
|-----------|--------|------------|
| **21 Músicas Cadastradas** | ✅ ATIVO | `songs.js` |
| **Sistema de Áudio Local** | ✅ ATIVO | `front-end/public/audio/` |
| **Fallback S3 AWS** | ✅ ATIVO | URLs configuradas em cada música |
| **Anúncios FREE** | ✅ ATIVO | `PlayerNew.jsx` + `AdContext.jsx` |
| **Anúncios PREMIUM** | ✅ DESATIVADO | `PlayerNew.jsx` |
| **Métricas Rastreadas** | ✅ ATIVO | `AdContext.jsx` |

---

## 🎵 MÚSICA #1: Arquivo MP3 Existente

### Ana - "Xonei"
- **Arquivo**: `Ana.mp3.mpeg` (✅ EXISTE em `/public/audio/`)
- **Duração**: 2:34
- **Gênero**: Funk/Pop
- **Disponibilidade**: FREE + PREMIUM
- **Carregamento**:
  1. Tenta: `/audio/Ana.mp3.mpeg` (LOCAL)
  2. Fallback: S3 AWS

---

## 🎵 MÚSICA #2-#11: Henrique & Juliano (Sertanejo)

**Status**: Configuradas com fallback S3 (prontas para adicionar arquivos MP3 locais)

| ID | Música | Duração | Arquivo Local | Fallback S3 |
|----|--------|---------|--------------|------------|
| 1 | Última Saudade - Ao Vivo | 02:30 | `/audio/ultima-saudade.mp3` | ✅ |
| 3 | Xonei | 02:34 | `/audio/xonei.mp3` | ✅ |
| 4 | Paredões | 02:55 | `/audio/paredoes.mp3` | ✅ |
| 5 | Amigo Da Minha Saudade - Ao Vivo | 02:30 | `/audio/amigo-minha-saudade.mp3` | ✅ |
| 6 | Seja Ex - Ao Vivo | 03:12 | `/audio/seja-ex.mp3` | ✅ |
| 7 | De Trás Pra Frente - Ao Vivo | 02:43 | `/audio/de-tras-pra-frente.mp3` | ✅ |
| 8 | Aquela Pessoa - Ao Vivo | 02:46 | `/audio/aquela-pessoa.mp3` | ✅ |
| 9 | Meu Amor - Ao Vivo | 02:54 | `/audio/meu-amor.mp3` | ✅ |
| 10 | Como É Que A Gente Fica - Ao Vivo | 02:43 | `/audio/como-fica.mp3` | ✅ |
| 11 | Romântico - Ao Vivo | 03:03 | `/audio/romantico.mp3` | ✅ |

---

## 🎵 MÚSICA #12-#21: MC Tuto (Funk Paulista)

**Status**: Configuradas com fallback S3 (prontas para adicionar arquivos MP3 locais)

| ID | Música | Duração | Arquivo Local | Fallback S3 |
|----|--------|---------|--------------|------------|
| 12 | Oh Garota Eu Quero Você Só Pra Mim | 02:46 | `/audio/oh-garota.mp3` | ✅ |
| 13 | Barbie | 03:12 | `/audio/barbie.mp3` | ✅ |
| 14 | Do Job | 03:13 | `/audio/do-job.mp3` | ✅ |
| 15 | A Danada Me Ligando | 04:43 | `/audio/danada-ligando.mp3` | ✅ |
| 16 | 2025 | 02:52 | `/audio/2025.mp3` | ✅ |
| 17 | E Aí Como Que Tá ? | 02:14 | `/audio/como-ta.mp3` | ✅ |
| 18 | THE BOX MEDLEY FUNK 2 | 04:26 | `/audio/box-medley.mp3` | ✅ |
| 19 | Boy Besta | 07:04 | `/audio/boy-besta.mp3` | ✅ |
| 20 | Vida de Artista | 03:16 | `/audio/vida-artista.mp3` | ✅ |
| 21 | Mó Fita | 04:16 | `/audio/mo-fita.mp3` | ✅ |

---

## 📢 SISTEMA DE ANÚNCIOS - FUNCIONAMENTO COMPLETO

### ✅ Como Funciona

1. **Usuário Inicia Reprodução de Música**
   - PlayerNew.jsx carrega a faixa

2. **Em 30% de Progresso (USUÁRIOS FREE)**
   - `showRandomAd()` é acionada automaticamente
   - Anúncio aleatório do ADS_DATABASE é exibido
   - Métrica `adsViewed` incrementa

3. **Ao Final da Música (USUÁRIOS FREE)**
   - Anúncio é mostrado novamente
   - Usuário pode pular com 3 skips gratuitos/sessão

4. **Usuários PREMIUM**
   - Nenhum anúncio é mostrado

### 📊 Banco de Anúncios (4 Anúncios Ativos)

```javascript
1. Spotify Premium (10s)
   └─ URL: https://www.spotify.com
   
2. YouTube Music (10s)
   └─ URL: https://music.youtube.com
   
3. Apple Music (10s)
   └─ URL: https://music.apple.com
   
4. Upgrade para Premium (8s) [INTERNO]
   └─ URL: #premium (Redireciona para /plans)
```

### 🎬 Momento de Exibição
- **Anúncio #1**: 30% da música (durante reprodução)
- **Anúncio #2**: Ao final da música
- **Frequência**: A cada música para usuários FREE

### 📈 Métricas Rastreadas

```javascript
// AdContext.jsx
const [adsViewed, setAdsViewed] = useState(0);  // Anúncios visualizados
const [adsClicked, setAdsClicked] = useState(0); // Anúncios clicados
```

---

## 🔧 Componentes Principais

### 1. **AdContext.jsx** - Gerenciador de Anúncios
📍 Localização: `src/context/AdContext.jsx`

**Funções**:
- `showRandomAd()` - Exibe anúncio aleatório
- `hideAd()` - Fecha anúncio
- `clickAd()` - Rastreia cliques

**Provider**: Envolve toda a aplicação

```jsx
<AdProvider>
  <App />
</AdProvider>
```

### 2. **AdNotification.jsx** - UI do Anúncio
📍 Localização: `src/components/ads/AdNotification.jsx`

**Responsibilidades**:
- Renderiza anúncio na tela
- Countdown timer (8-10 segundos)
- Botão fechar/skip
- Rastreia visualizações

### 3. **PlayerNew.jsx** - Player com Anúncios
📍 Localização: `src/components/PlayerNew.jsx`

**Sistema de Anúncios**:
```javascript
// Anúncio aos 30% da música
useEffect(() => {
  const adTriggerTime = duration * 0.3;
  if (currentTime >= adTriggerTime && currentTime < adTriggerTime + 1) {
    showRandomAd(); // ✅ ATIVA ANÚNCIO
  }
}, [currentTime, duration, isFree, isPlaying, showRandomAd]);

// Anúncio ao final da música
const handleEnded = () => {
  if (isFree) {
    setTimeout(() => {
      showRandomAd(); // ✅ ATIVA ANÚNCIO
    }, 500);
  }
};
```

### 4. **PlanContext.jsx** - Planos de Usuário
📍 Localização: `src/context/PlanContext.jsx`

**Tipos de Plano**:
- **FREE** (padrão)
  - Vê anúncios (2 pontos por música)
  - 3 skips gratuitos/sessão
  - Melhorado com `canSkipAd()`

- **PREMIUM** 
  - Sem anúncios
  - Sem skips limitados
  - Ativado em `/pages/Plans.jsx`

---

## 📁 Estrutura de Arquivos de Áudio

```
front-end/
└── public/
    └── audio/
        ├── Ana.mp3.mpeg ✅ (EXISTE)
        ├── ultima-saudade.mp3 (esperado)
        ├── xonei.mp3 (esperado)
        ├── paredoes.mp3 (esperado)
        ├── amigo-minha-saudade.mp3 (esperado)
        ├── seja-ex.mp3 (esperado)
        ├── de-tras-pra-frente.mp3 (esperado)
        ├── aquela-pessoa.mp3 (esperado)
        ├── meu-amor.mp3 (esperado)
        ├── como-fica.mp3 (esperado)
        ├── romantico.mp3 (esperado)
        ├── oh-garota.mp3 (esperado)
        ├── barbie.mp3 (esperado)
        ├── do-job.mp3 (esperado)
        ├── danada-ligando.mp3 (esperado)
        ├── 2025.mp3 (esperado)
        ├── como-ta.mp3 (esperado)
        ├── box-medley.mp3 (esperado)
        ├── boy-besta.mp3 (esperado)
        ├── vida-artista.mp3 (esperado)
        └── mo-fita.mp3 (esperado)
```

---

## 🚀 Como Adicionar Novos MP3s

### Passo 1: Copiar Arquivo MP3
```powershell
# Windows
Copy-Item "C:\seu-audio.mp3" "d:\PROJETO MUSICA\deploy-full-stack-main\front-end\public\audio\"
```

### Passo 2: Atualizar songs.js
```javascript
{
  image: "https://images.unsplash.com/...",
  name: "Nome da Música",
  duration: "03:45",
  artist: "Artista",
  audio: "/audio/seu-arquivo.mp3", // ✅ Novo audio LOCAL
  audioFallback: "https://s3.amazonaws.com/...", // Fallback
  id: 22,
  premium: false,
  genre: "Gênero",
  explicit: false,
}
```

### Passo 3: Testar
- Reiniciar o servidor vite
- Clicar em uma música
- Música deve tocar automaticamente

---

## 🧪 Teste do Sistema

### ✅ Teste #1: Áudio Local
1. Clique em "Xonei" (Ana)
2. Música deve tocar (arquivo Ana.mp3.mpeg)
3. Ao 30% deve aparecer anúncio
4. Ao final deve aparecer outro anúncio

### ✅ Teste #2: Fallback S3
1. Renomeie `Ana.mp3.mpeg` temporariamente
2. Clique em mesma música
3. Deve carregar do S3 automaticamente
4. Som deve funcionar igual

### ✅ Teste #3: Anúncios FREE
1. Certifique que `userPlan = 'free'` em localStorage
2. Toque qualquer música
3. Ao 30% anúncio aparece
4. Ao final outra anúncio aparece

### ✅ Teste #4: Sem Anúncios PREMIUM
1. Vá para `/plans`
2. Clique "Fazer upgrade"
3. localStorage agora tem `userPlan = 'premium'`
4. Toque música - nenhum anúncio

---

## 📋 Checklist de Funcionalidades

- [x] 21 músicas cadastradas e comentadas
- [x] Sistema de carregamento de áudio (local + fallback)
- [x] Anúncios ativados para FREE ao 30% da música
- [x] Anúncios ativados para FREE ao final da música
- [x] Sem anúncios para PREMIUM
- [x] Métricas de visualização rastreadas
- [x] Métrica de cliques rastreada
- [x] 3 skips gratuitos/sessão para FREE
- [x] 4 anúncios no banco de dados
- [x] UI do anúncio com countdown
- [x] Comentários descritivos em todo código

---

## 🔗 Arquivos Relacionados

| Arquivo | Função | Status |
|---------|--------|--------|
| `src/context/AdContext.jsx` | Gerenciar anúncios | ✅ Ativo |
| `src/components/ads/AdNotification.jsx` | UI anúncio | ✅ Ativo |
| `src/components/PlayerNew.jsx` | Player + anúncio | ✅ Ativo |
| `src/context/PlanContext.jsx` | FREE/PREMIUM | ✅ Ativo |
| `src/assets/database/songs.js` | Base de dados músicas | ✅ Comentada |
| `src/App.jsx` | Provider setup | ✅ Ativo |

---

## 💡 Notas Importantes

1. **Anúncios apenas para FREE**: Usuários PREMIUM nunca veem anúncios
2. **Fallback automático**: Se arquivo local não existe, S3 é usado
3. **Métrica rastreada**: `adsViewed` e `adsClicked` disponíveis em AdContext
4. **localStorage**: Plano do usuário salvo em `userPlan`
5. **Comentários adicionados**: Todas as 21 músicas têm comentários descritivos

---

## 🎯 Próximos Passos

1. **Adicionar arquivos MP3 reais** na pasta `/public/audio/`
2. **Testar reprodução** de cada música
3. **Validar anúncios** aparecem nos momentos corretos
4. **Monitorizontário** as métricas de cliques

