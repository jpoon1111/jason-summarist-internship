"use client";

import { RefObject } from "react";
import { Book } from "@/components/BookCard";

function formatMM(secs: number) {
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`;
}

interface AudioPlayerProps {
  selected: Book;
  audioRef: RefObject<HTMLAudioElement>;
  playing: boolean;
  setPlaying: (v: boolean) => void;
  currentTime: number;
  setCurrentTime: (v: number) => void;
  duration: number;
}

export default function AudioPlayer({
  selected,
  audioRef,
  playing,
  setPlaying,
  currentTime,
  setCurrentTime,
  duration,
}: AudioPlayerProps) {
  const togglePlay = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setPlaying(!playing);
  };

  const skip = (secs: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Math.max(
      0,
      Math.min(audioRef.current.currentTime + secs, duration)
    );
  };

  return (
    <div className="audio__wrapper">
      {/* Track info */}
      <div className="audio__track--wrapper">
        <div className="audio__track--image-mask">
          <img className="audio__track--image" src={selected.imageLink} alt={selected.title} />
        </div>
        <div className="audio__track--details-wrapper">
          <div style={{ color: "#fff", fontWeight: 500, fontSize: 14 }}>{selected.title}</div>
          <div className="audio__track--author">{selected.author}</div>
        </div>
      </div>

      {/* Controls */}
      <div className="audio__controls">
        <button className="audio__controls--btn" onClick={() => skip(-10)}>
          <svg stroke="currentColor" fill="none" strokeWidth="1.5" viewBox="0 0 24 24" height="28" width="28" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
          </svg>
        </button>

        <button className="audio__controls--btn audio__controls--btn-play" onClick={togglePlay}>
          {playing ? (
            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="24" width="24" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"></path>
            </svg>
          ) : (
            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="24" width="24" xmlns="http://www.w3.org/2000/svg" className="audio__controls--play-icon">
              <path d="M8 5v14l11-7z"></path>
            </svg>
          )}
        </button>

        <button className="audio__controls--btn" onClick={() => skip(10)}>
          <svg stroke="currentColor" fill="none" strokeWidth="1.5" viewBox="0 0 24 24" height="28" width="28" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l6-6m0 0l-6-6m6 6H9a6 6 0 000 12h3" />
          </svg>
        </button>
      </div>

      {/* Progress */}
      <div className="audio__progress--wrapper" style={{ justifyContent: "flex-end" }}>
        <span className="audio__time">{formatMM(currentTime)}</span>
        <input
          type="range"
          className="audio__progress--bar"
          min={0}
          max={duration || 100}
          value={currentTime}
          style={{
            background: `linear-gradient(to right, #2bd97c ${(currentTime / (duration || 1)) * 100}%, #6b757b ${(currentTime / (duration || 1)) * 100}%)`,
          }}
          onChange={(e) => {
            const v = Number(e.target.value);
            setCurrentTime(v);
            if (audioRef.current) audioRef.current.currentTime = v;
          }}
        />
        <span className="audio__time">{formatMM(duration)}</span>
      </div>
    </div>
  );
}
