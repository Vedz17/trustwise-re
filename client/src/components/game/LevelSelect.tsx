import { useState } from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Star, Lock, Play } from "lucide-react";

interface LevelSelectProps {
  completedLevels: number[];
  onLevelSelect: (level: number) => void;
}

export function LevelSelect({ completedLevels, onLevelSelect }: LevelSelectProps) {
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);

  const levels = Array.from({ length: 10 }, (_, i) => i + 1);

  const isLevelUnlocked = (level: number) => {
    if (level === 1) return true;
    return completedLevels.includes(level - 1);
  };

  const isLevelCompleted = (level: number) => {
    return completedLevels.includes(level);
  };

  const getLevelTitle = (level: number) => {
    const titles = {
      1: "Saving vs Spending",
      2: "Needs vs Wants",
      3: "Good vs Bad Loans",
      4: "Avoiding Scams",
      5: "Banking Basics",
      6: "Investment Intro",
      7: "Budget Planning",
      8: "Emergency Fund",
      9: "Credit Cards",
      10: "Final Challenge"
    };
    return titles[level as keyof typeof titles];
  };

  const getLevelEmoji = (level: number) => {
    const emojis = {
      1: "🐷",
      2: "🏠",
      3: "🌱",
      4: "🚫",
      5: "🏦",
      6: "📈",
      7: "📊",
      8: "🆘",
      9: "💳",
      10: "🏆"
    };
    return emojis[level as keyof typeof emojis];
  };

  return (
    <div className="level-select">
      <div className="level-select-header">
        <h1 className="game-title">Money Quest</h1>
        <p className="game-subtitle">Learn & Win</p>
      </div>

      <div className="level-map">
        <div className="level-path">
          {levels.map((level, index) => {
            const isUnlocked = isLevelUnlocked(level);
            const isCompleted = isLevelCompleted(level);
            const isSelected = selectedLevel === level;

            return (
              <div key={level} className="level-node-container">
                {/* Connection line to previous level */}
                {index > 0 && (
                  <div className={`level-connection ${isUnlocked ? 'unlocked' : 'locked'}`} />
                )}
                
                <Card 
                  className={`level-node ${!isUnlocked ? 'locked' : ''} ${isSelected ? 'selected' : ''} ${isCompleted ? 'completed' : ''}`}
                  onClick={() => {
                    if (isUnlocked) {
                      setSelectedLevel(level);
                    }
                  }}
                >
                  <div className="level-content">
                    <div className="level-emoji">
                      {isUnlocked ? getLevelEmoji(level) : <Lock size={24} />}
                    </div>
                    <div className="level-number">{level}</div>
                    {isCompleted && (
                      <div className="level-stars">
                        <Star className="star filled" size={16} />
                        <Star className="star filled" size={16} />
                        <Star className="star filled" size={16} />
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            );
          })}
        </div>

        {selectedLevel && isLevelUnlocked(selectedLevel) && (
          <div className="level-preview">
            <Card className="level-preview-card">
              <div className="level-preview-content">
                <h3>Level {selectedLevel}</h3>
                <p className="level-title">{getLevelTitle(selectedLevel)}</p>
                <div className="level-emoji-large">
                  {getLevelEmoji(selectedLevel)}
                </div>
                <Button 
                  onClick={() => onLevelSelect(selectedLevel)}
                  className="play-button"
                  size="lg"
                >
                  <Play size={20} />
                  Play Level
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
