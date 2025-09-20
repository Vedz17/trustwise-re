import { useState } from "react";
import { Button } from "../../ui/button";
import { Card } from "../../ui/card";
import { CelebrationOverlay } from "../ui/CelebrationOverlay";
import { useGameProgress } from "../../../lib/stores/useGameProgress";
import { useAudio } from "../../../lib/stores/useAudio";
import { ArrowLeft, Clock } from "lucide-react";
import { getGenericLevelData } from "../../../lib/gameData";

interface GenericLevelProps {
  level: number;
  onComplete: () => void;
  onBack: () => void;
}

export function GenericLevel({ level, onComplete, onBack }: GenericLevelProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10);
  const [isTimedChallenge, setIsTimedChallenge] = useState(false);
  const { completeLevel } = useGameProgress();
  const { playSuccess } = useAudio();

  const levelData = getGenericLevelData(level);

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    setShowResult(true);

    if (answer === levelData.correctAnswer) {
      setTimeout(() => {
        setShowCelebration(true);
        playSuccess();
        completeLevel(level, 3);
      }, 1000);
    }
  };

  const handleTryAgain = () => {
    setSelectedAnswer(null);
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
        <h2 className="level-title">{levelData.title}</h2>
        {levelData.type === 'timed' && (
          <div className="timer">
            <Clock size={16} />
            <span>{timeLeft}s</span>
          </div>
        )}
      </div>

      <div className="level-content">
        <div className="level-instruction">
          <p>{levelData.question}</p>
        </div>

        {levelData.type === 'multiple-choice' && (
          <div className="choices-container">
            {levelData.options?.map((option, index) => (
              <Card 
                key={index}
                className={`choice-card ${selectedAnswer === option.id ? 'selected' : ''}`}
                onClick={() => !showResult && handleAnswer(option.id)}
              >
                <div className="choice-content">
                  <div className="choice-emoji">{option.emoji}</div>
                  <h3>{option.text}</h3>
                </div>
              </Card>
            ))}
          </div>
        )}

        {levelData.type === 'matching' && (
          <div className="matching-container">
            <div className="matching-items">
              {levelData.matchingPairs?.map((pair, index) => (
                <div key={index} className="matching-pair">
                  <Card className="matching-item">
                    <span className="item-emoji">{pair.left.emoji}</span>
                    <span>{pair.left.text}</span>
                  </Card>
                  <div className="arrow">→</div>
                  <Card className="matching-item">
                    <span className="item-emoji">{pair.right.emoji}</span>
                    <span>{pair.right.text}</span>
                  </Card>
                </div>
              ))}
            </div>
            <Button onClick={() => handleAnswer('correct')} className="check-button" size="lg">
              These Match Correctly
            </Button>
          </div>
        )}

        {levelData.type === 'memory' && (
          <div className="memory-grid">
            {levelData.memoryCards?.map((card, index) => (
              <Card key={index} className="memory-card">
                <div className="card-emoji">{card.emoji}</div>
              </Card>
            ))}
          </div>
        )}

        {showResult && (
          <div className="result-container">
            {selectedAnswer === levelData.correctAnswer ? (
              <div className="correct-result">
                <div className="result-emoji">🎉</div>
                <h3>Fantastic!</h3>
                <p>{levelData.successMessage}</p>
                <div className="coin-shower">
                  <span className="coin">💰</span>
                  <span className="coin">💰</span>
                  <span className="coin">💰</span>
                </div>
              </div>
            ) : (
              <div className="wrong-result">
                <div className="result-emoji">😔</div>
                <h3>Keep trying!</h3>
                <p>{levelData.failMessage}</p>
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
          title={`Level ${level} Complete!`}
          message="You earned 15 coins and 3 stars!"
          onContinue={handleContinue}
        />
      )}
    </div>
  );
}
