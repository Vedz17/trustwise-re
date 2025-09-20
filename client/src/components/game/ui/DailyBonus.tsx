import { useState, useEffect } from "react";
import { Button } from "../../ui/button";
import { Card } from "../../ui/card";
import { useGameProgress } from "../../../lib/stores/useGameProgress";
import { useAudio } from "../../../lib/stores/useAudio";
import { ArrowLeft } from "lucide-react";

interface DailyBonusProps {
  onBack: () => void;
}

export function DailyBonus({ onBack }: DailyBonusProps) {
  const [hasSpunToday, setHasSpunToday] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<{ coins: number; emoji: string } | null>(null);
  const { addCoins } = useGameProgress();
  const { playSuccess } = useAudio();

  const prizes = [
    { coins: 5, emoji: "💰", weight: 30 },
    { coins: 10, emoji: "💎", weight: 25 },
    { coins: 15, emoji: "🎁", weight: 20 },
    { coins: 25, emoji: "🏆", weight: 15 },
    { coins: 50, emoji: "👑", weight: 8 },
    { coins: 100, emoji: "💫", weight: 2 },
  ];

  useEffect(() => {
    // Check if user has already spun today
    const lastSpinDate = localStorage.getItem('lastDailyBonus');
    const today = new Date().toDateString();
    
    if (lastSpinDate === today) {
      setHasSpunToday(true);
    }
  }, []);

  const spinWheel = () => {
    if (hasSpunToday || isSpinning) return;

    setIsSpinning(true);

    // Create weighted random selection
    const totalWeight = prizes.reduce((sum, prize) => sum + prize.weight, 0);
    let random = Math.random() * totalWeight;
    
    let selectedPrize = prizes[0];
    for (const prize of prizes) {
      random -= prize.weight;
      if (random <= 0) {
        selectedPrize = prize;
        break;
      }
    }

    // Simulate spinning animation
    setTimeout(() => {
      setResult(selectedPrize);
      addCoins(selectedPrize.coins);
      playSuccess();
      setIsSpinning(false);
      setHasSpunToday(true);
      
      // Save today's date
      localStorage.setItem('lastDailyBonus', new Date().toDateString());
    }, 3000);
  };

  return (
    <div className="daily-bonus">
      <div className="bonus-header">
        <Button variant="ghost" onClick={onBack} className="back-button">
          <ArrowLeft size={20} />
          Back
        </Button>
        <h2>Daily Bonus Wheel</h2>
      </div>

      <div className="wheel-container">
        <Card className="wheel-card">
          <div className={`spinning-wheel ${isSpinning ? 'spinning' : ''}`}>
            <div className="wheel-center">🎡</div>
            <div className="wheel-prizes">
              {prizes.map((prize, index) => (
                <div 
                  key={index} 
                  className="wheel-prize"
                  style={{
                    transform: `rotate(${(360 / prizes.length) * index}deg)`,
                  }}
                >
                  <span className="prize-emoji">{prize.emoji}</span>
                  <span className="prize-coins">{prize.coins}</span>
                </div>
              ))}
            </div>
            <div className="wheel-pointer">▲</div>
          </div>
        </Card>
      </div>

      <div className="bonus-info">
        {!hasSpunToday ? (
          <div className="can-spin">
            <p>Spin the wheel for your daily bonus!</p>
            <Button 
              onClick={spinWheel} 
              disabled={isSpinning}
              className="spin-button"
              size="lg"
            >
              {isSpinning ? "Spinning..." : "Spin Wheel!"}
            </Button>
          </div>
        ) : (
          <div className="already-spun">
            <p>You've already collected your daily bonus!</p>
            <p>Come back tomorrow for another spin.</p>
            {result && (
              <div className="today-result">
                <span className="result-emoji">{result.emoji}</span>
                <span>You won {result.coins} coins today!</span>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="prize-list">
        <h3>Possible Prizes:</h3>
        <div className="prizes-grid">
          {prizes.map((prize, index) => (
            <div key={index} className="prize-item">
              <span className="prize-emoji">{prize.emoji}</span>
              <span className="prize-amount">{prize.coins} coins</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
