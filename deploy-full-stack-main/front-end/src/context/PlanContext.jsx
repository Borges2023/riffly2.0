import React, { createContext, useContext, useState, useEffect } from 'react';

const PlanContext = createContext();

export const usePlan = () => {
  const context = useContext(PlanContext);
  if (!context) {
    throw new Error('usePlan deve ser usado dentro de PlanProvider');
  }
  return context;
};

export const PlanProvider = ({ children }) => {
  const [plan, setPlan] = useState('free'); // 'free' ou 'premium'
  const [adSkipCount, setAdSkipCount] = useState(0);
  const [MAX_AD_SKIPS] = useState(3); // Máximo de pulos de anúncio por sessão (free)

  // Carregar plano do localStorage
  useEffect(() => {
    const savedPlan = localStorage.getItem('userPlan') || 'free';
    setPlan(savedPlan);
  }, []);

  // Salvar plano no localStorage
  useEffect(() => {
    localStorage.setItem('userPlan', plan);
  }, [plan]);

  const upgradeToPremium = () => {
    setPlan('premium');
    setAdSkipCount(0);
    localStorage.setItem('premiumUpgradedAt', new Date().toISOString());
  };

  const downgradeToFree = () => {
    setPlan('free');
    setAdSkipCount(0);
  };

  const useAdSkip = () => {
    if (plan === 'free' && adSkipCount < MAX_AD_SKIPS) {
      setAdSkipCount(adSkipCount + 1);
      return true;
    }
    return false;
  };

  const canSkipAd = () => {
    return plan === 'premium' || adSkipCount < MAX_AD_SKIPS;
  };

  const isPremium = plan === 'premium';
  const isFree = plan === 'free';

  const value = {
    plan,
    isPremium,
    isFree,
    adSkipCount,
    MAX_AD_SKIPS,
    upgradeToPremium,
    downgradeToFree,
    useAdSkip,
    canSkipAd,
  };

  return (
    <PlanContext.Provider value={value}>
      {children}
    </PlanContext.Provider>
  );
};
