import { useState } from "react";
import { LevelSelect } from "./LevelSelect";
import { FestivalBudgeting } from "./challenges/FestivalBudgeting";
import { Level2 } from "./levels/Level2";
import { Level3 } from "./levels/Level3";
import { Level4 } from "./levels/Level4";
import { GenericLevel } from "./levels/GenericLevel";
import { AvatarCustomizer } from "./ui/AvatarCustomizer";
import { DailyBonus } from "./ui/DailyBonus";
import { GameHeader } from "./ui/GameHeader";
import { useGameProgress } from "../../lib/stores/useGameProgress";

export function GameContainer() {
  const [currentScreen, setCurrentScreen] = useState<'challengeSelect' | 'challenge' | 'avatar' | 'dailyBonus'>('challengeSelect');
  const [currentChallenge, setCurrentChallenge] = useState(1);
  const { coins, stars, trustTokens, earnedBadges, completedChallenges, completedLevels } = useGameProgress();
  
  // Use completed challenges primarily, fall back to levels for backward compatibility
  const actualCompletedChallenges = completedChallenges.length > 0 ? completedChallenges : completedLevels;

  const handleChallengeSelect = (challengeId: number) => {
    setCurrentChallenge(challengeId);
    setCurrentScreen('challenge');
  };

  const handleChallengeComplete = () => {
    setCurrentScreen('challengeSelect');
  };

  const handleBackToMenu = () => {
    setCurrentScreen('challengeSelect');
  };

  const renderCurrentChallenge = () => {
    switch (currentChallenge) {
      case 1:
        return <FestivalBudgeting onComplete={handleChallengeComplete} onBack={handleBackToMenu} />;
      case 2:
        return <Level2 onComplete={handleChallengeComplete} onBack={handleBackToMenu} />;
      case 3:
        return <Level3 onComplete={handleChallengeComplete} onBack={handleBackToMenu} />;
      case 4:
        return <Level4 onComplete={handleChallengeComplete} onBack={handleBackToMenu} />;
      case 5:
        return <GenericLevel level={currentChallenge} onComplete={handleChallengeComplete} onBack={handleBackToMenu} />;
      case 6:
        return <GenericLevel level={currentChallenge} onComplete={handleChallengeComplete} onBack={handleBackToMenu} />;
      default:
        return <GenericLevel level={currentChallenge} onComplete={handleChallengeComplete} onBack={handleBackToMenu} />;
    }
  };

  return (
    <div className="game-container">
      <GameHeader 
        coins={coins}
        stars={stars}
        onAvatarClick={() => setCurrentScreen('avatar')}
        onDailyBonusClick={() => setCurrentScreen('dailyBonus')}
        showBackButton={currentScreen !== 'challengeSelect'}
        onBackClick={handleBackToMenu}
      />
      
      {currentScreen === 'challengeSelect' && (
        <LevelSelect
          completedChallenges={actualCompletedChallenges}
          onChallengeSelect={handleChallengeSelect}
        />
      )}
      
      {currentScreen === 'challenge' && renderCurrentChallenge()}
      
      {currentScreen === 'avatar' && (
        <AvatarCustomizer onBack={handleBackToMenu} />
      )}
      
      {currentScreen === 'dailyBonus' && (
        <DailyBonus onBack={handleBackToMenu} />
      )}
    </div>
  );
}
