import React, { useState, useRef, useEffect } from 'react';
import './AudioPlayer.css';

const AudioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(204.048); // 3:24 in seconds
  const audioRef = useRef(null);

  // Format time from seconds to MM:SS
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Toggle play/pause
  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Skip forward 10 seconds
  const skipForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(
        audioRef.current.currentTime + 10,
        duration
      );
    }
  };

  // Skip backward 10 seconds
  const skipBackward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(
        audioRef.current.currentTime - 10,
        0
      );
    }
  };

  // Handle progress bar change
  const handleProgressChange = (e) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  // Update current time as audio plays
  useEffect(() => {
    const audio = audioRef.current;
    
    const updateTime = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    if (audio) {
      audio.addEventListener('timeupdate', updateTime);
      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      
      return () => {
        audio.removeEventListener('timeupdate', updateTime);
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      };
    }
  }, []);

  // Calculate progress percentage
  const progress = (currentTime / duration) * 100;

  return (
    <div className="audio__wrapper">
      <audio
        ref={audioRef}
        src="https://firebasestorage.googleapis.com/v0/b/summaristt.appspot.com/o/books%2Faudios%2Fhow-to-win-friends-and-influence-people.mp3?alt=media&token=60872755-13fc-43f4-8b75-bae3fcd73991"
      />
      
      {/* Track Info */}
      <div className="audio__track--wrapper">
        <figure className="audio__track--image-mask">
          <figure className="book__image--wrapper" style={{ height: '48px', width: '48px', minWidth: '48px' }}>
            <img
              className="book__image"
              src="https://firebasestorage.googleapis.com/v0/b/summaristt.appspot.com/o/books%2Fimages%2Fhow-to-win-friends-and-influence-people.png?alt=media&token=099193aa-4d85-4e22-8eb7-55f12a235fe2"
              alt="book"
              style={{ display: 'block' }}
            />
          </figure>
        </figure>
        <div className="audio__track--details-wrapper">
          <div className="audio__track--title">
            How to Win Friends and Influence People in the Digital Age
          </div>
          <div className="audio__track--author">Dale Carnegie</div>
        </div>
      </div>

      {/* Controls */}
      <div className="audio__controls--wrapper">
        <div className="audio__controls">
          <button className="audio__controls--btn" onClick={skipBackward}>
            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
              <path fill="none" stroke="#000" strokeWidth="2" d="M3.11111111,7.55555556 C4.66955145,4.26701301 8.0700311,2 12,2 C17.5228475,2 22,6.4771525 22,12 C22,17.5228475 17.5228475,22 12,22 L12,22 C6.4771525,22 2,17.5228475 2,12 M2,4 L2,8 L6,8 M9,16 L9,9 L7,9.53333333 M17,12 C17,10 15.9999999,8.5 14.5,8.5 C13.0000001,8.5 12,10 12,12 C12,14 13,15.5000001 14.5,15.5 C16,15.4999999 17,14 17,12 Z M14.5,8.5 C16.9253741,8.5 17,11 17,12 C17,13 17,15.5 14.5,15.5 C12,15.5 12,13 12,12 C12,11 12.059,8.5 14.5,8.5 Z"></path>
            </svg>
          </button>
          
          <button className="audio__controls--btn audio__controls--btn-play" onClick={togglePlayPause}>
            {isPlaying ? (
              <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" className="audio__controls--play-icon" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                <path d="M224 435.8V76.2c0-6.7-5.4-12.2-12.2-12.2h-71.6c-6.8 0-12.2 5.4-12.2 12.2v359.6c0 6.7 5.4 12.2 12.2 12.2h71.6c6.7 0 12.2-5.4 12.2-12.2zm160 0V76.2c0-6.7-5.4-12.2-12.2-12.2h-71.6c-6.7 0-12.2 5.4-12.2 12.2v359.6c0 6.7 5.4 12.2 12.2 12.2h71.6c6.7 0 12.2-5.4 12.2-12.2z"></path>
              </svg>
            ) : (
              <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" className="audio__controls--play-icon" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                <path d="M96 448l320-192L96 64v384z"></path>
              </svg>
            )}
          </button>
          
          <button className="audio__controls--btn" onClick={skipForward}>
            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
              <path fill="none" stroke="#000" strokeWidth="2" d="M20.8888889,7.55555556 C19.3304485,4.26701301 15.9299689,2 12,2 C6.4771525,2 2,6.4771525 2,12 C2,17.5228475 6.4771525,22 12,22 L12,22 C17.5228475,22 22,17.5228475 22,12 M22,4 L22,8 L18,8 M9,16 L9,9 L7,9.53333333 M17,12 C17,10 15.9999999,8.5 14.5,8.5 C13.0000001,8.5 12,10 12,12 C12,14 13,15.5000001 14.5,15.5 C16,15.4999999 17,14 17,12 Z M14.5,8.5 C16.9253741,8.5 17,11 17,12 C17,13 17,15.5 14.5,15.5 C12,15.5 12,13 12,12 C12,11 12.059,8.5 14.5,8.5 Z"></path>
            </svg>
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="audio__progress--wrapper">
        <div className="audio__time">{formatTime(currentTime)}</div>
        <input
          type="range"
          className="audio__progress--bar"
          value={currentTime}
          max={duration}
          onChange={handleProgressChange}
          style={{
            background: `linear-gradient(to right, rgb(43, 217, 124) ${progress}%, rgb(109, 120, 125) ${progress}%)`,
            '--range-progress': `${progress}%`
          }}
        />
        <div className="audio__time">{formatTime(duration)}</div>
      </div>
    </div>
  );
};

export default AudioPlayer;
