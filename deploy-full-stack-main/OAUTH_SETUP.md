# 🔐 Configuração de Autenticação OAuth

## Google OAuth

### Passo 1: Criar Projeto no Google Cloud Console

1. Acesse https://console.cloud.google.com
2. Crie um novo projeto ou selecione um existente
3. Vá para "APIs e Serviços" → "Credenciais"
4. Clique em "Criar Credencial" → "ID do Cliente OAuth"
5. Selecione "Aplicativo da Web"
6. Configure os URIs autorizados:
   - **JavaScript Origins**: `http://localhost:5173`, `http://localhost:3001`
   - **Redirect URIs**: `http://localhost:5173`, `http://localhost:3001/callback`

### Passo 2: Copiar Client ID

1. Copie o **Client ID** gerado
2. Abra o arquivo `.env` na pasta `front-end/`
3. Substitua `YOUR_GOOGLE_CLIENT_ID` pelo Client ID

**Exemplo:**
```env
VITE_GOOGLE_CLIENT_ID=1234567890-abcdefghijklmnop.apps.googleusercontent.com
```

## Facebook OAuth

### Passo 1: Criar App no Facebook Developers

1. Acesse https://developers.facebook.com
2. Clique em "Meus Aplicativos" → "Criar Aplicativo"
3. Escolha "Consumidor" como tipo de app
4. Preencha os dados do aplicativo
5. Na seção "Configurações", vá para "Básico"
6. Copie o **App ID**

### Passo 2: Configurar Facebook Login

1. Adicione o produto "Facebook Login"
2. Vá para "Configurações" do Facebook Login
3. Configure os **URIs de Redirecionamento Válidos**:
   - `http://localhost:5173`
   - `http://localhost:3001`

### Passo 3: Copiar App ID

1. Copie o **App ID**
2. Abra o arquivo `.env` na pasta `front-end/`
3. Substitua `YOUR_FACEBOOK_APP_ID` pelo App ID

**Exemplo:**
```env
VITE_FACEBOOK_APP_ID=1234567890123456
```

## .env no Front-end

Após configurar as credenciais, seu `.env` deve ter:

```env
# Google OAuth Configuration
VITE_GOOGLE_CLIENT_ID=seu_client_id_aqui

# Facebook Configuration
VITE_FACEBOOK_APP_ID=seu_app_id_aqui

# API Backend
VITE_API_URL=http://localhost:3001
```

## ✅ Testando a Autenticação

1. Reinicie o servidor front-end: `npm run dev`
2. Abra `http://localhost:5173/`
3. Clique no ícone de usuário (👤) no Header
4. Clique em "Continuar com Google" ou "Continuar com Facebook"
5. Verifique se o usuário aparece no Header após login

## 🔒 Variáveis de Ambiente para Produção

Para produção no Vercel/GitHub Pages, crie as seguintes variáveis de ambiente:

- `VITE_GOOGLE_CLIENT_ID`: Seu Google Client ID de produção
- `VITE_FACEBOOK_APP_ID`: Seu Facebook App ID de produção
- `VITE_API_URL`: URL do seu backend em produção

## 📝 Notas

- Google OAuth usa fluxo implícito (mais seguro para SPAs)
- Facebook SDK é carregado dinamicamente quando necessário
- Credenciais são armazenadas em `localStorage` com chave `"user"`
- Para logout, o usuário pode clicar no ícone de usuário novamente

## 🆘 Troubleshooting

### "CORS error ao fazer login"
- Verifique se as URLs estão configuradas corretamente no Google Cloud Console / Facebook Developers
- Certifique-se que o backend está rodando em `http://localhost:3001`

### "Cliente ID não encontrado"
- Verifique se o `.env` foi criado corretamente
- Reinicie o servidor front-end após criar/modificar `.env`

### "Facebook SDK não carrega"
- Verifique se o App ID é válido
- Verifique a console do navegador para erros

---

**Última atualização:** 2026-06-30
