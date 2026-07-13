# 🚀 Guia de Deployment Gratuito - Riffly

Este guia cobre o deployment completo em serviços gratuitos: GitHub + Vercel + Render + MongoDB Atlas + Upstash + Cloudflare.

---

## **1️⃣ INICIALIZAR GIT LOCALMENTE**

No terminal da raiz do projeto (`f:\MUSICA\deploy-full-stack-main`):

```bash
git init
git add .
git commit -m "Primeira versão - Riffly v1.1"
```

---

## **2️⃣ CRIAR REPOSITÓRIO NO GITHUB**

1. Acesse https://github.com/new
2. Preencha:
   - **Repository name**: `riffly-full-stack`
   - **Description**: "Plataforma de streaming de música com React, Node.js e MongoDB"
   - **Visibility**: Public (para usar grátis)
   - **Add .gitignore**: Já temos, não marque
3. Clique **Create repository**

4. No terminal, adicione o remote:

```bash
git remote add origin https://github.com/<seu-usuario>/riffly-full-stack.git
git branch -M main
git push -u origin main
```

---

## **3️⃣ MONGODB ATLAS (Banco de Dados)**

### Cadastro
1. Acesse https://www.mongodb.com/cloud/atlas/register
2. Preencha com email e senha
3. Selecione **MongoDB Community** (gratuito)

### Criar Cluster
1. Na dashboard, clique **+ Create**
2. Selecione **Shared Clusters** (Free tier)
3. Escolha cloud provider: **AWS**
4. Região: **(closest to you)**
5. Clique **Create Cluster** (leva ~5 minutos)

### Configurar Acesso
1. Na aba **Database Access**, clique **+ Add New Database User**
   - Username: `riffly_app`
   - Password: Gere uma senha forte
   - **Salve essa senha**

2. Na aba **Network Access**, clique **+ Add IP Address**
   - Selecione **Allow access from anywhere** (0.0.0.0/0)
   - Confirme

### Obter Connection String
1. Clique **Connect** no cluster
2. Selecione **Connect your application**
3. Driver: **Node.js**, Version: **latest**
4. Copie a string (parecida com `mongodb+srv://riffly_app:PASSWORD@cluster.mongodb.net/`)
5. Coloque isso em variável de ambiente:

```
MONGODB_URI=mongodb+srv://riffly_app:<PASSWORD>@cluster-xxxxx.mongodb.net/riffly?retryWrites=true&w=majority
```

---

## **4️⃣ UPSTASH (Redis)**

### Cadastro
1. Acesse https://console.upstash.com
2. Autentique com GitHub (mais fácil)

### Criar Database Redis
1. Clique **Create Database**
2. Preencha:
   - **Name**: `riffly-redis`
   - **Region**: (choose closest)
   - **Type**: Redis
3. Clique **Create**

### Obter Credentials
1. Na dashboard do banco, copie:
   - **UPSTASH_REDIS_URL** (Connection string)
   - Salve como variável de ambiente

```
REDIS_URL=redis://default:XXXXXXXXX@xxxxx.upstash.io:XXXXX
```

---

## **5️⃣ RENDER (Backend Node.js)**

### Preparar Projeto
1. Crie arquivo `render.yaml` na raiz:

```yaml
services:
  - type: web
    name: riffly-backend
    env: node
    repo: https://github.com/<seu-usuario>/riffly-full-stack
    plan: free
    buildCommand: npm install
    startCommand: npm --prefix apps/api start
    healthCheckPath: /api/
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 3001
      - key: MONGODB_URI
        sync: false
      - key: REDIS_URL
        sync: false
      - key: JWT_SECRET
        sync: false
      - key: CORS_ORIGIN
        value: https://<seu-vercel-domain>.vercel.app
```

2. Commit no Git:
```bash
git add render.yaml
git commit -m "Add Render deployment config"
git push
```

### Deploy no Render
1. Acesse https://dashboard.render.com
2. Clique **New +** → **Web Service**
3. Conecte GitHub (autorize a aplicação)
4. Selecione `riffly-full-stack`
5. Preencha:
   - **Name**: `riffly-backend`
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm --prefix apps/api start`
   - **Plan**: Free
6. Clique **Create Web Service**

### Configurar Variáveis de Ambiente
1. No painel do serviço, vá em **Environment**
2. Adicione:
   - `MONGODB_URI`: (de MongoDB Atlas)
   - `REDIS_URL`: (de Upstash)
   - `JWT_SECRET`: Gere uma string aleatória forte
   - `NODE_ENV`: `production`
   - `CORS_ORIGIN`: `https://<seu-vercel-domain>.vercel.app` (depois você atualiza)

