import { Button } from "../../ui/button";
import { Card } from "../../ui/card";
import { ArrowLeft, User, Gift } from "lucide-react";

interface GameHeaderProps {
  coins: number;
  stars: number;
  onAvatarClick: () => void;
  onDailyBonusClick: () => void;
  showBackButton?: boolean;
  onBackClick?: () => void;
}

export function GameHeader({ 
  coins, 
  stars, 
  onAvatarClick, 
  onDailyBonusClick, 
  showBackButton = false, 
  onBackClick 
}: GameHeaderProps) {
  return (
    <div className="game-header">
      <div className="header-left">
        {showBackButton && onBackClick && (
          <Button variant="ghost" onClick={onBackClick} className="back-button">
            <ArrowLeft size={20} />
          </Button>
        )}
      </div>
      
      <div className="header-center">
        <Card className="stats-display">
          <div className="stat-item">
            <span className="stat-emoji">💰</span>
            <span className="stat-value">{coins}</span>
          </div>
          <div className="stat-divider">|</div>
          <div className="stat-item">
            <span className="stat-emoji">⭐</span>
            <span className="stat-value">{stars}</span>
          </div>
        </Card>
      </div>
      
      <div className="header-right">
        <Button variant="ghost" onClick={onDailyBonusClick} className="daily-bonus-button">
          <Gift size={20} />
        </Button>
        <Button variant="ghost" onClick={onAvatarClick} className="avatar-button">
          <User size={20} />
        </Button>
      </div>
    </div>
  );
}
