import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

type StepLayoutProps = {
  children: ReactNode;
  className?: string;
  onComplete?: () => void;
  showBackButton?: boolean;
  onBack?: () => void;
  isIntro?: boolean;
};

const StepLayout: React.FC<StepLayoutProps> = ({
  children,
  className = '',
  onComplete,
  showBackButton = false,
  onBack,
  isIntro = false,
}) => {
  const theme = useTheme();
  
  return (
    <div className={`layout-container ${isIntro ? 'intro-layout' : 'step-layout'} ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className={`content ${isIntro ? 'intro-content' : 'step-content'}`}
      >
        {showBackButton && onBack && (
          <button 
            onClick={onBack} 
            className="back-button" 
            aria-label="Go back"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
            </svg>
            Back
          </button>
        )}
        {children}
      </motion.div>
      
      <style>{`
        .layout-container {
          width: 100%;
          min-height: 100vh;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding: ${theme.spacing.lg};
          box-sizing: border-box;
          overflow-x: hidden;
          overflow-y: auto;
        }
        
        .intro-layout {
          max-width: 600px;
          margin: 0 auto;
        }
        
        .content {
          background: ${theme.colors.background};
          border-radius: ${theme.borderRadius.lg};
          box-shadow: ${theme.shadows.lg};
          width: 100%;
          padding: ${theme.spacing.xl};
          box-sizing: border-box;
          position: relative;
        }
        
        .intro-content {
          max-width: 500px;
          text-align: center;
          padding: ${theme.spacing.xl} ${theme.spacing.xl};
        }
        
        .step-content {
          max-width: 1200px;
          width: 90vw;
          min-height: 60vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: ${theme.spacing['2xl']};
        }
        
        .back-button {
          position: absolute;
          top: ${theme.spacing.md};
          left: ${theme.spacing.md};
          background: none;
          border: 1px solid ${theme.colors.border};
          color: ${theme.colors.primary};
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: ${theme.spacing.xs};
          font-size: 0.9rem;
          padding: ${theme.spacing.xs} ${theme.spacing.sm};
          border-radius: ${theme.borderRadius.md};
          transition: all 0.2s ease;
        }
        
        .back-button:hover {
          background: ${theme.colors.primary}10;
        }
        
        /* Responsive adjustments */
        @media (max-width: 768px) {
          .layout-container {
            padding: ${theme.spacing.sm};
            align-items: flex-start;
          }
          
          .content {
            padding: ${theme.spacing.lg} ${theme.spacing.md};
            margin-top: ${theme.spacing.lg};
          }
          
          .step-content {
            min-height: 70vh;
          }
          
          .back-button {
            top: ${theme.spacing.sm};
            left: ${theme.spacing.sm};
          }
        }
      `}</style>
    </div>
  );
};

export default StepLayout;
