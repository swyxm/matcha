import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../context/GameContext';
import StepLayout from '../components/layout/StepLayout';
import { useTheme } from '../context/ThemeContext';

const SERVE_STYLES = [
  {
    id: 'traditional',
    name: 'Traditional',
    description: 'Served in a classic chawan with no frills',
    icon: '🍵'
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Sleek presentation with latte art',
    icon: '☕'
  },
  {
    id: 'ceremonial',
    name: 'Ceremonial',
    description: 'Full traditional presentation with chasen and chashaku',
    icon: '🎎'
  }
];

const GARNISH_OPTIONS = [
  { id: 'none', name: 'None', emoji: '' },
  { id: 'mint', name: 'Mint Leaf', emoji: '🌿' },
  { id: 'flower', name: 'Edible Flower', emoji: '🌸' },
  { id: 'cinnamon', name: 'Cinnamon', emoji: '🌡️' },
  { id: 'whipped-cream', name: 'Whipped Cream', emoji: '🥛' }
];

const ServeStep: React.FC = () => {
  const { gameState, updateGameState, goToStep } = useGame();
  const theme = useTheme();
  const [selectedStyle, setSelectedStyle] = useState(gameState.serveStyle || 'traditional');
  const [selectedGarnish, setSelectedGarnish] = useState(gameState.garnish || 'none');
  const [showFinal, setShowFinal] = useState(false);
  const [showCertificateButton, setShowCertificateButton] = useState(false);

  // Auto-select first style if none selected
  useEffect(() => {
    if (!gameState.serveStyle) {
      updateGameState({ serveStyle: 'traditional' });
    }
  }, [gameState.serveStyle, updateGameState]);

  const handleStyleSelect = (styleId: string) => {
    setSelectedStyle(styleId);
    updateGameState({ serveStyle: styleId });
  };

  const handleGarnishSelect = (garnishId: string) => {
    setSelectedGarnish(garnishId);
    updateGameState({ garnish: garnishId });
  };

  const handleServe = () => {
    setShowFinal(true);
    // Show certificate button after a delay
    setTimeout(() => setShowCertificateButton(true), 1500);
  };

  const getMatchaColor = () => {
    const intensity = gameState.whiskIntensity / 100;
    const baseColor = [57, 96, 60]; 
    const lightened = baseColor.map(c => Math.min(255, c + (255 - c) * (1 - intensity) * 0.7));
    return `rgba(${lightened[0]}, ${lightened[1]}, ${lightened[2]}, 0.9)`;
  };

  const getFoamAmount = () => {
    return Math.min(100, 20 + (gameState.whiskIntensity * 0.8));
  };

  if (showFinal) {
    const garnish = GARNISH_OPTIONS.find(g => g.id === selectedGarnish);
    const style = SERVE_STYLES.find(s => s.id === selectedStyle);
    
    return (
      <StepLayout>
        <div className="serve-final-container">
          <h2>Your Matcha Masterpiece</h2>
          <p className="subtitle">Served with {style?.name.toLowerCase()} elegance</p>
          
          <div className="matcha-presentation">
            <div className="matcha-cup">
              <div 
                className="matcha-liquid"
                style={{
                  backgroundColor: getMatchaColor(),
                  height: '100%',
                  width: '100%',
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: selectedStyle === 'modern' ? '50% 50% 0 0' : '50% 50% 50% 50% / 60% 60% 40% 40%',
                }}
              >
                <div 
                  className="matcha-foam"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: `${getFoamAmount()}%`,
                    background: 'rgba(255, 255, 255, 0.3)',
                    borderBottom: '2px solid rgba(255, 255, 255, 0.5)',
                    borderRadius: selectedStyle === 'modern' ? '50% 50% 0 0' : '50% 50% 50% 50% / 60% 60% 0 0',
                    transition: 'all 0.5s ease'
                  }}
                >
                  {selectedStyle === 'modern' && (
                    <div className="latte-art">
                      <div className="latte-heart">❤️</div>
                    </div>
                  )}
                </div>
                
                {garnish && garnish.id !== 'none' && (
                  <div 
                    className="garnish"
                    style={{
                      position: 'absolute',
                      top: '20%',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      fontSize: '2rem',
                      zIndex: 10
                    }}
                  >
                    {garnish.emoji}
                  </div>
                )}
              </div>
            </div>
            
            <div className="serve-details">
              <h3>Matcha Details</h3>
              <ul>
                <li>Strength: {gameState.matchaAmount > 50 ? 'Strong' : 'Mild'}</li>
                <li>Temperature: {gameState.waterTemperature > 80 ? 'Hot' : 'Warm'}</li>
                <li>Foam: {gameState.whiskIntensity > 70 ? 'Frothy' : 'Smooth'}</li>
                <li>Style: {style?.name}</li>
                <li>Garnish: {garnish?.name || 'None'}</li>
              </ul>
              
              <AnimatePresence>
                {showCertificateButton && (
                  <motion.button
                    className="certificate-button"
                    onClick={() => goToStep('certificate')}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    Get Your Certificate
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <style jsx>{`
          .serve-final-container {
            text-align: center;
            padding: ${theme.spacing.xl} 0;
          }
          
          h2 {
            font-size: ${theme.typography.fontSize['3xl']};
            margin-bottom: ${theme.spacing.xs};
            color: ${theme.colors.primary};
          }
          
          .subtitle {
            color: ${theme.colors.lightText};
            margin-bottom: ${theme.spacing.xl};
            font-size: ${theme.typography.fontSize.lg};
          }
          
          .matcha-presentation {
            display: flex;
            flex-direction: row;
            align-items: flex-start;
            justify-content: space-between;
            gap: ${theme.spacing.xl};
            margin: 0;
            width: 100%;
          }
          
          .matcha-cup {
            width: 200px;
            height: 200px;
            background: rgba(255, 255, 255, 0.8);
            border-radius: 50%;
            padding: 20px;
            box-shadow: ${theme.shadows.lg};
            position: relative;
          }
          
          .serve-details {
            background: ${theme.colors.background};
            border-radius: ${theme.borderRadius.lg};
            padding: ${theme.spacing.xl};
            box-shadow: ${theme.shadows.md};
            width: 45%;
            max-width: 500px;
            flex-shrink: 0;
          }
          
          .serve-details h3 {
            color: ${theme.colors.primary};
            margin-bottom: ${theme.spacing.md};
          }
          
          .serve-details ul {
            list-style: none;
            padding: 0;
            margin: 0 0 ${theme.spacing.lg};
            text-align: left;
          }
          
          .serve-details li {
            padding: ${theme.spacing.xs} 0;
            border-bottom: 1px solid ${theme.colors.border};
          }
          
          .serve-details li:last-child {
            border-bottom: none;
          }
          
          .certificate-button {
            background: ${theme.colors.accent};
            color: white;
            border: none;
            padding: ${theme.spacing.sm} ${theme.spacing.lg};
            font-size: ${theme.typography.fontSize.base};
            border-radius: ${theme.borderRadius.full};
            cursor: pointer;
            font-weight: ${theme.typography.fontWeight.medium};
            transition: all 0.2s ease;
          }
          
          .certificate-button:hover {
            transform: translateY(-2px);
            box-shadow: ${theme.shadows.md};
          }
          
          .latte-art {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 2.5rem;
            opacity: 0.8;
          }
          
          @media (max-width: 1200px) {
            .matcha-cup-container,
            .serve-details {
              width: 48%;
            }
          }
          
          @media (max-width: 1024px) {
            .matcha-presentation {
              flex-direction: column;
              align-items: center;
          }
        `}</style>
      </StepLayout>
    );
  }

  return (
    <StepLayout>
      <div className="serve-container">
        <h2>Present Your Matcha</h2>
        <p className="instruction">Choose how you'd like to serve your matcha creation</p>
        
        <div className="serve-options">
          <div className="option-group">
            <h3>Serving Style</h3>
            <div className="option-grid">
              {SERVE_STYLES.map((style) => (
                <motion.div
                  key={style.id}
                  className={`option-card ${selectedStyle === style.id ? 'selected' : ''}`}
                  onClick={() => handleStyleSelect(style.id)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="option-icon">{style.icon}</div>
                  <h4>{style.name}</h4>
                  <p>{style.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
          
          <div className="option-group">
            <h3>Add a Garnish</h3>
            <div className="option-grid">
              {GARNISH_OPTIONS.map((garnish) => (
                <motion.div
                  key={garnish.id}
                  className={`option-card ${selectedGarnish === garnish.id ? 'selected' : ''}`}
                  onClick={() => handleGarnishSelect(garnish.id)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="option-icon">
                    {garnish.emoji || '✖️'}
                  </div>
                  <h4>{garnish.name}</h4>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
        
        <motion.button
          className="serve-button"
          onClick={handleServe}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Serve My Matcha
        </motion.button>
      </div>

      <style jsx>{`
        .serve-container {
          text-align: center;
          padding: ${theme.spacing.xl} 0;
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
        
        .serve-options {
          display: flex;
          flex-direction: column;
          gap: ${theme.spacing.xl};
          margin-bottom: ${theme.spacing.xl};
        }
        
        .option-group h3 {
          color: ${theme.colors.primary};
          margin-bottom: ${theme.spacing.md};
          text-align: left;
          padding-left: ${theme.spacing.sm};
        }
        
        .option-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
          gap: ${theme.spacing.md};
          margin-bottom: ${theme.spacing.lg};
        }
        
        .option-card {
          background: white;
          border: 2px solid ${theme.colors.border};
          border-radius: ${theme.borderRadius.lg};
          padding: ${theme.spacing.md};
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        
        .option-card.selected {
          border-color: ${theme.colors.accent};
          box-shadow: 0 0 0 2px ${theme.colors.accent}40;
        }
        
        .option-icon {
          font-size: 2rem;
          margin-bottom: ${theme.spacing.sm};
        }
        
        .option-card h4 {
          margin: 0 0 ${theme.spacing.xs};
          color: ${theme.colors.text};
        }
        
        .option-card p {
          margin: 0;
          font-size: ${theme.typography.fontSize.sm};
          color: ${theme.colors.lightText};
        }
        
        .serve-button {
          background: ${theme.colors.accent};
          color: white;
          border: none;
          padding: ${theme.spacing.md} ${theme.spacing.xl};
          font-size: ${theme.typography.fontSize.lg};
          border-radius: ${theme.borderRadius.full};
          cursor: pointer;
          font-weight: ${theme.typography.fontWeight.medium};
          box-shadow: ${theme.shadows.md};
          transition: all 0.2s ease;
        }
        
        .serve-button:hover {
          transform: translateY(-2px);
          box-shadow: ${theme.shadows.lg};
        }
        
        @media (max-width: 768px) {
          .option-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </StepLayout>
  );
};

export default ServeStep;
