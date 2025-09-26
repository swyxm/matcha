import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import StepLayout from '../components/layout/StepLayout';
import { useTheme } from '../context/ThemeContext';
import './WhiskStep.css';

interface Position {
  x: number;
  y: number;
}

const WhiskStep: React.FC = () => {
  const { goToStep } = useGame();
  const theme = useTheme();
  
  const [whiskCount, setWhiskCount] = useState<number>(0);
  const [showPerfect, setShowPerfect] = useState<boolean>(false);
  const [isOverBowl, setIsOverBowl] = useState<boolean>(false);
  const [isMouseDown, setIsMouseDown] = useState<boolean>(false);
  
  const TARGET_WHISKS = 15;
  const TOLERANCE = 3;
  const WHISK_SIZE = 80;
  const bowlRef = useRef<HTMLDivElement>(null);
  const lastYPos = useRef<number>(0);
  const lastTime = useRef<number>(Date.now());
  const isWhisking = useRef<boolean>(false);
  const [mousePos, setMousePos] = useState<Position>({ x: 0, y: 0 });
  
  const foamLevel = Math.min(100, (whiskCount / TARGET_WHISKS) * 50);
  const matchaColor = `rgba(57, 96, 60, ${0.8 + (whiskCount / TARGET_WHISKS) * 0.15})`;

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const handleMouseDown = () => setIsMouseDown(true);
    const handleMouseUp = () => setIsMouseDown(false);

    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  useEffect(() => {
    if (isMouseDown && isOverBowl) {
      const now = Date.now();
      const deltaY = Math.abs(mousePos.y - lastYPos.current);
      const deltaTime = now - lastTime.current;
      
      if (deltaTime > 0) {
        const velocity = deltaY / deltaTime;
        
        if (velocity > 0.5 && !isWhisking.current) {
          isWhisking.current = true;
          
          setWhiskCount(prev => {
            const newCount = prev + 1;
            
            if (newCount >= TARGET_WHISKS && !showPerfect) {
              setTimeout(() => {
                goToStep('serve');
              }, 1000);
              setShowPerfect(true);
            }
            
            return newCount;
          });
          
          setTimeout(() => {
            isWhisking.current = false;
          }, 100);
        }
      }
      
      lastYPos.current = mousePos.y;
      lastTime.current = now;
    }
  }, [mousePos, isMouseDown, isOverBowl, showPerfect, goToStep]);

  const handleBowlEnter = () => setIsOverBowl(true);
  const handleBowlLeave = () => setIsOverBowl(false);
  const getWhiskMessage = (): string => {
    if (whiskCount === 0) return 'Drag the whisk up and down to mix the matcha';
    if (whiskCount < TARGET_WHISKS - TOLERANCE) return `Keep whisking... ${whiskCount}/${TARGET_WHISKS}`;
    if (whiskCount < TARGET_WHISKS) return 'Almost there! Keep going!';
    return 'Perfect froth! Moving to serving...';
  };

  useEffect(() => {
    document.body.style.cursor = 'none';
    return () => {
      document.body.style.cursor = 'auto';
    };
  }, []);

  return (
    <>
      <img
        src="/whisk.png"
        alt="whisk"
        style={{
          position: 'fixed',
          left: mousePos.x,
          top: mousePos.y,
          width: `${WHISK_SIZE}px`,
          height: 'auto',
          pointerEvents: 'none',
          transform: 'translate(-50%, -50%)',
          zIndex: 1000,
        }}
      />

      <StepLayout>
        <div className="whisk-content">
          <h2>Whisk the Matcha</h2>

          <div
            ref={bowlRef}
            className="whisk-bowl"
            style={{
              backgroundColor: theme.colors.background,
              border: `4px solid ${theme.colors.primary}`,
            }}
          >
            <motion.div
              className="matcha-liquid"
              onMouseEnter={handleBowlEnter}
              onMouseLeave={handleBowlLeave}
              style={{
                backgroundColor: matchaColor,
              }}
            >
              <div
                className="foam"
                style={{
                  transform: `translateY(${foamLevel}%)`,
                }}
              />
            </motion.div>
          </div>

          <p className="whisk-message">
            {getWhiskMessage()}
          </p>

          <div className="whisk-button-container">
            <motion.button
              onClick={() => goToStep('serve')}
              className="whisk-button"
              style={{
                backgroundColor: theme.colors.primary,
                color: theme.colors.background,
              }}
              whileHover={{ opacity: 0.9 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              Perfect Froth! 🎯
            </motion.button>
          </div>
        </div>
      </StepLayout>
    </>
  );
};

export default WhiskStep;
