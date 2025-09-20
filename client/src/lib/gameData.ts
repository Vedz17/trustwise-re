export interface GenericLevelData {
  title: string;
  question: string;
  type: 'multiple-choice' | 'matching' | 'memory' | 'timed';
  correctAnswer: string;
  successMessage: string;
  failMessage: string;
  options?: {
    id: string;
    text: string;
    emoji: string;
  }[];
  matchingPairs?: {
    left: { text: string; emoji: string };
    right: { text: string; emoji: string };
  }[];
  memoryCards?: {
    id: string;
    emoji: string;
  }[];
}

export function getGenericLevelData(level: number): GenericLevelData {
  const levelData: Record<number, GenericLevelData> = {
    5: {
      title: "Level 5: Banking Basics",
      question: "What do you use to get money from a bank machine?",
      type: "multiple-choice",
      correctAnswer: "atm-card",
      successMessage: "Correct! An ATM card helps you get your own money from the bank safely.",
      failMessage: "Try again! Think about what you need to use a bank machine safely.",
      options: [
        { id: "atm-card", text: "ATM Card", emoji: "💳" },
        { id: "phone", text: "Phone Number", emoji: "📱" },
        { id: "password", text: "Just Password", emoji: "🔐" },
        { id: "id-card", text: "ID Card Only", emoji: "🆔" },
      ],
    },
    
    6: {
      title: "Level 6: Investment Basics",
      question: "Which choice can help your money grow over time?",
      type: "multiple-choice",
      correctAnswer: "investment",
      successMessage: "Great! Investing wisely can help your money grow, but always be careful and learn first.",
      failMessage: "Think about what makes money grow over time, not just keeping it safe.",
      options: [
        { id: "investment", text: "Smart Investment", emoji: "📈" },
        { id: "spending", text: "Spending All", emoji: "🛒" },
        { id: "hiding", text: "Hiding Money", emoji: "🏠" },
        { id: "lending", text: "Lending to Anyone", emoji: "🤝" },
      ],
    },
    
    7: {
      title: "Level 7: Budget Planning",
      question: "Match each money activity with the right category:",
      type: "matching",
      correctAnswer: "correct",
      successMessage: "Perfect budgeting! You know how to plan your money well.",
      failMessage: "Try again! Think about which activities help you save vs spend money.",
      matchingPairs: [
        { left: { text: "Salary", emoji: "💵" }, right: { text: "Money In", emoji: "📈" } },
        { left: { text: "Groceries", emoji: "🛒" }, right: { text: "Money Out", emoji: "📉" } },
        { left: { text: "Savings", emoji: "🐷" }, right: { text: "Money Kept", emoji: "💎" } },
      ],
    },
    
    8: {
      title: "Level 8: Emergency Fund",
      question: "Why should you keep some money for emergencies?",
      type: "multiple-choice",
      correctAnswer: "safety",
      successMessage: "Smart thinking! Emergency money helps you when unexpected things happen.",
      failMessage: "Remember, life can surprise us. Having backup money keeps you safe!",
      options: [
        { id: "safety", text: "For Unexpected Problems", emoji: "🆘" },
        { id: "shopping", text: "For Shopping Sprees", emoji: "🛍️" },
        { id: "vacation", text: "For Holidays Only", emoji: "🏖️" },
        { id: "gifts", text: "For Buying Gifts", emoji: "🎁" },
      ],
    },
    
    9: {
      title: "Level 9: Credit Cards",
      question: "What's the most important thing about credit cards?",
      type: "multiple-choice",
      correctAnswer: "payback",
      successMessage: "Excellent! Always remember to pay back credit card money on time to avoid extra charges.",
      failMessage: "Credit cards let you borrow money, but you must pay it back with interest!",
      options: [
        { id: "payback", text: "Pay Back on Time", emoji: "⏰" },
        { id: "maximum", text: "Spend Maximum", emoji: "💸" },
        { id: "minimum", text: "Pay Minimum Only", emoji: "📉" },
        { id: "ignore", text: "Ignore Bills", emoji: "🙈" },
      ],
    },
    
    10: {
      title: "Level 10: Final Challenge",
      question: "What's the key to being good with money?",
      type: "multiple-choice",
      correctAnswer: "balance",
      successMessage: "🏆 CONGRATULATIONS! You've mastered financial literacy! You know the secret to money success.",
      failMessage: "You're almost there! Think about balancing all the good money habits you've learned.",
      options: [
        { id: "balance", text: "Save, Spend Wisely, Learn", emoji: "⚖️" },
        { id: "hoard", text: "Never Spend Anything", emoji: "🔒" },
        { id: "spend", text: "Spend Everything", emoji: "💸" },
        { id: "luck", text: "Just Be Lucky", emoji: "🍀" },
      ],
    },
  };

  return levelData[level] || {
    title: `Level ${level}: Coming Soon`,
    question: "This level is under development!",
    type: "multiple-choice",
    correctAnswer: "wait",
    successMessage: "Thanks for playing! More levels coming soon.",
    failMessage: "This level isn't ready yet.",
    options: [
      { id: "wait", text: "Wait for Update", emoji: "⏳" },
    ],
  };
}
