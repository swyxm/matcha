import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAudio } from '../context/AudioContext';
import { useTheme } from '../context/ThemeContext';
import { Play, Pause } from 'lucide-react';

const CassettePlayer: React.FC = () => {
  const {
    currentSong,
    isPlaying,
    isSongListOpen,
    togglePlay,
    selectSong,
    toggleSongList,
    songs
  } = useAudio();
  
  const theme = useTheme();
  const artists = Array.from(new Set(songs.map(song => song.artist)));
  const [selectedArtist, setSelectedArtist] = React.useState<string | 'all'>('all');
  const filteredSongs = selectedArtist === 'all' 
    ? songs 
    : songs.filter(song => song.artist === selectedArtist);

  const cassetteImage = currentSong?.cassetteImage || '/images/cassettes/casette.png';
  const cassetteAlt = currentSong?.id !== 'default'
    ? `${currentSong?.title} by ${currentSong?.artist} cassette`
    : 'Cassette player - Select a song';

  return (
    <div className="cassette-player" style={{
      position: 'fixed',
      bottom: '30px',
      right: '30px',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '10px'
    }}>
      <AnimatePresence>
        {isSongListOpen && (
          <motion.div 
            className="song-list-popup"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            style={{
              position: 'absolute',
              bottom: '100%',
              right: 0,
              width: '300px',
              maxHeight: '400px',
              backgroundColor: theme.colors.background,
              borderRadius: theme.borderRadius.md,
              boxShadow: theme.shadows.lg,
              padding: theme.spacing.md,
              zIndex: 1000,
              marginBottom: '5px',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{
              margin: `0 0 ${theme.spacing.sm} 0`,
              color: theme.colors.primary,
              fontSize: '1rem',
              fontWeight: 500
            }}>
              Select a Song
            </h2>     
            <div style={{
              display: 'flex',
              gap: theme.spacing.xs,
              marginBottom: theme.spacing.sm,
              flexWrap: 'wrap'
            }}>
              <button
                onClick={() => setSelectedArtist('all')}
                style={{
                  background: selectedArtist === 'all' ? theme.colors.primary : theme.colors.background,
                  color: selectedArtist === 'all' ? 'white' : theme.colors.text,
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: '15px',
                  padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
                  fontSize: '1rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                All
              </button>
              {artists.map(artist => (
                <button
                  key={artist}
                  onClick={() => setSelectedArtist(artist)}
                  style={{
                    background: selectedArtist === artist ? theme.colors.primary : theme.colors.background,
                    color: selectedArtist === artist ? 'white' : theme.colors.text,
                    border: `1px solid ${theme.colors.border}`,
                    borderRadius: '15px',
                    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
                    fontSize: '1rem',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {artist}
                </button>
              ))}
            </div>
            
            <div style={{
              overflowY: 'auto',
              flex: 1,
              paddingRight: theme.spacing.xs
            }}>
              {filteredSongs.map((song) => (
                <div
                  key={song.id}
                  onClick={() => selectSong(song)}
                  style={{
                    padding: `${theme.spacing.sm} ${theme.spacing.sm}`,
                    borderRadius: theme.borderRadius.sm,
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                    backgroundColor: currentSong?.id === song.id 
                      ? 'rgba(44, 95, 45, 0.1)' 
                      : 'transparent',
                    marginBottom: theme.spacing.xs,
                  }}
                >
                  <div style={{
                    fontWeight: 500,
                    fontSize: '0.85rem',
                    color: theme.colors.text,
                    marginBottom: '2px'
                  }}>
                    {song.title}
                  </div>
                  <div style={{
                    fontSize: '0.75rem',
                    color: theme.colors.lightText
                  }}>
                    {song.artist}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

        <motion.div
          className="cassette-container"
          onClick={toggleSongList}
          style={{
            position: 'relative',
            cursor: 'pointer',
            width: '300px',
            height: '300px',
            overflow: 'hidden',
          }}
        >
          <img
            src={cassetteImage}
            alt={cassetteAlt}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'all 0.3s ease'
            }}
          />
        </motion.div>

        {currentSong?.id !== 'default' && currentSong && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginTop: '8px'
          }}>
            <div 
              onClick={togglePlay}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                padding: '2px'
              }}
            >
              {isPlaying ? (
                <Pause size={12} color="black" fill="black" />
              ) : (
                <Play size={12} color="black" fill="black" />
              )}
            </div>
            <div style={{
              color: 'black',
              fontSize: '12px',
              fontWeight: 500,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: '160px'
            }}>
              {currentSong.title} - {currentSong.artist}
            </div>
          </div>
        )}
    </div>
  );
};

export default CassettePlayer;
