# 🚀 CHECKLIST QUICK START - Deployment Gratuito

## ✅ Fase 1: Git & GitHub (5 minutos)

- [ ] Copie e execute no terminal (na raiz do projeto):
```bash
git init
git add .
git commit -m "Primeira versão - Riffly v1.1"
```

- [ ] Crie repositório em https://github.com/new
  - Nome: `riffly-full-stack`
  - Visibility: **Public**

- [ ] Execute no terminal:
```bash
git remote add origin https://github.com/<seu-usuario>/riffly-full-stack.git
git branch -M main
git push -u origin main
```

---

## ✅ Fase 2: Bancos de Dados (15 minutos)

### MongoDB Atlas
- [ ] Acesse https://www.mongodb.com/cloud/atlas/register
- [ ] Crie cluster **Free Shared**
- [ ] Crie usuário: `riffly_app` com senha forte
- [ ] Network Access: Permita `0.0.0.0/0`
- [ ] Copie string de conexão (Connection String)
- [ ] Salve em anotações: `mongodb+srv://riffly_app:SENHA@cluster...`

### Upstash Redis
- [ ] Acesse https://console.upstash.com
- [ ] Crie database Redis
- [ ] Copie URL: `redis://default:SENHA@...`
- [ ] Salve em anotações

---

## ✅ Fase 3: Backend - Render (20 minutos)

- [ ] Atualize arquivo `render.yaml`:
  - Mude `YOUR_GITHUB_USERNAME` para seu usuário

- [ ] Commit:
```bash
git add render.yaml
git commit -m "Update render config"
git push
```

- [ ] Acesse https://dashboard.render.com
- [ ] Clique **New +** → **Web Service**
- [ ] Conecte GitHub e selecione `riffly-full-stack`
- [ ] Preencha:
  - **Name**: `riffly-backend`
  - **Plan**: Free
  - **Environment**: Node

- [ ] Clique **Create Web Service** e aguarde deploy (3-5 min)

- [ ] Após deploy, vá em **Environment** e adicione:
```
MONGODB_URI = mongodb+srv://riffly_app:SENHA@cluster...
REDIS_URL = redis://default:SENHA@...
JWT_SECRET = gere_uma_senha_forte_aqui_com_32_chars_aleatorias
CORS_ORIGIN = https://riffly-frontend.vercel.app (depois)
NODE_ENV = production
```

- [ ] Copie URL do verificador (ex: `https://riffly-backend.onrender.com`)

---

## ✅ Fase 4: Frontend - Vercel (15 minutos)

- [ ] Acesse https://vercel.com/new
- [ ] Conecte GitHub
- [ ] Selecione `riffly-full-stack`
- [ ] Preencha:
  - **Framework**: Vite
  - **Root Directory**: `apps/web`
- [ ] Clique **Deploy** e aguarde

- [ ] Após deploy, vá em **Settings** → **Environment Variables**
- [ ] Adicione:
```
VITE_API_URL = https://riffly-backend.onrender.com/api
```

- [ ] Clique **Save and redeploy**
- [ ] Copie URL (ex: `https://riffly-frontend.vercel.app`)

---

## ✅ Fase 5: Atualizar CORS (5 minutos)

De volta ao **Render**:

- [ ] Painel → **Environment Variables**
- [ ] Edite `CORS_ORIGIN`:
  ```
  CORS_ORIGIN = https://riffly-frontend.vercel.app
  ```
- [ ] Clique **Save and Deploy**

---

## ✅ Fase 6: Teste Final (5 minutos)

- [ ] Abra seu navegador:
  - Frontend: https://riffly-frontend.vercel.app
  - Backend: https://riffly-backend.onrender.com/api/

- [ ] Teste se está funcionando:
  - Página carrega?
  - API retorna JSON?

---

## 📊 URLs Importantes

- **Frontend**: https://riffly-frontend.vercel.app
- **Backend**: https://riffly-backend.onrender.com
- **GitHub**: https://github.com/<seu-usuario>/riffly-full-stack
- **Render Dashboard**: https://dashboard.render.com
- **Vercel Dashboard**: https://vercel.com/dashboard
- **MongoDB Atlas**: https://cloud.mongodb.com
- **Upstash Dashboard**: https://console.upstash.com

---

## ⚠️ Limites Gratuitos (Importante!)

| Serviço | Limite | Nota |
|---------|--------|------|
| Render | 750h/mês | App dorme em inatividade |
| Vercel | 100GB/mês | Suficiente para app média |
| MongoDB | 512MB | Para desenvolvimento |
| Upstash | 10.000 cmds/dia | Limite diário |

**Para sair dos limites**: Atualize para planos pagos quando crescer.

---

## 🔄 CI/CD Automático

Toda vez que você faz:
```bash
git push
```

Os deploys acontecem automaticamente:
1. GitHub armazena o código
2. Render detecta mudança → rebuilda e deploya backend
3. Vercel detecta mudança → rebuilda e deploya frontend

---

Dúvidas? Veja `DEPLOYMENT.md` para guia completo!
