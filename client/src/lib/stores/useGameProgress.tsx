import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { getLocalStorage, setLocalStorage } from "../utils";

interface GameProgress {
  coins: number;
  stars: number;
  completedLevels: number[];
  currentLevel: number;
  ownedItems: string[];
  equippedItems: {
    hat?: string;
    shirt?: string;
    accessory?: string;
  };
  
  // Actions
  addCoins: (amount: number) => void;
  spendCoins: (amount: number) => boolean;
  addStars: (amount: number) => void;
  completeLevel: (level: number, starsEarned: number) => void;
  buyItem: (itemId: string, cost: number) => void;
  equipItem: (itemId: string, type: string) => void;
  resetProgress: () => void;
}

const initialState = {
  coins: 0,
  stars: 0,
  completedLevels: [],
  currentLevel: 1,
  ownedItems: [],
  equippedItems: {},
};

export const useGameProgress = create<GameProgress>()(
  subscribeWithSelector((set, get) => ({
    ...initialState,
    ...getLocalStorage('gameProgress'),
    
    addCoins: (amount) => {
      set((state) => {
        const newState = { coins: state.coins + amount };
        setLocalStorage('gameProgress', { ...state, ...newState });
        return newState;
      });
    },
    
    spendCoins: (amount) => {
      const state = get();
      if (state.coins >= amount) {
        set((currentState) => {
          const newState = { coins: currentState.coins - amount };
          setLocalStorage('gameProgress', { ...currentState, ...newState });
          return newState;
        });
        return true;
      }
      return false;
    },
    
    addStars: (amount) => {
      set((state) => {
        const newState = { stars: state.stars + amount };
        setLocalStorage('gameProgress', { ...state, ...newState });
        return newState;
      });
    },
    
    completeLevel: (level, starsEarned) => {
      set((state) => {
        const newCompletedLevels = state.completedLevels.includes(level) 
          ? state.completedLevels 
          : [...state.completedLevels, level];
        
        const coinsEarned = level * 5 + 10; // Base formula for coin rewards
        
        const newState = {
          completedLevels: newCompletedLevels,
          stars: state.stars + starsEarned,
          coins: state.coins + coinsEarned,
          currentLevel: Math.max(state.currentLevel, level + 1),
        };
        
        setLocalStorage('gameProgress', { ...state, ...newState });
        return newState;
      });
    },
    
    buyItem: (itemId, cost) => {
      const state = get();
      if (state.coins >= cost && !state.ownedItems.includes(itemId)) {
        set((currentState) => {
          const newState = {
            coins: currentState.coins - cost,
            ownedItems: [...currentState.ownedItems, itemId],
          };
          setLocalStorage('gameProgress', { ...currentState, ...newState });
          return newState;
        });
      }
    },
    
    equipItem: (itemId, type) => {
      set((state) => {
        const newEquippedItems = {
          ...state.equippedItems,
          [type]: itemId,
        };
        const newState = { equippedItems: newEquippedItems };
        setLocalStorage('gameProgress', { ...state, ...newState });
        return newState;
      });
    },
    
    resetProgress: () => {
      set(() => {
        setLocalStorage('gameProgress', initialState);
        return initialState;
      });
    },
  }))
);
