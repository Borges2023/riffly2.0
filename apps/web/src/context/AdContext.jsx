import React, { createContext, useContext, useState } from 'react';

const AdContext = createContext();

export const useAds = () => {
  const context = useContext(AdContext);
  if (!context) {
    throw new Error('useAds deve ser usado dentro de AdProvider');
  }
  return context;
};

/**
 * 📢 BANCO DE ANÚNCIOS - SISTEMA ATIVO E FUNCIONAL
 * 
 * ✅ Como funciona:
 * 1. Usuários FREE veem anúncios ao atingir 30% da música
 * 2. Anúncios aparecem novamente ao final de cada faixa
 * 3. Usuários PREMIUM não veem anúncios
 * 4. FREE users têm 3 "skips" gratuitos por sessão
 * 
 * 📊 Métricas rastreadas:
 * - Anúncios visualizados (adsViewed)
 * - Anúncios clicados (adsClicked)
 */
export const ADS_DATABASE = [
  {
    id: 1,
    title: 'Spotify Premium',
    description: 'Ouça música sem anúncios',
    image: 'https://images.unsplash.com/photo-1611339555312-e607c90052d4?w=300&h=200&fit=crop',
    cta: 'Conhecer',
    url: 'https://www.spotify.com',
    duration: 10, // segundos
  },
  {
    id: 2,
    title: 'YouTube Music',
    description: 'Descubra suas músicas favoritas',
    image: 'https://images.unsplash.com/photo-1514617494387-c1c1e9c8e3f5?w=300&h=200&fit=crop',
    cta: 'Explorar',
    url: 'https://music.youtube.com',
    duration: 10,
  },
  {
    id: 3,
    title: 'Apple Music',
    description: 'Acesso a milhões de músicas',
    image: 'https://images.unsplash.com/photo-1559339834-f5e2c8265d61?w=300&h=200&fit=crop',
    cta: 'Testar',
    url: 'https://music.apple.com',
    duration: 10,
  },
  {
    id: 4,
    title: 'Upgrade para Premium',
    description: 'Remova anúncios e desbloqueie recursos',
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=200&fit=crop',
    cta: 'Fazer upgrade',
    url: '#premium',
    duration: 8,
    internal: true, // Anúncio interno (Para página de planos)
  },
];

export const AdProvider = ({ children }) => {
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [showAd, setShowAd] = useState(false); // ✅ CONTROLA EXIBIÇÃO
  const [adsViewed, setAdsViewed] = useState(0); // Contador de visualizações
  const [adsClicked, setAdsClicked] = useState(0); // Contador de cliques

  const getCurrentAd = () => {
    return ADS_DATABASE[currentAdIndex % ADS_DATABASE.length];
  };

  const nextAd = () => {
    setCurrentAdIndex((prev) => prev + 1);
  };

  /**
   * 🎬 Exibe um anúncio aleatório
   * Chamado por PlayerNew.jsx quando:
   * - Música atinge 30% de progresso (usuários FREE)
   * - Música termina (usuários FREE)
   */
  const showRandomAd = () => {
    if (showAd) return; // Evita ativar múltiplos anúncios ao mesmo tempo
    const randomIndex = Math.floor(Math.random() * ADS_DATABASE.length);
    setCurrentAdIndex(randomIndex);
    setShowAd(true); // ✅ ATIVA EXIBIÇÃO DO COMPONENTE AdNotification
  };

  const hideAd = () => {
    setShowAd(false);
    setAdsViewed(adsViewed + 1); // Incrementa métrica
  };

  const clickAd = () => {
    setAdsClicked(adsClicked + 1); // Incrementa métrica
    const ad = getCurrentAd();
    if (!ad.internal) {
      window.open(ad.url, '_blank');
    }
  };

  const value = {
    currentAd: getCurrentAd(),
    showAd,
    setShowAd,
    showRandomAd, // ✅ FUNÇÃO PRINCIPAL PARA ATIVAR ANÚNCIOS
    hideAd,
    nextAd,
    clickAd,
    adsViewed,
    adsClicked,
    ads: ADS_DATABASE,
  };

  return (
    <AdContext.Provider value={value}>
      {children}
    </AdContext.Provider>
  );
};
