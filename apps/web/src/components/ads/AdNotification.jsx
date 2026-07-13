import React, { useState, useEffect } from 'react';
import { useAds } from '../../context/AdContext';
import { usePlan } from '../../context/PlanContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faCheckCircle, faClock } from '@fortawesome/free-solid-svg-icons';
import './AdNotification.css';

const AdNotification = () => {
  const { currentAd, showAd, hideAd, clickAd, nextAd } = useAds();
  const { isFree, canSkipAd, useAdSkip } = usePlan();
  const [countdown, setCountdown] = useState(currentAd?.duration || 10);
  const [canClose, setCanClose] = useState(false);

  // Reinicializar countdown quando showAd muda
  useEffect(() => {
    if (showAd) {
      setCountdown(currentAd?.duration || 10);
      setCanClose(false);
    }
  }, [showAd, currentAd]);

  // Countdown timer
  useEffect(() => {
    if (!showAd) return;

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setCanClose(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [showAd]);

  if (!showAd || !currentAd) return null;

  const handleClose = () => {
    if (canClose) {
      hideAd();
      nextAd();
    } else if (isFree && canSkipAd()) {
      useAdSkip();
      hideAd();
      nextAd();
    }
  };

  const handleClick = () => {
    clickAd();
    if (!currentAd.internal) {
      window.open(currentAd.url, '_blank');
    }
  };

  return (
    <div className="ad-notification-overlay">
      <div className="ad-notification-container">
        {/* Close Button */}
        <button
          className={`ad-close-button ${canClose || (isFree && canSkipAd()) ? 'enabled' : 'disabled'}`}
          onClick={handleClose}
          disabled={!canClose && (!isFree || !canSkipAd())}
          title={canClose ? 'Fechar' : 'Aguarde...'}
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>

        {/* Ad Content */}
        <div className="ad-content">
          <img src={currentAd.image} alt={currentAd.title} className="ad-image" />
          
          <div className="ad-info">
            <h3 className="ad-title">{currentAd.title}</h3>
            <p className="ad-description">{currentAd.description}</p>

            {/* CTA Button */}
            <button
              className="ad-cta-button"
              onClick={handleClick}
            >
              {currentAd.cta} →
            </button>
          </div>
        </div>

        {/* Countdown / Premium Badge */}
        <div className="ad-footer">
          {isFree ? (
            <div className="ad-countdown">
              <FontAwesomeIcon icon={faClock} className="clock-icon" />
              {canClose ? (
                <span className="countdown-complete">
                  <FontAwesomeIcon icon={faCheckCircle} /> Anúncio assistido
                </span>
              ) : (
                <span className="countdown-timer">
                  {countdown}s - Feche em {countdown}s
                </span>
              )}
            </div>
          ) : (
            <div className="ad-premium-badge">
              <FontAwesomeIcon icon={faCheckCircle} className="premium-icon" />
              <span>Sem anúncios (Premium)</span>
            </div>
          )}
        </div>

        {/* Brand */}
        <div className="ad-brand">Riffly Ads</div>
      </div>
    </div>
  );
};

export default AdNotification;
