import { useState, useEffect } from "react";
import { Button } from "../../ui/button";
import { Card } from "../../ui/card";
import { ArrowLeft, Home, ShoppingCart, PiggyBank, AlertTriangle } from "lucide-react";
import { useGameProgress } from "../../../lib/stores/useGameProgress";

interface FestivalBudgetingProps {
  onComplete: () => void;
  onBack: () => void;
}

interface BudgetCategory {
  id: string;
  name: string;
  icon: JSX.Element;
  allocated: number;
  minimum: number;
  color: string;
}

interface SurpriseExpense {
  id: string;
  description: string;
  amount: number;
  category: string;
  isActive: boolean;
}

export function FestivalBudgeting({ onComplete, onBack }: FestivalBudgetingProps) {
  const { completeChallenge } = useGameProgress();
  
  const [monthlyIncome] = useState(25000); // Fixed income for the challenge
  const [timer, setTimer] = useState(900); // 15 minutes
  const [currentPhase, setCurrentPhase] = useState<'planning' | 'surprises' | 'results'>('planning');
  const [score, setScore] = useState(0);
  
  const [categories, setCategories] = useState<BudgetCategory[]>([
    {
      id: 'festival',
      name: 'Festival Expenses',
      icon: <Home className="w-6 h-6" />,
      allocated: 0,
      minimum: 3000,
      color: 'bg-orange-100 border-orange-300'
    },
    {
      id: 'essentials',
      name: 'Essential Expenses',
      icon: <ShoppingCart className="w-6 h-6" />,
      allocated: 0,
      minimum: 12000,
      color: 'bg-blue-100 border-blue-300'
    },
    {
      id: 'savings',
      name: 'Savings',
      icon: <PiggyBank className="w-6 h-6" />,
      allocated: 0,
      minimum: 2500,
      color: 'bg-green-100 border-green-300'
    }
  ]);
  
  const [surpriseExpenses, setSurpriseExpenses] = useState<SurpriseExpense[]>([
    {
      id: 'medical',
      description: 'Unexpected medical expense for family member',
      amount: 4000,
      category: 'essentials',
      isActive: false
    },
    {
      id: 'gift',
      description: 'Last-minute gift for relative\'s wedding',
      amount: 2000,
      category: 'festival',
      isActive: false
    },
    {
      id: 'appliance',
      description: 'Refrigerator repair needed urgently',
      amount: 1500,
      category: 'essentials',
      isActive: false
    }
  ]);
  
  const [activeSurprise, setActiveSurprise] = useState<SurpriseExpense | null>(null);
  const [completedSurprises, setCompletedSurprises] = useState<string[]>([]);
  
  // Timer countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Surprise expense triggers
  useEffect(() => {
    if (currentPhase === 'surprises' && !activeSurprise) {
      const availableSurprises = surpriseExpenses.filter(s => !completedSurprises.includes(s.id));
      if (availableSurprises.length > 0) {
        // Trigger a random surprise after 5-10 seconds
        const delay = Math.random() * 5000 + 5000;
        setTimeout(() => {
          const randomSurprise = availableSurprises[Math.floor(Math.random() * availableSurprises.length)];
          setActiveSurprise(randomSurprise);
        }, delay);
      } else {
        // All surprises handled, move to results
        setTimeout(() => setCurrentPhase('results'), 2000);
      }
    }
  }, [currentPhase, activeSurprise, surpriseExpenses, completedSurprises]);
  
  const totalAllocated = categories.reduce((sum, cat) => sum + cat.allocated, 0);
  const remainingBudget = monthlyIncome - totalAllocated;
  
  const updateAllocation = (categoryId: string, amount: number) => {
    setCategories(prev => prev.map(cat => 
      cat.id === categoryId ? { ...cat, allocated: Math.max(0, amount) } : cat
    ));
  };
  
  const handleQuickAllocation = (percentage: number) => {
    const amount = Math.floor(monthlyIncome * percentage / 100);
    setCategories(prev => prev.map(cat => {
      if (cat.id === 'essentials') return { ...cat, allocated: Math.max(cat.minimum, amount * 0.5) };
      if (cat.id === 'festival') return { ...cat, allocated: Math.max(cat.minimum, amount * 0.3) };
      if (cat.id === 'savings') return { ...cat, allocated: Math.max(cat.minimum, amount * 0.2) };
      return cat;
    }));
  };
  
  const handleSurpriseResponse = (response: 'useReserved' | 'cutOther' | 'skipExpense') => {
    if (!activeSurprise) return;
    
    let scoreChange = 0;
    
    switch (response) {
      case 'useReserved':
        // Use emergency fund/savings
        if (categories.find(c => c.id === 'savings')!.allocated >= activeSurprise.amount) {
          updateAllocation('savings', categories.find(c => c.id === 'savings')!.allocated - activeSurprise.amount);
          scoreChange = 10; // Good financial decision
        } else {
          scoreChange = -5; // Insufficient reserves
        }
        break;
        
      case 'cutOther':
        // Cut from other categories
        const otherCats = categories.filter(c => c.id !== activeSurprise.category);
        const totalOtherAllocated = otherCats.reduce((sum, cat) => sum + cat.allocated, 0);
        if (totalOtherAllocated >= activeSurprise.amount) {
          // Proportionally reduce other categories
          setCategories(prev => prev.map(cat => {
            if (cat.id === activeSurprise.category) return cat;
            const reduction = (cat.allocated / totalOtherAllocated) * activeSurprise.amount;
            return { ...cat, allocated: Math.max(cat.minimum, cat.allocated - reduction) };
          }));
          scoreChange = 5; // Okay decision
        } else {
          scoreChange = -3; // Not enough to cut
        }
        break;
        
      case 'skipExpense':
        // Skip the expense entirely
        scoreChange = activeSurprise.category === 'essentials' ? -10 : -2;
        break;
    }
    
    setScore(prev => prev + scoreChange);
    setCompletedSurprises(prev => [...prev, activeSurprise.id]);
    setActiveSurprise(null);
  };
  
  const startSurprisePhase = () => {
    // Check if basic allocation is reasonable
    let initialScore = 0;
    categories.forEach(cat => {
      if (cat.allocated >= cat.minimum) {
        initialScore += 10;
      } else {
        initialScore -= 5;
      }
    });
    
    if (remainingBudget >= 0) initialScore += 20;
    else initialScore -= 30;
    
    setScore(initialScore);
    setCurrentPhase('surprises');
  };
  
  const handleTimeUp = () => {
    if (currentPhase !== 'results') {
      setCurrentPhase('results');
    }
  };
  
  const calculateFinalScore = () => {
    let finalScore = score;
    
    // Bonus for staying within budget
    if (remainingBudget >= 0) finalScore += 20;
    
    // Bonus for meeting minimums
    categories.forEach(cat => {
      if (cat.allocated >= cat.minimum) finalScore += 10;
    });
    
    // Bonus for savings allocation
    const savingsRatio = categories.find(c => c.id === 'savings')!.allocated / monthlyIncome;
    if (savingsRatio >= 0.2) finalScore += 30;
    else if (savingsRatio >= 0.1) finalScore += 15;
    
    return Math.max(0, finalScore);
  };
  
  const handleComplete = () => {
    const finalScore = calculateFinalScore();
    const rewards = {
      coins: Math.floor(finalScore * 2),
      trustTokens: Math.floor(finalScore / 10),
      badge: finalScore >= 80 ? 'Smart Saver' : undefined
    };
    
    completeChallenge(1, rewards);
    onComplete();
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="challenge-container">
      <div className="challenge-header">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="back-button"
        >
          <ArrowLeft size={20} />
          Back
        </Button>
        
        <div className="challenge-title-section">
          <h1 className="challenge-title">Festival Budgeting Challenge</h1>
          <p className="challenge-description">
            Allocate your ₹{monthlyIncome.toLocaleString()} monthly income wisely for the festival season
          </p>
        </div>
        
        <div className="timer-display">
          <span className="timer-text">⏱️ {formatTime(timer)}</span>
        </div>
      </div>
      
      {currentPhase === 'planning' && (
        <div className="planning-phase">
          <div className="budget-overview">
            <Card className="budget-summary">
              <h3>Monthly Income: ₹{monthlyIncome.toLocaleString()}</h3>
              <p>Allocated: ₹{totalAllocated.toLocaleString()}</p>
              <p className={remainingBudget >= 0 ? 'text-green-600' : 'text-red-600'}>
                Remaining: ₹{remainingBudget.toLocaleString()}
              </p>
            </Card>
            
            <div className="quick-allocation">
              <h4>Quick Allocation Templates:</h4>
              <div className="template-buttons">
                <Button onClick={() => handleQuickAllocation(80)} size="sm">Conservative (80%)</Button>
                <Button onClick={() => handleQuickAllocation(90)} size="sm">Balanced (90%)</Button>
                <Button onClick={() => handleQuickAllocation(95)} size="sm">Aggressive (95%)</Button>
              </div>
            </div>
          </div>
          
          <div className="budget-categories">
            {categories.map(category => (
              <Card key={category.id} className={`category-card ${category.color}`}>
                <div className="category-header">
                  {category.icon}
                  <h3>{category.name}</h3>
                  <span className="minimum-text">Min: ₹{category.minimum.toLocaleString()}</span>
                </div>
                
                <div className="allocation-controls">
                  <input
                    type="range"
                    min="0"
                    max={monthlyIncome}
                    step="500"
                    value={category.allocated}
                    onChange={(e) => updateAllocation(category.id, parseInt(e.target.value))}
                    className="allocation-slider"
                  />
                  <input
                    type="number"
                    value={category.allocated}
                    onChange={(e) => updateAllocation(category.id, parseInt(e.target.value) || 0)}
                    className="allocation-input"
                  />
                </div>
                
                <div className="allocation-status">
                  {category.allocated >= category.minimum ? (
                    <span className="text-green-600">✓ Above minimum</span>
                  ) : (
                    <span className="text-red-600">⚠ Below minimum</span>
                  )}
                </div>
              </Card>
            ))}
          </div>
          
          <Button 
            onClick={startSurprisePhase}
            disabled={remainingBudget < 0 || categories.some(cat => cat.allocated < cat.minimum)}
            className="start-surprises-button"
            size="lg"
          >
            Start Festival Season (Surprises Await!)
          </Button>
        </div>
      )}
      
      {currentPhase === 'surprises' && (
        <div className="surprises-phase">
          <div className="current-budget">
            {categories.map(cat => (
              <Card key={cat.id} className="budget-display">
                <span>{cat.name}: ₹{cat.allocated.toLocaleString()}</span>
              </Card>
            ))}
          </div>
          
          {activeSurprise ? (
            <Card className="surprise-popup">
              <div className="surprise-header">
                <AlertTriangle className="text-orange-500" size={32} />
                <h3>Surprise Expense!</h3>
              </div>
              
              <p className="surprise-description">{activeSurprise.description}</p>
              <p className="surprise-amount">Amount: ₹{activeSurprise.amount.toLocaleString()}</p>
              
              <div className="surprise-options">
                <Button 
                  onClick={() => handleSurpriseResponse('useReserved')}
                  className="option-button"
                >
                  Use Emergency Savings
                </Button>
                <Button 
                  onClick={() => handleSurpriseResponse('cutOther')}
                  className="option-button"
                >
                  Cut Other Expenses
                </Button>
                <Button 
                  onClick={() => handleSurpriseResponse('skipExpense')}
                  className="option-button"
                  variant="outline"
                >
                  Skip This Expense
                </Button>
              </div>
            </Card>
          ) : (
            <div className="waiting-surprise">
              <p>Managing your festival budget... Surprise expenses may occur!</p>
              <div className="score-display">Current Score: {score}</div>
            </div>
          )}
        </div>
      )}
      
      {currentPhase === 'results' && (
        <div className="results-phase">
          <Card className="results-card">
            <h2>Festival Budgeting Complete!</h2>
            
            <div className="final-score">
              <h3>Final Score: {calculateFinalScore()}/100</h3>
            </div>
            
            <div className="budget-breakdown">
              <h4>Final Budget Allocation:</h4>
              {categories.map(cat => (
                <div key={cat.id} className="final-category">
                  <span>{cat.name}: ₹{cat.allocated.toLocaleString()}</span>
                  <span className={cat.allocated >= cat.minimum ? 'text-green-600' : 'text-red-600'}>
                    {cat.allocated >= cat.minimum ? '✓' : '⚠'}
                  </span>
                </div>
              ))}
            </div>
            
            <div className="rewards-preview">
              <h4>Rewards Earned:</h4>
              <p>🪙 Coins: {Math.floor(calculateFinalScore() * 2)}</p>
              <p>🛡️ Trust Tokens: {Math.floor(calculateFinalScore() / 10)}</p>
              {calculateFinalScore() >= 80 && <p>🏆 Badge: Smart Saver</p>}
            </div>
            
            <Button onClick={handleComplete} size="lg" className="complete-button">
              Complete Challenge
            </Button>
          </Card>
        </div>
      )}
    </div>
  );
}