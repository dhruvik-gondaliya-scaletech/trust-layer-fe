import { useEffect, useState } from "react";

export function useTrustScoreAnimation(trustScore: number) {
  const [displayScore, setDisplayScore] = useState(0);
  const [isScoreLoaded, setIsScoreLoaded] = useState(false);
  const [showBurst, setShowBurst] = useState(false);

  useEffect(() => {
    const endScore = trustScore || 90;
    const duration = 1500;
    const incrementTime = 30;

    if (endScore === 0) {
      setDisplayScore(0);
      setIsScoreLoaded(true);
      return;
    }

    const steps = duration / incrementTime;
    const increment = endScore / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= endScore) {
        setDisplayScore(endScore);
        setIsScoreLoaded(true);
        if (endScore === 100) {
          setShowBurst(true);
          setTimeout(() => setShowBurst(false), 2000);
        }
        clearInterval(timer);
      } else {
        setDisplayScore(Math.floor(current));
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [trustScore]);

  return { displayScore, isScoreLoaded, showBurst };
}
