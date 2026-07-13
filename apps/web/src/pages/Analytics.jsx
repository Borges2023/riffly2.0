import { useEffect, useMemo, useState } from "react";
import { Card, Badge } from "../design-system/index.js";

const sampleTrends = [
  { label: "Seg", value: 18 },
  { label: "Ter", value: 22 },
  { label: "Qua", value: 28 },
  { label: "Qui", value: 32 },
  { label: "Sex", value: 36 },
  { label: "Sáb", value: 41 },
  { label: "Dom", value: 47 },
];

const Analytics = () => {
  const [overview, setOverview] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3001/api/platform/overview")
      .then((res) => res.json())
      .then((data) => setOverview(data))
      .catch(() => setError("Não foi possível carregar analytics, exibindo dados de demo."));
  }, []);

  const popularArtists = useMemo(() => {
    if (!overview?.playlists) return ["Liniker", "Luísa", "Anitta", "Djonga"];
    return overview.playlists.slice(0, 4).map((item) => item.name);
  }, [overview]);

  const playedSongs = useMemo(() => {
    return overview?.stats?.plays ? [
      { name: "Vira-Lata", plays: 420 },
      { name: "Pra Nunca Mais", plays: 348 },
      { name: "Beleza", plays: 291 },
      { name: "Saudade", plays: 244 },
    ] : [];
  }, [overview]);

  return (
    <div className="main analytics-page">
      <section className="page-header">
        <div>
          <h1>Analytics</h1>
          <p>Visualize reproduções, engajamento, retenção e tendências de crescimento diário.</p>
        </div>
        <Badge tone="neutral">Painel de inteligência</Badge>
      </section>

      {error ? (
        <Card className="analytics-alert">{error}</Card>
      ) : null}

      <section className="analytics-grid">
        <Card>
          <h2>Reproduções totais</h2>
          <strong>{overview?.stats?.plays ? overview.stats.plays : "12.432"}</strong>
          <p>Visualização de reproduções mensais e retenção de usuários.</p>
        </Card>
        <Card>
          <h2>Usuários ativos</h2>
          <strong>{overview?.stats?.activeListeners || 5600}</strong>
          <p>Ouvintes únicos com sessão ativa nos últimos 7 dias.</p>
        </Card>
        <Card>
          <h2>Retenção média</h2>
          <strong>{overview ? "78%" : "74%"}</strong>
          <p>Usuários que retornaram para ouvir novamente.</p>
        </Card>
        <Card>
          <h2>Espaço em disco</h2>
          <strong>82%</strong>
          <p>Uso estimado em armazenamento de mídia e uploads.</p>
        </Card>
      </section>

      <section className="analytics-charts">
        <Card>
          <h2>Crescimento diário</h2>
          <div className="chart-bars">
            {sampleTrends.map((point) => (
              <div key={point.label} className="chart-bar-item">
                <span className="chart-bar-value">{point.value}</span>
                <div className="chart-bar" style={{ height: `${point.value * 1.4}px` }} />
                <small>{point.label}</small>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2>Músicas mais tocadas</h2>
          <div className="analytics-list">
            {playedSongs.length ? playedSongs.map((song) => (
              <article key={song.name} className="analytics-item">
                <strong>{song.name}</strong>
                <span>{song.plays} toques</span>
              </article>
            )) : (
              <p>Sem dados reais disponíveis.</p>
            )}
          </div>
        </Card>
      </section>

      <section className="analytics-popular">
        <Card className="analytics-popular__card">
          <h2>Artistas populares</h2>
          <div className="analytics-badges">
            {popularArtists.map((artist) => (
              <Badge key={artist} tone="success">{artist}</Badge>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
};

export default Analytics;
