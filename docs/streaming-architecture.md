# Streaming Architecture

## Objetivo

Preparar a plataforma para competir com players comerciais usando:

- HLS
- DASH
- Adaptive Bitrate
- Buffer inteligente
- Pré-carregamento
- Cache

## Estratégia recomendada

- HLS como caminho principal por compatibilidade ampla.
- DASH como alternativa para navegadores e clientes que preferem esse formato.
- Progressive MP3/AAC como fallback final.
- Buffer adaptativo com regras por qualidade da rede.
- Pré-carregamento somente da faixa atual e da próxima.
- Cache em CDN e no navegador para manifests, segmentos e capas.

## Campos sugeridos por faixa

- `streamUrl`
- `audioFallback`
- `hlsManifestUrl`
- `dashManifestUrl`
- `bitrates`
- `duration`
- `cdnPath`
- `mimeType`

## Regras de reprodução

- Se houver HLS e o navegador suportar nativamente, usar HLS.
- Se houver HLS e o navegador não suportar nativamente, usar player compatível como `hls.js`.
- Se houver DASH, usar `dash.js`.
- Se nenhum manifest existir, cair no áudio progressivo.

## Buffer

- Buffer inicial curto para iniciar rápido.
- Buffer médio para evitar travadas.
- Buffer maior apenas em Wi-Fi estável.

## Pré-carregamento

- Pré-carregar a próxima faixa da fila.
- Pré-buscar o manifest atual ao abrir a tela.
- Evitar pré-carregar biblioteca inteira.

## Cache

- Cache de manifests e segmentos via CDN.
- Cache de metadados via Redis.
- Cache de capa e assets estáticos no browser.

## Próximos passos

- integrar `hls.js` e `dash.js` no web app
- gerar manifests durante ingest/transcoding
- expor bitrate/qualidade no banco
- registrar métricas de buffering e rebuffering

