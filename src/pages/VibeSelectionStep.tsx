import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../context/GameContext';
import StepLayout from '../components/layout/StepLayout';
import { useTheme } from '../context/ThemeContext';
import type { Vibe } from '../types';

const VIBES: Vibe[] = [
  {
    id: 'philosopher',
    name: "The Philosopher's Cup",
    description: 'For those who contemplate the void between sips.',
    quote: 'Do not choose your drink. Let your drink choose you.',
    color: '#2c5f2d',
    icon: '☯️'
  },
  {
    id: 'poet',
    name: "The Urban Poet's Fuel",
    description: 'For verses that flow like a perfectly steeped brew.',
    quote: 'In the steam rises the soul of the city.',
    color: '#4a6fa5',
    icon: '✍️'
  },
  {
    id: 'nomad',
    name: "The Wandering Nomad's Elixir",
    description: 'For those who find home in the journey, not the destination.',
    quote: 'Not all who wander are lost, but your matcha might be.',
    color: '#8b5a2b',
    icon: '🌍'
  }
];

const VibeSelectionStep: React.FC = () => {
  const { gameState, selectVibe } = useGame();
  const theme = useTheme();

  return (
    <StepLayout>
      <div className="vibe-selection">
        <h2>Choose Your Vibe</h2>
        <p className="instruction">Select your matcha preparation style...</p>
        
        <div className="vibe-grid">
          {VIBES.map((vibe) => (
            <motion.div
              key={vibe.id}
              className={`vibe-card ${gameState.selectedVibe === vibe.id ? 'selected' : ''}`}
              onClick={() => selectVibe(vibe.id)}
              whileHover={{ y: -5, boxShadow: theme.shadows.md }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="vibe-icon" style={{ color: vibe.color }}>
                {vibe.icon}
              </div>
              <h3>{vibe.name}</h3>
              <p className="vibe-description">{vibe.description}</p>
            </motion.div>
          ))}
        </div>
        
        <AnimatePresence>
          {gameState.showQuote && gameState.selectedVibe && (
            <motion.div
              className="quote-overlay"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <p className="quote-text">
                "{VIBES.find(v => v.id === gameState.selectedVibe)?.quote}"
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>
        {`
        .vibe-selection {
          text-align: center;
        }
        
        h2 {
          font-size: ${theme.typography.fontSize['3xl']};
          margin-bottom: ${theme.spacing.sm};
          color: ${theme.colors.primary};
        }
        
        .instruction {
          color: ${theme.colors.lightText};
          margin-bottom: ${theme.spacing.xl};
          font-size: ${theme.typography.fontSize.lg};
        }
        
        .vibe-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: ${theme.spacing.lg};
          margin: ${theme.spacing.xl} 0;
        }
        
        .vibe-card {
          background: white;
          border: 1px solid ${theme.colors.border};
          border-radius: ${theme.borderRadius.md};
          padding: ${theme.spacing.lg};
          cursor: pointer;
          transition: ${theme.transitions.default};
          position: relative;
          overflow: hidden;
        }
        
        .vibe-card::before {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 4px;
          background: ${theme.colors.primary};
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.3s ease;
        }
        
        .vibe-card:hover {
          transform: translateY(-5px);
          box-shadow: ${theme.shadows.md};
        }
        
        .vibe-card:hover::before {
          transform: scaleX(1);
        }
        
        .vibe-card.selected {
          border-color: ${theme.colors.primary};
          background-color: rgba(44, 95, 45, 0.05);
        }
        
        .vibe-card.selected::before {
          transform: scaleX(1);
        }
        
        .vibe-icon {
          font-size: 2.5rem;
          margin-bottom: ${theme.spacing.md};
        }
        
        .vibe-card h3 {
          font-size: ${theme.typography.fontSize.xl};
          margin-bottom: ${theme.spacing.sm};
          color: ${theme.colors.primary};
        }
        
        .vibe-description {
          color: ${theme.colors.text};
          font-size: ${theme.typography.fontSize.base};
          margin: 0;
          line-height: 1.6;
        }
        
        .quote-overlay {
          margin-top: ${theme.spacing.xl};
          padding: ${theme.spacing.lg};
          background: rgba(255, 255, 255, 0.9);
          border-left: 4px solid ${theme.colors.primary};
          text-align: center;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }
        
        .quote-text {
          font-style: italic;
          font-size: ${theme.typography.fontSize.lg};
          color: ${theme.colors.text};
          margin: 0;
          line-height: 1.6;
        }
        
        @media (max-width: 768px) {
          .vibe-grid {
            grid-template-columns: 1fr;
          }
          
          h2 {
            font-size: ${theme.typography.fontSize['2xl']};
          }
        }
        `}
      </style>
    </StepLayout>
  );
};

export default VibeSelectionStep;
