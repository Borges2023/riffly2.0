import React, { useState } from "react";
import { usePlan } from "../context/PlanContext";
import { useAds } from "../context/AdContext";
import { useAuth } from "../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faTimes,
  faStar,
  faAd,
  faCrown,
} from "@fortawesome/free-solid-svg-icons";
import "../styles/plans.css";

const Plans = () => {
  const { plan, isPremium, isFree, upgradeToPremium, downgradeToFree, adSkipCount, MAX_AD_SKIPS } =
    usePlan();
  const { adsViewed, adsClicked } = useAds();
  const { isAuthenticated } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState("credit_card");

  const features = [
    {
      name: "Reprodução de Música",
      free: true,
      premium: true,
    },
    {
      name: "Sem Anúncios",
      free: false,
      premium: true,
    },
    {
      name: "Pular Anúncios",
      free: `${adSkipCount}/${MAX_AD_SKIPS}`,
      premium: "∞",
    },
    {
      name: "Qualidade HD",
      free: false,
      premium: true,
    },
    {
      name: "Download de Músicas",
      free: false,
      premium: true,
    },
    {
      name: "Playlists Ilimitadas",
      free: false,
      premium: true,
    },
    {
      name: "Suporte Prioritário",
      free: false,
      premium: true,
    },
    {
      name: "Sync entre Dispositivos",
      free: false,
      premium: true,
    },
  ];

  return (
    <div className="plans-page">
      <div className="plans-header">
        <h1>Escolha seu Plano</h1>
        <p>Desbloqueie o melhor da Riffly</p>
        {!isAuthenticated && (
          <div className="plans-login-warning">
            <p>
              <strong>Atenção:</strong> faça login para salvar seu plano e escolher o método de pagamento.
            </p>
            <a href="#/login" className="btn btn--secondary">
              Fazer login
            </a>
          </div>
        )}
      </div>

      {/* Current Plan Info */}
      <div className="current-plan-info">
        <div className="plan-badge">
          {isPremium ? (
            <>
              <FontAwesomeIcon icon={faCrown} className="badge-icon premium" />
              Plano Premium Ativo
            </>
          ) : (
            <>
              <FontAwesomeIcon icon={faAd} className="badge-icon free" />
              Plano Gratuito
            </>
          )}
        </div>
        {isFree && (
          <div className="ads-stats">
            <p>
              <strong>Anúncios Assistidos:</strong> {adsViewed}
            </p>
            <p>
              <strong>Cliques em Anúncios:</strong> {adsClicked}
            </p>
            <p>
              <strong>Pulos de Anúncios:</strong> {adSkipCount}/{MAX_AD_SKIPS}
            </p>
          </div>
        )}
      </div>

      {/* Plans Comparison */}
      <div className="plans-container">
        {/* Free Plan */}
        <div className={`plan-card free-card ${isFree ? "active" : ""}`}>
          <div className="plan-header">
            <h2>Gratuito</h2>
            <div className="plan-price">
              <span className="currency">R$</span>
              <span className="price">0</span>
              <span className="period">/mês</span>
            </div>
          </div>

          <button
            className="plan-button"
            onClick={!isFree ? downgradeToFree : undefined}
            disabled={isFree}
          >
            {isFree ? "Plano Atual" : "Mudar para Gratuito"}
          </button>

          <div className="plan-features">
            <p className="features-title">Inclui:</p>
            {features.map((feature, index) => (
              <div key={index} className="feature">
                <span className="feature-name">{feature.name}</span>
                {feature.free ? (
                  <>
                    <FontAwesomeIcon icon={faCheck} className="feature-icon check" />
                    {typeof feature.free === "string" && (
                      <span className="feature-value">{feature.free}</span>
                    )}
                  </>
                ) : (
                  <FontAwesomeIcon icon={faTimes} className="feature-icon times" />
                )}
              </div>
            ))}
          </div>

          <div className="plan-note">
            💡 Com propagandas, você ajuda a manter o Riffly funcionando!
          </div>
        </div>

        {/* Premium Plan */}
        <div className={`plan-card premium-card ${isPremium ? "active" : ""}`}>
          <div className="premium-badge">
            <FontAwesomeIcon icon={faStar} /> RECOMENDADO
          </div>

          <div className="plan-header">
            <h2>Premium</h2>
            <div className="plan-price">
              <span className="currency">R$</span>
              <span className="price">9,99</span>
              <span className="period">/mês</span>
            </div>
          </div>

          <button
            className="plan-button premium-button"
            onClick={upgradeToPremium}
            disabled={isPremium}
          >
            {isPremium ? "Plano Ativo ✓" : "Fazer Upgrade"}
          </button>

          {!isPremium && (
            <div className="payment-selection">
              <h3>Como deseja pagar?</h3>
              <div className="payment-methods">
                <label>
                  <input
                    type="radio"
                    name="payment"
                    value="credit_card"
                    checked={paymentMethod === "credit_card"}
                    onChange={() => setPaymentMethod("credit_card")}
                  />
                  Cartão de crédito
                </label>
                <label>
                  <input
                    type="radio"
                    name="payment"
                    value="pix"
                    checked={paymentMethod === "pix"}
                    onChange={() => setPaymentMethod("pix")}
                  />
                  PIX
                </label>
                <label>
                  <input
                    type="radio"
                    name="payment"
                    value="boleto"
                    checked={paymentMethod === "boleto"}
                    onChange={() => setPaymentMethod("boleto")}
                  />
                  Boleto
                </label>
              </div>
              <p className="payment-note">
                Método de pagamento selecionado: <strong>{paymentMethod}</strong>
              </p>
            </div>
          )}

          <div className="plan-features">
            <p className="features-title">Inclui:</p>
            {features.map((feature, index) => (
              <div key={index} className="feature">
                <span className="feature-name">{feature.name}</span>
                <FontAwesomeIcon icon={faCheck} className="feature-icon check" />
                {typeof feature.premium === "string" && (
                  <span className="feature-value">{feature.premium}</span>
                )}
              </div>
            ))}
          </div>

          <div className="plan-benefits">
            <h3>Benefícios Exclusivos:</h3>
            <ul>
              <li>🎵 Streaming sem interrupções</li>
              <li>🚀 Prioridade em novos recursos</li>
              <li>💾 Baixe suas músicas favoritas</li>
              <li>🌍 Acesso em todos os dispositivos</li>
            </ul>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="plans-faq">
        <h2>Dúvidas Frequentes</h2>
        <div className="faq-items">
          <div className="faq-item">
            <h4>Posso cancelar a assinatura a qualquer momento?</h4>
            <p>Sim, sem compromisso. Cancele quando quiser pelo seu painel.</p>
          </div>
          <div className="faq-item">
            <h4>Há período de teste gratuito?</h4>
            <p>Não, mas comece com o plano gratuito e faça upgrade quando desejar.</p>
          </div>
          <div className="faq-item">
            <h4>Quais métodos de pagamento são aceitos?</h4>
            <p>Cartão de crédito, débito e carteiras digitais.</p>
          </div>
          <div className="faq-item">
            <h4>Como funcionam os anúncios no plano gratuito?</h4>
            <p>Você verá anúncios relevantes durante a reprodução e poderá pular 3 por sessão.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Plans;
