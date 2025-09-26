export type GameStep = 
  | 'intro' 
  | 'choose-vibe' 
  | 'scoop' 
  | 'pour' 
  | 'whisk' 
  | 'serve' 
  | 'certificate';

export type VibeId = 'philosopher' | 'poet' | 'nomad';

export interface Vibe {
  id: VibeId;
  name: string;
  description: string;
  quote: string;
  color?: string;
  icon?: string;
}

export interface GameState {
  currentStep: GameStep;
  selectedVibe: VibeId | null;
  showQuote: boolean;
  matchaAmount: number;
  waterAmount: number; 
  waterTemperature: number; 
  isPerfectPour: boolean;
  whiskIntensity: number;
  isPerfectWhisk: boolean;
  serveStyle: string;
  garnish: string;
  background: string;
  musicTrack: string;
}

export interface StepProps {
  onComplete: (nextStep: GameStep) => void;
  gameState: GameState;
  updateGameState: (updates: Partial<GameState>) => void;
}

export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    lightText: string;
    border: string;
  };
  typography: {
    fontFamily: {
      primary: string;
      secondary: string;
    };
    fontSize: {
      xs: string;
      sm: string;
      base: string;
      lg: string;
      xl: string;
      '2xl': string;
      '3xl': string;
      '4xl': string;
    };
    fontWeight: {
      light: number;
      regular: number;
      medium: number;
      semibold: number;
      bold: number;
    };
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    full: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
  };
  transitions: {
    default: string;
    slow: string;
  };
}