3. O Render rebuilda automaticamente

### Obter URL do Backend
- Depois que o deploy terminar, você terá uma URL como: `https://riffly-backend.onrender.com`
-Salve esta URL para usar na Vercel

---

## **6️⃣ VERCEL (Frontend React)**

### Preparar Projeto
1. Crie `apps/web/.env.production`:

```env
VITE_API_URL=https://riffly-backend.onrender.com/api
```

2. No `apps/web/vite.config.js`, garanta:

```javascript
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
})
```

3. No `apps/web/package.json`, added script se não existir:

```json
"scripts": {
  "build": "vite build",
  "preview": "vite preview"
}
```

4. Commit:
```bash
git add .
git commit -m "Add Vercel production config"
git push
```

### Deploy na Vercel
1. Acesse https://vercel.com/new
2. Conecte GitHub (autorize)
3. Selecione `riffly-full-stack`
4. Preencha:
   - **Project Name**: `riffly-frontend`
   - **Framework Preset**: Vite
   - **Root Directory**: `apps/web/`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Clique **Deploy**

### Configurar Variáveis na Vercel
1. Após o deploy, acesse **Settings** → **Environment Variables**
2. Adicione:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://riffly-backend.onrender.com/api`
3. Clique **Save** e redeploy (manualmente ou automático)

### Obter URL do Frontend
- Algo como: `https://riffly-frontend.vercel.app`

---

## **7️⃣ ATUALIZAR CORS NO RENDER**

Agora que você tem a URL do Vercel:

1. Volte ao painel do Render
2. **Settings** → **Environment Variables**
3. Edite `CORS_ORIGIN`:
   - Novo valor: `https://riffly-frontend.vercel.app`
4. Clique **Save and Deploy**

---

## **8️⃣ CLOUDFLARE (DNS Customizado e HTTPS)**

Se quiser um domínio customizado (ex: `riffly.com`):

### Comprar Domínio (opcional)
- Use Namecheap, GoDaddy, ou outro registrador

### Configurar em Cloudflare
1. Acesse https://dash.cloudflare.com
2. Clique **+ Add a Domain**
3. Preencha seu domínio
4. Selecione **Free Plan**
5. Cloudflare vai exibir nameservers para copiar no seu registrador

### Apontar Subdomínios
No Cloudflare **DNS**, crie:

```
frontend   CNAME   riffly-frontend.vercel.app
backend    CNAME   riffly-backend.onrender.com
```

Isso dará acesso em:
- `https://frontend.seu-dominio.com`
- `https://backend.seu-dominio.com`

(Cloudflare já fornece HTTPS grátis)

---

## **9️⃣ TESTE FINAL**

### Verificar URLs

```bash
# Frontend
https://riffly-frontend.vercel.app

# Backend
https://riffly-backend.onrender.com/api/

# Métricas Prometheus (não vai estar no Render free, mas no local está em porta 9090)
```

### Testar Conectividade

```bash
curl https://riffly-backend.onrender.com/api/
# Deve retornar JSON com mensagem de boas-vindas
```

---

## **📊 Limites Gratuitos (Importante)**

| Serviço | Limite |
|---------|--------|
| **Vercel** | 100 GB/mês transferência |
| **Render** | 750 horas/mês; app dorme em inatividade |
| **MongoDB Atlas** | 512 MB storage; 100 conexões simultâneas |
| **Upstash** | 10 comandos/dia; 1 GB storage |
| **Cloudflare** | Ilimitado em plano Free |

**Nota**: Render coloca a app em sleep depois de 15 min sem requests. Primeiro acesso após sleep pode ser lento (cold start).

---

## **🔄 CI/CD Automático**

Toda vez que você faz `git push`, os deploys automáticos:
1. **GitHub** armazena o código
2. **Render** detecta mudanças, rebuilda e redeploya
3. **Vercel** detecta mudanças, rebuilda e redeploya

---

## **📝 Próximas Steps**

1. Monitor**ar logs**:
   - Render: Dashboard → Logs
   - Vercel: Settings → Function Logs

2. **Adicionar CI/CD com GitHub Actions** (opcional)

3. **Upgrade** quando a app crescer
