import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import StepLayout from '../components/layout/StepLayout';
import { useTheme } from '../context/ThemeContext';
import { SpotifyProvider } from '../context/SpotifyContext';
import SpotifyPlayer from '../components/SpotifyPlayer';

const IntroStep: React.FC = () => {
  const { goToStep } = useGame();
  const theme = useTheme();

  const handleStart = () => {
    goToStep('choose-vibe');
  };

  return (
    <StepLayout isIntro={true}>
      <SpotifyProvider>
        <div className="intro-content">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="matcha-symbol">🍵</div>
            <h1>Matcha Mastery</h1>
            <p className="intro-subtitle">A Ritual of Precision &amp; Presence</p>
            
            <div className="intro-divider">
              <span className="divider-line"></span>
              <span className="divider-text">始めましょう</span>
              <span className="divider-line"></span>
            </div>
            
            <p className="intro-quote">
              "The perfect cup is not made with hands, but with intention."
              <span className="quote-attribute">— The Way of Tea</span>
            </p>
            
            <motion.button 
              className="cta-button"
              onClick={handleStart}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>Commence Ritual</span>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M5 12H19M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.button>
          </motion.div>
          
          {/* Spotify Player */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            style={{ marginTop: '2rem' }}
          >
            <SpotifyPlayer />
          </motion.div>
        </div>

        <style>
          {`
          .intro-container {
            display: flex;
            justify-content: center;
            align-items: center;
            padding: ${theme.spacing.xl} ${theme.spacing.md};
            text-align: center;
          }
          
          .matcha-symbol {
            font-size: 4rem;
            margin-bottom: ${theme.spacing.lg};
            opacity: 0.9;
            animation: float 6s ease-in-out infinite;
          }
          
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
          
          h1 {
            font-size: 3.5rem;
            color: ${theme.colors.primary};
            margin-bottom: ${theme.spacing.sm};
            font-weight: ${theme.typography.fontWeight.light};
            letter-spacing: 1px;
          }
          
          .intro-subtitle {
            font-size: 1.4rem;
            color: ${theme.colors.lightText};
            margin-bottom: ${theme.spacing.xl};
            font-weight: ${theme.typography.fontWeight.light};
            letter-spacing: 1px;
          }
          
          .intro-divider {
            display: flex;
            align-items: center;
            justify-content: center;
            margin: ${theme.spacing.xl} 0;
            gap: ${theme.spacing.md};
          }
          
          .divider-line {
            height: 1px;
            background: linear-gradient(90deg, transparent, ${theme.colors.border}, transparent);
            flex: 1;
            max-width: 100px;
          }
          
          .divider-text {
            color: ${theme.colors.lightText};
            font-size: 0.9rem;
            letter-spacing: 2px;
            text-transform: uppercase;
            padding: 0 ${theme.spacing.md};
          }
          
          .intro-quote {
            font-style: italic;
            font-size: 1.4rem;
            line-height: 1.8;
            color: ${theme.colors.text};
            max-width: 600px;
            margin: 0 auto ${theme.spacing.xl};
            position: relative;
            padding: 0 ${theme.spacing.xl};
          }
          
          .quote-attribute {
            display: block;
            font-size: 1rem;
            margin-top: ${theme.spacing.sm};
            color: ${theme.colors.lightText};
            font-style: normal;
          }
          
          .cta-button {
            background: transparent;
            color: ${theme.colors.primary};
            border: 1px solid ${theme.colors.primary};
            padding: ${theme.spacing.sm} ${theme.spacing.xl};
            font-size: 1.1rem;
            border-radius: ${theme.borderRadius.sm};
            cursor: pointer;
            transition: ${theme.transitions.default};
            text-transform: uppercase;
            letter-spacing: 2px;
            display: inline-flex;
            align-items: center;
            gap: ${theme.spacing.sm};
            position: relative;
            overflow: hidden;
            z-index: 1;
          }
          
          .cta-button::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 0;
            height: 100%;
            background-color: ${theme.colors.primary};
            transition: width 0.3s ease;
            z-index: -1;
          }
          
          .cta-button:hover {
            color: white;
          }
          
          .cta-button:hover::before {
            width: 100%;
          }
          
          .cta-button svg {
            transition: transform 0.3s ease;
          }
          
          .cta-button:hover svg {
            transform: translateX(4px);
          }
          
          @media (max-width: 768px) {
            h1 {
              font-size: 2.5rem;
            }
            
            .intro-subtitle {
              font-size: 1.2rem;
            }
            
            .intro-quote {
              font-size: 1.2rem;
              padding: 0 ${theme.spacing.md};
            }
          }
          `}
        </style>
      </SpotifyProvider>
    </StepLayout>
  );
};

export default IntroStep;
