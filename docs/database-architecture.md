# Database Architecture

## Objetivo

Organizar o MongoDB para mídia, descoberta, social e operação com:

- índices para leitura rápida
- agregações para dashboards e ranking
- paginação segura
- auditoria de ações
- cache para consultas repetidas

## Coleções

- `users`
- `songs`
- `albums`
- `artists`
- `playlists`
- `history`
- `favorites`
- `followers`
- `comments`
- `advertisements`
- `subscriptions`
- `notifications`
- `reports`
- `sessions`
- `audit_logs`

## Índices sugeridos

- `users`
  - índice único em `email`
  - índice em `plan`
  - índice em `createdAt`
- `songs`
  - índice em `{ artist: 1, name: 1 }`
  - índice em `genre`
  - índice em `createdAt`
  - índice em `premium`
- `albums`
  - índice em `{ artistId: 1, releaseDate: -1 }`
- `artists`
  - índice em `name`
  - índice único em `slug` quando o catálogo estiver normalizado
- `playlists`
  - índice em `{ userId: 1, updatedAt: -1 }`
- `history`
  - índice em `{ userId: 1, playedAt: -1 }`
  - índice em `{ songId: 1, playedAt: -1 }`
- `favorites`
  - índice único em `{ userId: 1, songId: 1 }`
- `followers`
  - índice único em `{ userId: 1, artistId: 1 }`
- `comments`
  - índice em `{ songId: 1, createdAt: -1 }`
- `advertisements`
  - índice em `{ active: 1, slot: 1 }`
- `subscriptions`
  - índice único em `userId`
  - índice em `status`
- `notifications`
  - índice em `{ userId: 1, read: 1, createdAt: -1 }`
- `reports`
  - índice em `{ status: 1, createdAt: -1 }`
- `sessions`
  - índice único em `sessionId`
  - índice em `expiresAt`
- `audit_logs`
  - índice em `{ entity: 1, entityId: 1, createdAt: -1 }`

## Agregações úteis

- top songs por play count
- artistas mais seguidos
- músicas mais favorited
- funil free -> premium
- comentários por faixa
- atividade por período

## Paginação

Usar `limit` + `skip` para telas simples.

Para listas grandes, preferir paginação por cursor:

- `createdAt`
- `_id`

## Cache Redis

Cache para:

- overview da plataforma
- listas de músicas/artistas populares
- permissões e sessão do usuário
- recomendações e rankings

TTL sugerido:

- overview: 30s a 2min
- listas populares: 2 a 10min
- sessão: conforme política de autenticação

## Auditoria

Registrar em `audit_logs`:

- login
- criação/edição/remoção
- promoção de plano
- upload
- follow/unfollow
- ação administrativa

Campos mínimos:

- `entity`
- `entityId`
- `action`
- `actorId`
- `metadata`
- `createdAt`
