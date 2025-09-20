import { useState } from "react";
import { LevelSelect } from "./LevelSelect";
import { Level1 } from "./levels/Level1";
import { Level2 } from "./levels/Level2";
import { Level3 } from "./levels/Level3";
import { Level4 } from "./levels/Level4";
import { GenericLevel } from "./levels/GenericLevel";
import { AvatarCustomizer } from "./ui/AvatarCustomizer";
import { DailyBonus } from "./ui/DailyBonus";
import { GameHeader } from "./ui/GameHeader";
import { useGameProgress } from "../../lib/stores/useGameProgress";

export function GameContainer() {
  const [currentScreen, setCurrentScreen] = useState<'levelSelect' | 'game' | 'avatar' | 'dailyBonus'>('levelSelect');
  const [currentLevel, setCurrentLevel] = useState(1);
  const { coins, stars, completedLevels } = useGameProgress();

  const handleLevelSelect = (level: number) => {
    setCurrentLevel(level);
    setCurrentScreen('game');
  };

  const handleLevelComplete = () => {
    setCurrentScreen('levelSelect');
  };

  const handleBackToMenu = () => {
    setCurrentScreen('levelSelect');
  };

  const renderCurrentLevel = () => {
    switch (currentLevel) {
      case 1:
        return <Level1 onComplete={handleLevelComplete} onBack={handleBackToMenu} />;
      case 2:
        return <Level2 onComplete={handleLevelComplete} onBack={handleBackToMenu} />;
      case 3:
        return <Level3 onComplete={handleLevelComplete} onBack={handleBackToMenu} />;
      case 4:
        return <Level4 onComplete={handleLevelComplete} onBack={handleBackToMenu} />;
      default:
        return <GenericLevel level={currentLevel} onComplete={handleLevelComplete} onBack={handleBackToMenu} />;
    }
  };

  return (
    <div className="game-container">
      <GameHeader 
        coins={coins}
        stars={stars}
        onAvatarClick={() => setCurrentScreen('avatar')}
        onDailyBonusClick={() => setCurrentScreen('dailyBonus')}
        showBackButton={currentScreen !== 'levelSelect'}
        onBackClick={handleBackToMenu}
      />
      
      {currentScreen === 'levelSelect' && (
        <LevelSelect
          completedLevels={completedLevels}
          onLevelSelect={handleLevelSelect}
        />
      )}
      
      {currentScreen === 'game' && renderCurrentLevel()}
      
      {currentScreen === 'avatar' && (
        <AvatarCustomizer onBack={handleBackToMenu} />
      )}
      
      {currentScreen === 'dailyBonus' && (
        <DailyBonus onBack={handleBackToMenu} />
      )}
    </div>
  );
}
