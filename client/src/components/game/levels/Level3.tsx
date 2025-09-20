import { useState } from "react";
import { Button } from "../../ui/button";
import { Card } from "../../ui/card";
import { CelebrationOverlay } from "../ui/CelebrationOverlay";
import { useGameProgress } from "../../../lib/stores/useGameProgress";
import { useAudio } from "../../../lib/stores/useAudio";
import { ArrowLeft } from "lucide-react";

interface Level3Props {
  onComplete: () => void;
  onBack: () => void;
}

export function Level3({ onComplete, onBack }: Level3Props) {
  const [selectedChoice, setSelectedChoice] = useState<'farmer' | 'luxury' | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const { completeLevel } = useGameProgress();
  const { playSuccess } = useAudio();

  const handleChoice = (choice: 'farmer' | 'luxury') => {
    setSelectedChoice(choice);
    setShowResult(true);

    if (choice === 'farmer') {
      // Correct answer
      setTimeout(() => {
        setShowCelebration(true);
        playSuccess();
        completeLevel(3, 3);
      }, 1000);
    }
  };

  const handleTryAgain = () => {
    setSelectedChoice(null);
    setShowResult(false);
  };

  const handleContinue = () => {
    setShowCelebration(false);
    onComplete();
  };

  return (
    <div className="level-container">
      <div className="level-header">
        <Button variant="ghost" onClick={onBack} className="back-button">
          <ArrowLeft size={20} />
          Back
        </Button>
        <h2 className="level-title">Level 3: Good vs Bad Loans</h2>
      </div>

      <div className="level-content">
        <div className="level-instruction">
          <p>Which person is taking a loan for a good reason?</p>
        </div>

        <div className="scenario-container">
          <Card 
            className={`scenario-card ${selectedChoice === 'farmer' ? 'selected' : ''}`}
            onClick={() => !showResult && handleChoice('farmer')}
          >
            <div className="character-content">
              <div className="character-avatar">👨‍🌾</div>
              <h3>Farmer Ram</h3>
              <div className="scenario-details">
                <div className="scenario-emoji">🌱</div>
                <p><strong>Taking loan for:</strong> Seeds to grow crops</p>
                <p><strong>Why:</strong> "I'll sell the crops and earn money to repay the loan"</p>
              </div>
            </div>
          </Card>

          <div className="vs-divider">VS</div>

          <Card 
            className={`scenario-card ${selectedChoice === 'luxury' ? 'selected' : ''}`}
            onClick={() => !showResult && handleChoice('luxury')}
          >
            <div className="character-content">
              <div className="character-avatar">🧑‍💼</div>
              <h3>Person A</h3>
              <div className="scenario-details">
                <div className="scenario-emoji">🚗</div>
                <p><strong>Taking loan for:</strong> Expensive luxury car</p>
                <p><strong>Why:</strong> "I want to look successful and impress people"</p>
              </div>
            </div>
          </Card>
        </div>

        {showResult && (
          <div className="result-container">
            {selectedChoice === 'farmer' ? (
              <div className="correct-result">
                <div className="result-emoji">🎁</div>
                <h3>Smart Choice!</h3>
                <p>Farmer Ram is taking a loan to earn money! This is a good investment that will help him repay the loan.</p>
                <div className="bonus-coins">
                  <span className="coin">💰</span>
                  <span>+5 Bonus Coins!</span>
                </div>
              </div>
            ) : (
              <div className="wrong-result">
                <div className="result-emoji">😔</div>
                <h3>Think again!</h3>
                <p>Taking a loan for luxury items that don't earn money back is risky. Choose the person who will use the loan to make money!</p>
                <div className="heart-loss">
                  <span>Lost 1 heart: ❤️</span>
                </div>
                <Button onClick={handleTryAgain} className="try-again-button">
                  Try Again
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {showCelebration && (
        <CelebrationOverlay
          title="Level 3 Complete!"
          message="You earned 20 coins and 3 stars! (+5 bonus coins)"
          onContinue={handleContinue}
        />
      )}
    </div>
  );
}
