import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { GameState, GameStep, VibeId } from '../types';

const defaultGameState: GameState = {
  currentStep: 'intro',
  selectedVibe: null,
  showQuote: false,
  matchaAmount: 0,
  waterAmount: 0,
  waterTemperature: 0,
  isPerfectPour: false,
  whiskIntensity: 0,
  isPerfectWhisk: false,
  serveStyle: 'traditional',
  garnish: 'none',
  background: 'default',
  musicTrack: 'default',
};

type GameContextType = {
  gameState: GameState;
  updateGameState: (updates: Partial<GameState>) => void;
  goToStep: (step: GameStep) => void;
  selectVibe: (vibeId: VibeId) => void;
  resetGame: () => void;
};

const GameContext = createContext<GameContextType | undefined>(undefined);

type GameProviderProps = {
  children: ReactNode;
};

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>(defaultGameState);

  const updateGameState = useCallback((updates: Partial<GameState>) => {
    setGameState(prev => ({
      ...prev,
      ...updates,
    }));
  }, []);

  const goToStep = useCallback((step: GameStep) => {
    updateGameState({ currentStep: step });
  }, [updateGameState]);

  const selectVibe = useCallback((vibeId: VibeId) => {
    setGameState(prev => ({
      ...prev,
      selectedVibe: vibeId,
      showQuote: true,
    }));
    
    setTimeout(() => {
      setGameState(prev => ({
        ...prev,
        showQuote: false,
      }));
      
      setTimeout(() => {
        goToStep('scoop');
      }, 500);
    }, 3000);
  }, [goToStep]);

  const resetGame = useCallback(() => {
    setGameState(defaultGameState);
  }, []);

  const value = {
    gameState,
    updateGameState,
    goToStep,
    selectVibe,
    resetGame,
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = (): GameContextType => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

export default GameContext;
