# Estrutura

## Árvore alvo

```text
apps/
  web/
  admin/
  api/

packages/
  ui/
  hooks/
  types/
  utils/

infra/
  docker/
  nginx/

database/

docs/

scripts/
```

## Ganhos

- Projeto mais limpo.
- Build menor quando cada app publica só o que precisa.
- CI/CD fica mais simples de separar por app e por pacote compartilhado.
