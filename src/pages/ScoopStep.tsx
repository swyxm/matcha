import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../context/GameContext';
import StepLayout from '../components/layout/StepLayout';
import { useTheme } from '../context/ThemeContext';

const ScoopStep: React.FC = () => {
  const { updateGameState, goToStep } = useGame();
  const theme = useTheme();
  const [scoopAmount, setScoopAmount] = useState(0);
  const [isScooping, setIsScooping] = useState(false);
  const [showPhilosophy, setShowPhilosophy] = useState(false);
  
  const philosophyQuotes = [
    "This teaspoon holds more than tea. It holds restraint.",
    "The measure of a man is in his patience, not his portion.",
    "A single gram can tip the scales of perfection.",
    "Precision is the language of the enlightened.",
    "Too much, and you're a glutton. Too little, and you're a miser.",
  ];
  
  const [currentQuote, setCurrentQuote] = useState(philosophyQuotes[0]);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPhilosophy(true);
      const quoteInterval = setInterval(() => {
        setCurrentQuote(prevQuote => {
          const currentIndex = philosophyQuotes.indexOf(prevQuote);
          const nextIndex = (currentIndex + 1) % philosophyQuotes.length;
          return philosophyQuotes[nextIndex];
        });
      }, 5000);
      
      return () => clearInterval(quoteInterval);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleScoop = () => {
    if (scoopAmount >= 100) return;
    
    setIsScooping(true);
    setScoopAmount(prev => Math.min(prev + 10, 100));
    
    setTimeout(() => {
      setIsScooping(false);
      updateGameState({ matchaAmount: scoopAmount + 10 });
      if (scoopAmount >= 90) {
        setTimeout(() => goToStep('pour'), 1000);
      }
    }, 500);
  };
  
  const handleReset = () => {
    setScoopAmount(0);
    updateGameState({ matchaAmount: 0 });
  };
  
  return (
    <StepLayout>
      <div className="scoop-container">
        <h2>The Art of the Scoop</h2>
        <p className="instruction">Measure the perfect amount of matcha powder</p>
        
        <div className="scoop-visual">
          <div 
            className="matcha-powder" 
            style={{ height: `${scoopAmount}%` }}
          ></div>
          
          <motion.div 
            className="scoop-tool"
            animate={isScooping ? 'scooping' : 'idle'}
            variants={{
              idle: { y: 0, rotate: 0 },
              scooping: { 
                y: [0, 30, 0], 
                rotate: [0, 5, -5, 0],
                transition: { duration: 0.5 }
              }
            }}
            onClick={handleScoop}
          >
            <span className="scoop-handle"></span>
            <span className="scoop-bowl"></span>
          </motion.div>
          
          <div className="measurement">
            <span className="measurement-value">{scoopAmount}g</span>
            <span className="measurement-label">Matcha Powder</span>
          </div>
        </div>
        
        <div className="scoop-controls">
          <button 
            className="reset-button"
            onClick={handleReset}
            disabled={scoopAmount === 0}
          >
            Start Over
          </button>
          
          <button 
            className="next-button"
            onClick={() => goToStep('pour')}
            disabled={scoopAmount === 0}
          >
            Continue to Pour
          </button>
        </div>
        
        <AnimatePresence>
          {showPhilosophy && (
            <motion.div 
              className="philosophy-overlay"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: 0.5 }}
            >
              <p className="philosophy-text">{currentQuote}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>
        {`
        .scoop-container {
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
        
        .scoop-visual {
          position: relative;
          width: 200px;
          height: 300px;
          margin: 0 auto ${theme.spacing.xl};
          background: #f5f5f5;
          border-radius: 100px 100px 0 0;
          overflow: hidden;
          box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.1);
        }
        
        .matcha-powder {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          background: #8b9e70;
          background: linear-gradient(to top, #6b7f54, #9aaf82);
          transition: height 0.5s ease-out;
          border-radius: 0 0 100px 100px;
        }
        
        .scoop-tool {
          position: absolute;
          top: 40%;
          left: 50%;
          transform: translateX(-50%);
          cursor: pointer;
          z-index: 2;
        }
        
        .scoop-handle {
          display: block;
          width: 8px;
          height: 80px;
          background: #d4a76a;
          margin: 0 auto;
          border-radius: 4px;
        }
        
        .scoop-bowl {
          display: block;
          width: 60px;
          height: 20px;
          background: #e0c9a6;
          border-radius: 0 0 30px 30px;
          position: relative;
          top: -5px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }
        
        .measurement {
          position: absolute;
          bottom: ${theme.spacing.lg};
          left: 0;
          right: 0;
          text-align: center;
          color: white;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
          z-index: 1;
        }
        
        .measurement-value {
          display: block;
          font-size: ${theme.typography.fontSize['2xl']};
          font-weight: ${theme.typography.fontWeight.bold};
          line-height: 1;
          margin-bottom: ${theme.spacing.xs};
        }
        
        .measurement-label {
          font-size: ${theme.typography.fontSize.sm};
          opacity: 0.9;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        
        .scoop-controls {
          display: flex;
          justify-content: center;
          gap: ${theme.spacing.md};
          margin-top: ${theme.spacing.xl};
        }
        
        .reset-button,
        .next-button {
          padding: ${theme.spacing.sm} ${theme.spacing.lg};
          border-radius: ${theme.borderRadius.sm};
          font-size: ${theme.typography.fontSize.base};
          font-weight: ${theme.typography.fontWeight.medium};
          cursor: pointer;
          transition: ${theme.transitions.default};
        }
        
        .reset-button {
          background: transparent;
          border: 1px solid ${theme.colors.border};
          color: ${theme.colors.text};
        }
        
        .reset-button:hover:not(:disabled) {
          background: #f5f5f5;
          border-color: ${theme.colors.primary};
          color: ${theme.colors.primary};
        }
        
        .next-button {
          background: ${theme.colors.primary};
          border: 1px solid ${theme.colors.primary};
          color: white;
        }
        
        .next-button:hover:not(:disabled) {
          background: ${theme.colors.accent};
          border-color: ${theme.colors.accent};
          transform: translateY(-2px);
          box-shadow: ${theme.shadows.md};
        }
        
        .next-button:disabled,
        .reset-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .philosophy-overlay {
          margin-top: ${theme.spacing.xl};
          padding: ${theme.spacing.lg};
          background: rgba(255, 255, 255, 0.9);
          border-left: 4px solid ${theme.colors.primary};
          text-align: center;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }
        
        .philosophy-text {
          font-style: italic;
          font-size: ${theme.typography.fontSize.lg};
          color: ${theme.colors.text};
          margin: 0;
          line-height: 1.6;
        }
        
        @media (max-width: 768px) {
          .scoop-visual {
            width: 160px;
            height: 240px;
          }
          
          h2 {
            font-size: ${theme.typography.fontSize['2xl']};
          }
          
          .scoop-controls {
            flex-direction: column;
            gap: ${theme.spacing.sm};
          }
          
          .reset-button,
          .next-button {
            width: 100%;
          }
        }
        `}
      </style>
    </StepLayout>
  );
};

export default ScoopStep;
