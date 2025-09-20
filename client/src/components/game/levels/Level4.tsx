import { useState } from "react";
import { Button } from "../../ui/button";
import { Card } from "../../ui/card";
import { CelebrationOverlay } from "../ui/CelebrationOverlay";
import { useGameProgress } from "../../../lib/stores/useGameProgress";
import { useAudio } from "../../../lib/stores/useAudio";
import { ArrowLeft } from "lucide-react";

interface Level4Props {
  onComplete: () => void;
  onBack: () => void;
}

export function Level4({ onComplete, onBack }: Level4Props) {
  const [selectedChoice, setSelectedChoice] = useState<'believe' | 'refuse' | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [hearts, setHearts] = useState(3);
  const { completeLevel } = useGameProgress();
  const { playSuccess } = useAudio();

  const handleChoice = (choice: 'believe' | 'refuse') => {
    setSelectedChoice(choice);
    setShowResult(true);

    if (choice === 'refuse') {
      // Correct answer
      setTimeout(() => {
        setShowCelebration(true);
        playSuccess();
        completeLevel(4, 3);
      }, 1000);
    } else {
      // Wrong answer - lose a heart
      setHearts(prev => prev - 1);
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
        <h2 className="level-title">Level 4: Avoiding Scams</h2>
        <div className="hearts-display">
          {Array.from({ length: 3 }, (_, i) => (
            <span key={i} className={`heart ${i < hearts ? 'filled' : 'empty'}`}>
              {i < hearts ? '❤️' : '🤍'}
            </span>
          ))}
        </div>
      </div>

      <div className="level-content">
        <div className="scammer-popup">
          <Card className="scammer-card">
            <div className="scammer-character">
              <div className="scammer-avatar">🕴️</div>
              <div className="speech-bubble">
                <p><strong>"Hey! Give me 100 rupees today, I'll give you 1000 rupees tomorrow!"</strong></p>
                <p><em>"Trust me, it's a guaranteed deal!"</em></p>
              </div>
            </div>
          </Card>
        </div>

        <div className="level-instruction">
          <p>What should you do?</p>
        </div>

        <div className="choices-container">
          <Card 
            className={`choice-card ${selectedChoice === 'believe' ? 'selected' : ''}`}
            onClick={() => !showResult && handleChoice('believe')}
          >
            <div className="choice-content">
              <div className="choice-emoji">🤔</div>
              <h3>Option A</h3>
              <p>Believe him and give the money</p>
            </div>
          </Card>

          <Card 
            className={`choice-card ${selectedChoice === 'refuse' ? 'selected' : ''}`}
            onClick={() => !showResult && handleChoice('refuse')}
          >
            <div className="choice-content">
              <div className="choice-emoji">🚫</div>
              <h3>Option B</h3>
              <p>Say "No, it's a scam!"</p>
            </div>
          </Card>
        </div>

        {showResult && (
          <div className="result-container">
            {selectedChoice === 'refuse' ? (
              <div className="correct-result">
                <div className="result-emoji">🎁</div>
                <h3>Excellent Protection!</h3>
                <p>You avoided the scam! Remember: If someone promises too much money too easily, it's usually a scam.</p>
                <div className="treasure-chest">
                  <span className="treasure">💎</span>
                  <span>Treasure Chest Bonus!</span>
                </div>
              </div>
            ) : (
              <div className="wrong-result">
                <div className="result-emoji">😔</div>
                <h3>Oh no! You got scammed!</h3>
                <p>The person took your money and disappeared! Always be careful of deals that sound too good to be true.</p>
                <div className="heart-loss">
                  <span>Lost 1 heart: 💔</span>
                </div>
                {hearts > 1 ? (
                  <Button onClick={handleTryAgain} className="try-again-button">
                    Try Again
                  </Button>
                ) : (
                  <Button onClick={onBack} className="restart-button">
                    Restart Level
                  </Button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {showCelebration && (
        <CelebrationOverlay
          title="Level 4 Complete!"
          message="You earned 25 coins and 3 stars! (Treasure bonus included)"
          onContinue={handleContinue}
        />
      )}
    </div>
  );
}
