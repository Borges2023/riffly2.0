# Guia Rápido de Deployment

## 1️⃣ GitHub
```bash
git init
git add .
git commit -m "Primeira versão"
git remote add origin https://github.com/<user>/riffly-full-stack.git
git push -u origin main
```

## 2️⃣ MongoDB Atlas
- Endereço: https://www.mongodb.com/cloud/atlas
- Cluster: Free Shared
- String: `mongodb+srv://riffly_app:SENHA@...`

## 3️⃣ Upstash Redis
- Endereço: https://console.upstash.com
- String: `redis://default:SENHA@...`

## 4️⃣ Render (Backend)
- Deploy automático de `apps/api`
- URL: `https://riffly-backend.onrender.com`
- Env vars: MONGODB_URI, REDIS_URL, JWT_SECRET, CORS_ORIGIN

## 5️⃣ Vercel (Frontend)
- Deploy automático de `apps/web`
- URL: `https://riffly-frontend.vercel.app`
- Env var: VITE_API_URL=https://riffly-backend.onrender.com/api

## 6️⃣ Cloudflare (DNS - Opcional)
- Para customizar domínio (ex: riffly.com)
- Adicione records CNAME apontando aos serviços

---

**Documentos importantes:**
- `DEPLOYMENT.md` - Guia completo passo a passo
- `CHECKLIST.md` - Checklist rápido de deployment
- `.env.example` - Variáveis de referência
- `render.yaml` - Configuração Render
- `vercel.json` - Configuração Vercel
