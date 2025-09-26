import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import StepLayout from '../components/layout/StepLayout';
import { useTheme } from '../context/ThemeContext';

const PourStep: React.FC = () => {
  const { updateGameState, goToStep } = useGame();
  const theme = useTheme();
  const [pourAmount, setPourAmount] = useState(0);
  const [isPouring, setIsPouring] = useState(false);
  const [showTip, setShowTip] = useState(false);
  
  const maxPour = 100;
  const targetPour = 80;
  const tolerance = 10;

  useEffect(() => {
    const tipTimer = setTimeout(() => {
      setShowTip(true);
    }, 3000);
    
    return () => clearTimeout(tipTimer);
  }, []);
  
  const handlePour = () => {
    if (pourAmount >= maxPour) return;
    
    setIsPouring(true);
    
    const pourInterval = setInterval(() => {
      setPourAmount(prev => {
        const newAmount = Math.min(prev + 1, maxPour);
        if (newAmount === targetPour || newAmount === maxPour) {
          updateGameState({ 
            waterAmount: newAmount,
            isPerfectPour: Math.abs(newAmount - targetPour) <= tolerance
          });
          if (newAmount >= targetPour - tolerance && newAmount <= targetPour + tolerance) {
            setTimeout(() => goToStep('whisk'), 1500);
          } else if (newAmount === maxPour) {
            setTimeout(() => goToStep('whisk'), 1000);
          }
        }
        
        return newAmount;
      });
      
      if (pourAmount >= maxPour) {
        clearInterval(pourInterval);
        setIsPouring(false);
      }
    }, 50);
    
    const stopPouring = () => {
      clearInterval(pourInterval);
      setIsPouring(false);
      if (pourAmount > 0 && pourAmount < maxPour) {
        updateGameState({ 
          waterAmount: pourAmount,
          isPerfectPour: Math.abs(pourAmount - targetPour) <= tolerance
        });
      }
    };
    
    window.addEventListener('mouseup', stopPouring, { once: true });
    window.addEventListener('touchend', stopPouring, { once: true });
    
    return () => {
      clearInterval(pourInterval);
      window.removeEventListener('mouseup', stopPouring);
      window.removeEventListener('touchend', stopPouring);
    };
  };
  
  const getPourMessage = () => {
    if (pourAmount === 0) return 'Press and hold to pour water';
    if (pourAmount < targetPour - tolerance) return 'A bit more...';
    if (pourAmount > targetPour + tolerance) return 'That\'s too much!';
    return 'Perfect temperature! Release to continue';
  };
  
  const getWaterColor = () => {
    const opacity = 0.3 + (0.7 * (pourAmount / maxPour));
    return `rgba(200, 230, 255, ${opacity})`;
  };

  return (
    <StepLayout>
      <div className="pour-container">
        <h2>The Perfect Pour</h2>
        <p className="instruction">Hold to pour water at 80°C</p>
        
        <div className="pour-visual">
          <motion.div 
            className="kettle"
            animate={isPouring ? 'pouring' : 'idle'}
            variants={{
              idle: { rotate: 0 },
              pouring: { 
                rotate: 45,
                transformOrigin: 'bottom right',
                transition: { duration: 0.3 }
              }
            }}
          >
            <div className="kettle-spout"></div>
            <div className="kettle-handle"></div>
          </motion.div>
          
          <div className="cup">
            <div 
              className="water"
              style={{
                height: `${pourAmount}%`,
                backgroundColor: getWaterColor(),
                bottom: 0
              }}
            ></div>
            <div className="cup-handle"></div>
          </div>
          
          <div className="measurement">
            <span className="measurement-value">{pourAmount}°C</span>
            <span className="measurement-label">Water Temperature</span>
          </div>
        </div>
        
        <motion.button 
          className="pour-button"
          onMouseDown={handlePour}
          onTouchStart={handlePour}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={pourAmount >= maxPour}
        >
          {pourAmount === 0 ? 'Hold to Pour' : 
           pourAmount >= maxPour ? 'Maximum Reached' : 
           isPouring ? 'Pouring...' : 'Continue Pouring'}
        </motion.button>
        
        <p className="pour-message">{getPourMessage()}</p>
        
        {showTip && (
          <div className="tip">
            <span className="tip-icon">💡</span>
            <p>For the perfect matcha, aim for 80°C water. Too hot, and it becomes bitter.</p>
          </div>
        )}
      </div>

      <style>
        {`
          .pour-container {
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
          
          .pour-visual {
            position: relative;
            height: 300px;
            width: 100%;
            max-width: 400px;
            margin: 0 auto ${theme.spacing.xl};
          }
          
          .cup {
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 180px;
            height: 200px;
            border: 4px solid ${theme.colors.border};
            border-radius: 0 0 20px 20px;
            overflow: hidden;
            z-index: 1;
          }
          
          .cup::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            border: 2px solid ${theme.colors.primary};
            border-radius: 0 0 16px 16px;
            pointer-events: none;
          }
          
          .cup-handle {
            position: absolute;
            right: -30px;
            top: 50px;
            width: 40px;
            height: 80px;
            border: 4px solid ${theme.colors.border};
            border-left: none;
            border-radius: 0 20px 20px 0;
          }
          
          .water {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            background: linear-gradient(to top, rgba(173, 216, 230, 0.8), rgba(173, 216, 255, 0.9));
            transition: height 0.3s ease-out;
            z-index: 0;
            border-radius: 0 0 16px 16px;
          }
          
          .kettle {
            position: absolute;
            top: 20px;
            right: 40%;
            width: 100px;
            height: 80px;
            background: #e0e0e0;
            border-radius: 20px 20px 40px 40px;
            z-index: 2;
          }
          
          .kettle-spout {
            position: absolute;
            top: 20px;
            right: -30px;
            width: 30px;
            height: 10px;
            background: #b0b0b0;
            border-radius: 0 10px 10px 0;
          }
          
          .kettle-handle {
            position: absolute;
            top: 20px;
            left: -15px;
            width: 10px;
            height: 40px;
            background: #a0a0a0;
            border-radius: 5px;
          }
          
          .measurement {
            position: absolute;
            bottom: ${theme.spacing.lg};
            left: 0;
            right: 0;
            text-align: center;
            color: white;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
            z-index: 3;
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
          
          .pour-button {
            background: ${theme.colors.primary};
            color: white;
            border: none;
            padding: ${theme.spacing.md} ${theme.spacing.xl};
            font-size: ${theme.typography.fontSize.lg};
            border-radius: ${theme.borderRadius.md};
            cursor: pointer;
            transition: ${theme.transitions.default};
            margin: ${theme.spacing.lg} 0;
            min-width: 200px;
          }
          
          .pour-button:disabled {
            background: ${theme.colors.lightText};
            cursor: not-allowed;
          }
          
          .pour-button:not(:disabled):hover {
            transform: translateY(-2px);
            box-shadow: ${theme.shadows.md};
          }
          
          .pour-message {
            color: ${theme.colors.primary};
            font-style: italic;
            min-height: 24px;
            margin: ${theme.spacing.md} 0;
          }
          
          .tip {
            background: rgba(255, 255, 255, 0.9);
            border-left: 4px solid ${theme.colors.accent};
            padding: ${theme.spacing.md};
            margin-top: ${theme.spacing.xl};
            text-align: left;
            display: flex;
            align-items: flex-start;
            gap: ${theme.spacing.sm};
            max-width: 500px;
            margin-left: auto;
            margin-right: auto;
          }
          
          .tip-icon {
            font-size: 1.5rem;
            line-height: 1;
          }
          
          .tip p {
            margin: 0;
            font-size: ${theme.typography.fontSize.sm};
            color: ${theme.colors.text};
          }
          
          @media (max-width: 768px) {
            .pour-visual {
              height: 250px;
            }
            
            h2 {
              font-size: ${theme.typography.fontSize['2xl']};
            }
            
            .cup {
              width: 150px;
              height: 180px;
            }
            
            .kettle {
              right: 30%;
              width: 80px;
              height: 70px;
            }
          }
        `}
      </style>
    </StepLayout>
  );
};

export default PourStep;
