import { useEffect } from "react";
import { Button } from "../../ui/button";
import { Card } from "../../ui/card";

interface CelebrationOverlayProps {
  title: string;
  message: string;
  onContinue: () => void;
}

export function CelebrationOverlay({ title, message, onContinue }: CelebrationOverlayProps) {
  useEffect(() => {
    // Auto-continue after 5 seconds
    const timer = setTimeout(() => {
      onContinue();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onContinue]);

  return (
    <div className="celebration-overlay">
      <div className="fireworks">
        <div className="firework firework-1">💥</div>
        <div className="firework firework-2">🎆</div>
        <div className="firework firework-3">✨</div>
        <div className="firework firework-4">🎇</div>
        <div className="firework firework-5">💫</div>
      </div>
      
      <Card className="celebration-card">
        <div className="celebration-content">
          <div className="celebration-emoji">🏆</div>
          <h2>{title}</h2>
          <p>{message}</p>
          
          <div className="coin-rain">
            {Array.from({ length: 10 }, (_, i) => (
              <span key={i} className={`falling-coin coin-${i}`}>💰</span>
            ))}
          </div>
          
          <div className="stars-display">
            <span className="star star-1">⭐</span>
            <span className="star star-2">⭐</span>
            <span className="star star-3">⭐</span>
          </div>
          
          <Button onClick={onContinue} className="continue-button" size="lg">
            Continue
          </Button>
        </div>
      </Card>
    </div>
  );
}
