import { AnimatePresence } from 'framer-motion';
import { ThemeProvider } from './context/ThemeContext';
import { GameProvider, useGame } from './context/GameContext';
import { AudioProvider } from './context/AudioContext';
import CassettePlayer from './components/CassettePlayer';
import IntroStep from './pages/IntroStep';
import VibeSelectionStep from './pages/VibeSelectionStep';
import ScoopStep from './pages/ScoopStep';
import PourStep from './pages/PourStep';
import WhiskStep from './pages/WhiskStep';
import ServeStep from './pages/ServeStep';
import './App.css';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <GameProvider>
        <AudioProvider>
          <AppContent />
        </AudioProvider>
      </GameProvider>
    </ThemeProvider>
  );
};

const AppContent: React.FC = () => {
  const { gameState } = useGame();
  
  const renderStep = () => {
    switch (gameState.currentStep) {
      case 'intro':
        return <IntroStep key="intro" />;
      case 'choose-vibe':
        return <VibeSelectionStep key="choose-vibe" />;
      case 'scoop':
        return <ScoopStep key="scoop" />;
      case 'pour':
        return <PourStep key="pour" />;
      case 'whisk':
        return <WhiskStep key="whisk" />;
      case 'serve':
        return <ServeStep key="serve" />;
      case 'certificate':
        return <div key="certificate">Certificate (Coming Soon)</div>;
      default:
        return <IntroStep key="default-intro" />;
    }
  };
  return (
    <div className="app">
      <AnimatePresence mode="wait">
        {renderStep()}
      </AnimatePresence>
      <CassettePlayer />
      <style>
        {`
          .app {
            min-height: 50vh;
            display: flex;
            flex-direction: column;
            background-color: var(--background-color);
            color: var(--text-color);
            font-family: var(--font-secondary);
            line-height: 1.6;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
        `}
      </style>
    </div>
  );
};

export default App;
