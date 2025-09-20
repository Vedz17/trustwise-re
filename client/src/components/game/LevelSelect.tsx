import { useState } from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Star, Play, TrendingUp, Shield, Coins, Home, DollarSign, AlertTriangle } from "lucide-react";

interface Challenge {
  id: number;
  title: string;
  description: string;
  icon: JSX.Element;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedTime: string;
  rewards: {
    coins: number;
    trustTokens: number;
    badge?: string;
  };
}

interface ChallengeSelectProps {
  completedChallenges: number[];
  onChallengeSelect: (challengeId: number) => void;
}

export function LevelSelect({ completedChallenges, onChallengeSelect }: ChallengeSelectProps) {
  const [selectedChallenge, setSelectedChallenge] = useState<number | null>(null);

  const challenges: Challenge[] = [
    {
      id: 1,
      title: "Festival Budgeting",
      description: "Allocate your income to expenses & savings while handling surprise costs during festival season.",
      icon: <Home className="w-8 h-8" />,
      difficulty: 'Beginner',
      estimatedTime: '10-15 min',
      rewards: { coins: 100, trustTokens: 5, badge: 'Smart Saver' }
    },
    {
      id: 2, 
      title: "Loan Repayment Strategy",
      description: "Choose the right loans and manage EMI payments while handling delays and penalties.",
      icon: <DollarSign className="w-8 h-8" />,
      difficulty: 'Intermediate',
      estimatedTime: '15-20 min',
      rewards: { coins: 150, trustTokens: 8, badge: 'Debt Master' }
    },
    {
      id: 3,
      title: "SIP & Mutual Fund Investment",
      description: "Allocate ₹5,000 across different funds and navigate market fluctuations to maximize returns.",
      icon: <TrendingUp className="w-8 h-8" />,
      difficulty: 'Advanced',
      estimatedTime: '20-25 min',
      rewards: { coins: 200, trustTokens: 12, badge: 'Investment Pro' }
    },
    {
      id: 4,
      title: "Gold & Commodities Trading",
      description: "Balance your portfolio between gold, commodities, and cash while managing price volatility.",
      icon: <Coins className="w-8 h-8" />,
      difficulty: 'Advanced',
      estimatedTime: '18-22 min',
      rewards: { coins: 180, trustTokens: 10 }
    },
    {
      id: 5,
      title: "Emergency Fund Management",
      description: "Handle medical and crop emergencies by deciding between savings, insurance, or emergency loans.",
      icon: <AlertTriangle className="w-8 h-8" />,
      difficulty: 'Intermediate',
      estimatedTime: '12-18 min',
      rewards: { coins: 120, trustTokens: 7, badge: 'Crisis Manager' }
    },
    {
      id: 6,
      title: "Scam Awareness Training",
      description: "Identify and avoid real-life financial scams through interactive scenarios and pop-ups.",
      icon: <Shield className="w-8 h-8" />,
      difficulty: 'Beginner',
      estimatedTime: '8-12 min',
      rewards: { coins: 80, trustTokens: 6 }
    }
  ];

  const isChallengeCompleted = (challengeId: number) => {
    return completedChallenges.includes(challengeId);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-600 bg-green-100';
      case 'Intermediate': return 'text-orange-600 bg-orange-100';
      case 'Advanced': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="challenge-select">
      <div className="challenge-select-header">
        <h1 className="game-title">Financial Quest</h1>
        <p className="game-subtitle">Challenge Mode</p>
        <p className="challenge-subtitle">Choose any challenge to improve your financial skills</p>
      </div>

      <div className="challenges-grid">
        {challenges.map((challenge) => {
          const isCompleted = isChallengeCompleted(challenge.id);
          const isSelected = selectedChallenge === challenge.id;

          return (
            <Card 
              key={challenge.id}
              className={`challenge-card ${isSelected ? 'selected' : ''} ${isCompleted ? 'completed' : ''}`}
              onClick={() => setSelectedChallenge(challenge.id)}
            >
              <div className="challenge-icon">
                {challenge.icon}
              </div>
              
              <div className="challenge-info">
                <h3 className="challenge-title">{challenge.title}</h3>
                <p className="challenge-description">{challenge.description}</p>
                
                <div className="challenge-meta">
                  <span className={`difficulty-badge ${getDifficultyColor(challenge.difficulty)}`}>
                    {challenge.difficulty}
                  </span>
                  <span className="time-estimate">⏱️ {challenge.estimatedTime}</span>
                </div>
                
                <div className="challenge-rewards">
                  <span className="reward-item">🪙 {challenge.rewards.coins}</span>
                  <span className="reward-item">🛡️ {challenge.rewards.trustTokens}</span>
                  {challenge.rewards.badge && (
                    <span className="reward-badge">🏆 {challenge.rewards.badge}</span>
                  )}
                </div>
                
                {isCompleted && (
                  <div className="completion-status">
                    <Star className="completion-star" size={20} />
                    <span>Completed</span>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {selectedChallenge && (
        <div className="challenge-action">
          <Button 
            onClick={() => onChallengeSelect(selectedChallenge)}
            className="start-challenge-button"
            size="lg"
          >
            <Play size={20} />
            Start Challenge
          </Button>
        </div>
      )}
    </div>
  );
}
