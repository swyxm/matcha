import { createContext, useContext, useState, useRef, useEffect } from 'react';
import type { ReactNode } from 'react';

export interface Song {
  id: string;
  title: string;
  artist: string;
  audioSrc: string;
  cassetteImage: string;
}

interface AudioContextType {
  currentSong: Song | null;
  isPlaying: boolean;
  isSongListOpen: boolean;
  togglePlay: () => void;
  selectSong: (song: Song) => void;
  toggleSongList: () => void;
  songs: Song[];
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

// Define our songs with their corresponding cassette images
const songs: Song[] = [
  {
    id: 'beaches',
    title: 'Beaches',
    artist: 'beabadoobee',
    audioSrc: '/audio/beaches.mp3',
    cassetteImage: '/images/cassettes/casette_bea.png'
  },
  {
    id: 'juna',
    title: 'Juna',
    artist: 'clairo',
    audioSrc: '/audio/juna.mp3',
    cassetteImage: '/images/cassettes/casette_clairo.png'
  },
  {
    id: 'lovergirl',
    title: 'Lovergirl',
    artist: 'laufey',
    audioSrc: '/audio/lovergirl.mp3',
    cassetteImage: '/images/cassettes/casette_laufey.png'
  },
  {
    id: 'perfectpair',
    title: 'Perfect Pair',
    artist: 'beabadoobee',
    audioSrc: '/audio/perfectpair.mp3',
    cassetteImage: '/images/cassettes/casette_bea.png'
  },
  {
    id: 'sexytosomeone',
    title: 'Sexy To Someone',
    artist: 'clairo',
    audioSrc: '/audio/sexytosomeone.mp3',
    cassetteImage: '/images/cassettes/casette_clairo.png'
  },
  {
    id: 'showmehow',
    title: 'Show Me How',
    artist: 'Men I Trust',
    audioSrc: '/audio/showmehow.mp3',
    cassetteImage: '/images/cassettes/casette_mit.png'
  }
];

export const AudioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSongListOpen, setIsSongListOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio();
    
    // Set default cassette image when no song is selected
    if (!currentSong) {
      setCurrentSong({
        id: 'default',
        title: 'No song selected',
        artist: 'Select a song',
        audioSrc: '',
        cassetteImage: '/images/cassettes/casette.png' // Default cassette
      });
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Handle play/pause
  useEffect(() => {
    if (!audioRef.current) return;

    // Don't try to play if no song is selected or it's the default state
    if (isPlaying) {
      if (!currentSong?.audioSrc) {
        setIsPlaying(false);
        return;
      }
      
      // Set the audio source if it's not already set
      if (audioRef.current.src !== currentSong.audioSrc) {
        audioRef.current.src = currentSong.audioSrc;
      }
      
      audioRef.current.play().catch(error => {
        console.error('Error playing audio:', error);
        setIsPlaying(false);
      });
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, currentSong]);

  // Update audio source when song changes
  useEffect(() => {
    if (!audioRef.current || !currentSong) return;

    const playPromise = audioRef.current.play();
    
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.error('Error playing new song:', error);
        setIsPlaying(false);
      });
    }
  }, [currentSong]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const selectSong = (song: Song) => {
    setCurrentSong(song);
    setIsPlaying(true);
    setIsSongListOpen(false);
  };

  const toggleSongList = () => {
    setIsSongListOpen(!isSongListOpen);
  };

  return (
    <AudioContext.Provider
      value={{
        currentSong,
        isPlaying,
        isSongListOpen,
        togglePlay,
        selectSong,
        toggleSongList,
        songs
      }}
    >
      {children}
      <audio
        ref={audioRef}
        src={currentSong?.audioSrc}
        onEnded={() => setIsPlaying(false)}
        loop
      />
    </AudioContext.Provider>
  );
};

export const useAudio = (): AudioContextType => {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};

export default AudioContext;
