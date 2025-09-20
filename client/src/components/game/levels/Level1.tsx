import { useState } from "react";
import { Button } from "../../ui/button";
import { Card } from "../../ui/card";
import { CelebrationOverlay } from "../ui/CelebrationOverlay";
import { useGameProgress } from "../../../lib/stores/useGameProgress";
import { useAudio } from "../../../lib/stores/useAudio";
import { ArrowLeft } from "lucide-react";

interface Level1Props {
  onComplete: () => void;
  onBack: () => void;
}

export function Level1({ onComplete, onBack }: Level1Props) {
  const [selectedChoice, setSelectedChoice] = useState<'saving' | 'spending' | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const { completeLevel } = useGameProgress();
  const { playSuccess } = useAudio();

  const handleChoice = (choice: 'saving' | 'spending') => {
    setSelectedChoice(choice);
    setShowResult(true);

    if (choice === 'saving') {
      // Correct answer
      setTimeout(() => {
        setShowCelebration(true);
        playSuccess();
        completeLevel(1, 3); // Award 3 stars and coins
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
        <h2 className="level-title">Level 1: Saving vs Spending</h2>
      </div>

      <div className="level-content">
        <div className="level-instruction">
          <p>Which choice helps you win more money later?</p>
        </div>

        <div className="choices-container">
          <Card 
            className={`choice-card ${selectedChoice === 'saving' ? 'selected' : ''}`}
            onClick={() => !showResult && handleChoice('saving')}
          >
            <div className="choice-content">
              <div className="choice-emoji">🐷</div>
              <h3>Saving</h3>
              <p>Put money in piggy bank</p>
            </div>
          </Card>

          <Card 
            className={`choice-card ${selectedChoice === 'spending' ? 'selected' : ''}`}
            onClick={() => !showResult && handleChoice('spending')}
          >
            <div className="choice-content">
              <div className="choice-emoji">🛍️</div>
              <h3>Spending</h3>
              <p>Buy things right away</p>
            </div>
          </Card>
        </div>

        {showResult && (
          <div className="result-container">
            {selectedChoice === 'saving' ? (
              <div className="correct-result">
                <div className="result-emoji">🎉</div>
                <h3>Excellent Choice!</h3>
                <p>Saving helps you win more money later. Great job!</p>
                <div className="coin-shower">
                  <span className="coin">💰</span>
                  <span className="coin">💰</span>
                  <span className="coin">💰</span>
                </div>
              </div>
            ) : (
              <div className="wrong-result">
                <div className="result-emoji">😔</div>
                <h3>Don't worry, you'll get it!</h3>
                <p>Try again! Saving helps you win more money later.</p>
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
          title="Level 1 Complete!"
          message="You earned 15 coins and 3 stars!"
          onContinue={handleContinue}
        />
      )}
    </div>
  );
}
