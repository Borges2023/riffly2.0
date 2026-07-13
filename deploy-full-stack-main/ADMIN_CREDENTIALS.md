# 🔐 CREDENCIAIS DO ADMINISTRADOR - RIFFLY v1.1+

## ⚠️ INFORMAÇÃO CRÍTICA

As credenciais abaixo são para **ADMINISTRADOR ÚNICO** do sistema Riffly.

**Mantenha este arquivo seguro! Não compartilhe publicamente em produção.**

---

## 👤 CREDENCIAIS DO ADMIN

```
┌─────────────────────────────────────┐
│  PAINEL DE ADMINISTRAÇÃO            │
├─────────────────────────────────────┤
│ Usuário:  admin_riffly              │
│ Senha:    RifflyAdmin@2024          │
│ URL:      http://localhost:5175/#/admin
└─────────────────────────────────────┘
```

### Copiar e Colar (Fácil)

**Usuário:**
```
admin_riffly
```

**Senha:**
```
RifflyAdmin@2024
```

---

## 🎯 O QUE O ADMIN PODE FAZER

✅ Fazer login no painel administrativo
✅ Ver lista de todos os usuários
✅ Liberar Premium para usuários específicos
✅ Liberar Premium para TODOS os usuários de uma vez
✅ Atualizar plano de cada usuário
✅ Visualizar estatísticas

---

## 🔗 COMO ACESSAR

### Desktop/Web

1. Abra: `http://localhost:5175/#/admin`
2. Digite o usuário: `admin_riffly`
3. Digite a senha: `RifflyAdmin@2024`
4. Clique em "Entrar"

### Celular/Mobile

Mesmo processo, URL responsiva

---

## 🚀 FUNCIONALIDADES DO PAINEL

### 1. Dashboard
- Ver total de usuários
- Ver quantos têm Premium
- Ver quantos estão em Free

### 2. Gerenciar Usuários
- Tabela com lista de usuários
- Email de cada um
- Plano atual
- Data de criação
- Botão para promover individual

### 3. Ações Rápidas
- "Liberar Premium para Todos" (1 clique)
- "Atualizar Lista" para sincronizar

### 4. Informações
- Versão do sistema
- Status de monitoramento
- Recomendações de segurança

---

## 📊 API ADMIN (Backend)

Todos os endpoints requerem: `Authorization: Bearer <PASSWORD>`

### POST /api/admin/login
```json
{
  "username": "admin_riffly",
  "password": "RifflyAdmin@2024"
}
```

**Response:**
```json
{
  "success": true,
  "token": "RifflyAdmin@2024",
  "admin": {
    "username": "admin_riffly",
    "role": "admin"
  }
}
```

### GET /api/admin/users
Retorna lista de todos os usuários

### POST /api/admin/users/promote
```json
{
  "email": "usuario@example.com"
}
```

### POST /api/admin/users/upgrade-all
Libera Premium para TODOS os usuários

---

## 🔒 SEGURANÇA

### Desenvolvimento (Atual)
- Token simples (apenas senha)
- Sem 2FA
- Sem rate limiting
- Sem criptografia

### Produção (v1.2+)
- JWT com expiração
- 2FA/autenticação multi-fator
- Rate limiting
- Hash bcrypt
- HTTPS obrigatório
- IP whitelist
- Log de auditoria

---

## 📝 NOTAS

- As credenciais são **HARDCODED** por enquanto
- Em produção, usar banco de dados com hash
- Mudar a senha antes de fazer deploy público
- Implementar 2FA
- Usar HTTPS

---

## 🆘 RECUPERAÇÃO DE SENHA

**Problema:** Esqueceu a senha?

**Solução (Desenvolvimento):**
1. Abra `back-end/api/routes/admin.js`
2. Procure por `ADMIN_CREDENTIALS`
3. Mude `password` lá
4. Reinicie o servidor

**Solução (Produção):**
- Implementar email de recuperação
- Usar JWT com expiração
- Ter backup admin secundário

---

## 📱 PRÓXIMOS PASSOS

- [ ] Adicionar 2FA
- [ ] Implementar logs de auditoria
- [ ] Dashboard com gráficos
- [ ] Banco de dados de admins
- [ ] Recuperação de senha
- [ ] Rate limiting
- [ ] Backup automático

---

## ✨ EXEMPLO DE USO

```
1. Acesse: http://localhost:5175/#/admin
2. Login:
   - Usuário: admin_riffly
   - Senha: RifflyAdmin@2024
3. Clique em "Liberar Premium para Todos"
4. Confirme a ação
5. Todos os usuários agora têm Premium!
```

---

## ⚡ ATALHO RÁPIDO

**Liberar Premium para o seu usuário (como admin):**

1. Login com admin_riffly / RifflyAdmin@2024
2. Clique em "👑 Liberar Premium para Todos"
3. Pronto! Você e todos têm Premium

**Ou**

1. Vá em Ações Rápidas
2. Digite seu email
3. Clique em "Promover"

---

**Status:** ✅ Ativo
**Versão:** 1.1+
**Data de Criação:** 2026-07-01
**Última Atualização:** 2026-07-01
