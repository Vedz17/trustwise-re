import { useState, useRef } from "react";
import { Button } from "../../ui/button";
import { Card } from "../../ui/card";
import { CelebrationOverlay } from "../ui/CelebrationOverlay";
import { useGameProgress } from "../../../lib/stores/useGameProgress";
import { useAudio } from "../../../lib/stores/useAudio";
import { ArrowLeft } from "lucide-react";

interface Level2Props {
  onComplete: () => void;
  onBack: () => void;
}

interface Item {
  id: string;
  emoji: string;
  name: string;
  type: 'need' | 'want';
}

export function Level2({ onComplete, onBack }: Level2Props) {
  const [draggedItem, setDraggedItem] = useState<Item | null>(null);
  const [needsBasket, setNeedsBasket] = useState<Item[]>([]);
  const [wantsBasket, setWantsBasket] = useState<Item[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const { completeLevel } = useGameProgress();
  const { playSuccess } = useAudio();

  const items: Item[] = [
    { id: '1', emoji: '🍲', name: 'Food', type: 'need' },
    { id: '2', emoji: '🏠', name: 'House', type: 'need' },
    { id: '3', emoji: '📱', name: 'Mobile', type: 'want' },
    { id: '4', emoji: '💍', name: 'Gold Ring', type: 'want' },
  ];

  const availableItems = items.filter(item => 
    !needsBasket.find(n => n.id === item.id) && 
    !wantsBasket.find(w => w.id === item.id)
  );

  const handleDragStart = (item: Item) => {
    setDraggedItem(item);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const handleDrop = (basketType: 'needs' | 'wants') => {
    if (!draggedItem) return;

    if (basketType === 'needs') {
      setNeedsBasket(prev => [...prev, draggedItem]);
    } else {
      setWantsBasket(prev => [...prev, draggedItem]);
    }
    setDraggedItem(null);
  };

  const handleCheck = () => {
    setShowResult(true);
    const correctNeeds = needsBasket.every(item => item.type === 'need');
    const correctWants = wantsBasket.every(item => item.type === 'want');
    const allItemsPlaced = needsBasket.length + wantsBasket.length === items.length;

    if (correctNeeds && correctWants && allItemsPlaced) {
      setTimeout(() => {
        setShowCelebration(true);
        playSuccess();
        completeLevel(2, 3);
      }, 1000);
    }
  };

  const handleTryAgain = () => {
    setNeedsBasket([]);
    setWantsBasket([]);
    setShowResult(false);
  };

  const handleContinue = () => {
    setShowCelebration(false);
    onComplete();
  };

  const isCorrect = () => {
    const correctNeeds = needsBasket.every(item => item.type === 'need');
    const correctWants = wantsBasket.every(item => item.type === 'want');
    const allItemsPlaced = needsBasket.length + wantsBasket.length === items.length;
    return correctNeeds && correctWants && allItemsPlaced;
  };

  return (
    <div className="level-container">
      <div className="level-header">
        <Button variant="ghost" onClick={onBack} className="back-button">
          <ArrowLeft size={20} />
          Back
        </Button>
        <h2 className="level-title">Level 2: Needs vs Wants</h2>
      </div>

      <div className="level-content">
        <div className="level-instruction">
          <p>Drag items to the correct basket: Needs (must have) or Wants (nice to have)</p>
        </div>

        <div className="items-container">
          {availableItems.map(item => (
            <div
              key={item.id}
              className={`draggable-item ${draggedItem?.id === item.id ? 'dragging' : ''}`}
              draggable
              onDragStart={() => handleDragStart(item)}
              onDragEnd={handleDragEnd}
              onClick={() => handleDragStart(item)}
            >
              <div className="item-emoji">{item.emoji}</div>
              <div className="item-name">{item.name}</div>
            </div>
          ))}
        </div>

        <div className="baskets-container">
          <Card
            className={`basket needs-basket ${draggedItem ? 'drag-target' : ''}`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop('needs')}
            onClick={() => draggedItem && handleDrop('needs')}
          >
            <div className="basket-header">
              <span className="basket-emoji">✅</span>
              <h3>Needs</h3>
            </div>
            <div className="basket-items">
              {needsBasket.map(item => (
                <div key={item.id} className="basket-item">
                  <span className="item-emoji">{item.emoji}</span>
                  <span className="item-name">{item.name}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card
            className={`basket wants-basket ${draggedItem ? 'drag-target' : ''}`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop('wants')}
            onClick={() => draggedItem && handleDrop('wants')}
          >
            <div className="basket-header">
              <span className="basket-emoji">❌</span>
              <h3>Wants</h3>
            </div>
            <div className="basket-items">
              {wantsBasket.map(item => (
                <div key={item.id} className="basket-item">
                  <span className="item-emoji">{item.emoji}</span>
                  <span className="item-name">{item.name}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {availableItems.length === 0 && !showResult && (
          <Button onClick={handleCheck} className="check-button" size="lg">
            Check My Answer
          </Button>
        )}

        {showResult && (
          <div className="result-container">
            {isCorrect() ? (
              <div className="correct-result">
                <div className="result-emoji">⭐</div>
                <h3>Amazing Work!</h3>
                <p>You sorted everything correctly! Understanding needs vs wants is key to smart spending.</p>
                <div className="stars-animation">
                  <span className="star">⭐</span>
                  <span className="star">⭐</span>
                  <span className="star">⭐</span>
                </div>
              </div>
            ) : (
              <div className="wrong-result">
                <div className="result-emoji">😔</div>
                <h3>Almost there!</h3>
                <p>Remember: Needs are things you must have (food, shelter), wants are things you'd like to have.</p>
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
          title="Level 2 Complete!"
          message="You earned 15 coins and 3 stars!"
          onContinue={handleContinue}
        />
      )}
    </div>
  );
}
