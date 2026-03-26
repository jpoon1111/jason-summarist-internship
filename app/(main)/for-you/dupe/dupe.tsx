"use client";

import { useState, useRef, useEffect } from "react";
import { BsPlayFill, BsPauseFill } from "react-icons/bs";
import { TbRewind10, TbFastForward10 } from "react-icons/tb";

export default function PlayerPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSkip = (seconds: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime += seconds;
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (!audioRef.current) return;
    setDuration(audioRef.current.duration);
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Number(e.target.value);
    setCurrentTime(Number(e.target.value));
  };

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;

  return (
    <>
      {/* Scrollable summary area — leaves room for audio bar at bottom */}
      <div className="relative w-full overflow-y-auto h-[calc(100vh-160px)]">
        <div className="whitespace-pre-line p-6 max-w-[800px] mx-auto">
          <h2 className="text-[#032b41] text-2xl border-b border-[#e1e7ea] mb-8 pb-4 leading-relaxed font-bold">
            Mastery
          </h2>
          <p className="whitespace-pre-line leading-[1.4] text-[#032b41]">
            {/* book summary text goes here */}
            Your book summary text here...
          </p>
        </div>
      </div>

      {/* Fixed audio bar at bottom */}
      <div className="w-full h-20 flex items-center justify-between bg-[#042330] px-10 fixed bottom-0 left-0 z-[9998]">
        
        {/* Track info */}
        <div className="flex gap-3 w-1/3">
          <figure className="flex max-w-[48px]">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/summaristt.appspot.com/o/books%2Fimages%2Fmastery.png?alt=media&token=c41aac74-9887-4536-9478-93cd983892af"
              alt="book"
              className="w-full h-full"
            />
          </figure>
          <div className="text-white text-sm flex flex-col gap-1 justify-center">
            <div>Mastery</div>
            <div className="text-[#bac8ce]">Robert Greene</div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-6 w-1/3">
          <button onClick={() => handleSkip(-10)} className="flex items-center justify-center rounded-full cursor-pointer">
            <TbRewind10 className="w-7 h-7 stroke-white hover:stroke-[#2bd97c] transition-all duration-200" />
          </button>

          <button
            onClick={togglePlay}
            className="flex items-center justify-center bg-white rounded-full w-10 h-10 cursor-pointer"
          >
            {isPlaying
              ? <BsPauseFill className="w-5 h-5 text-[#042330]" />
              : <BsPlayFill className="w-5 h-5 text-[#042330] ml-0.5" />
            }
          </button>

          <button onClick={() => handleSkip(10)} className="flex items-center justify-center rounded-full cursor-pointer">
            <TbFastForward10 className="w-7 h-7 stroke-white hover:stroke-[#2bd97c] transition-all duration-200" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-4 w-1/3 justify-end">
          <span className="text-white text-sm">{formatTime(currentTime)}</span>
          <input
            type="range"
            min={0}
            max={duration}
            value={currentTime}
            onChange={handleProgressChange}
            className="rounded-lg h-1 max-w-[300px] w-full cursor-pointer outline-none appearance-none"
            style={{
              background: `linear-gradient(to right, #2bd97c ${progressPercent}%, #6d787d ${progressPercent}%)`
            }}
          />
          <span className="text-white text-sm">{formatTime(duration)}</span>
        </div>

      </div>

      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src="https://firebasestorage.googleapis.com/v0/b/summaristt.appspot.com/o/books%2Faudios%2Fmastery.mp3?alt=media&token=364b7c19-e9b1-4084-be0d-3a9cb5367098"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
      />
    </>
  );
}














return (
  <>
    {/* Scrollable summary area */}
    <div style={{ position: "relative", width: "100%", overflowY: "auto", height: "calc(100vh - 160px)" }}>
      <div style={{ whiteSpace: "pre-line", padding: "24px", maxWidth: "800px", margin: "0 auto" }}>
        <h2 style={{ color: "#032b41", fontSize: "24px", borderBottom: "1px solid #e1e7ea", marginBottom: "32px", paddingBottom: "16px", lineHeight: "1.5" }}>
          Mastery
        </h2>
        <p style={{ whiteSpace: "pre-line", lineHeight: "1.4", color: "#032b41" }}>
          Your book summary text here...
        </p>
      </div>
    </div>

    {/* Fixed audio bar at bottom */}
    <div style={{ width: "100%", height: "80px", display: "flex", alignItems: "center", justifyContent: "space-between", backgroundColor: "#042330", padding: "0 40px", position: "fixed", bottom: 0, left: 0, zIndex: 9998 }}>

      {/* Track info */}
      <div style={{ display: "flex", gap: "12px", width: "calc(100% / 3)" }}>
        <figure style={{ display: "flex", maxWidth: "48px" }}>
          <img src="" alt="book" style={{ width: "100%", height: "100%" }} />
        </figure>
        <div style={{ color: "#fff", fontSize: "14px", display: "flex", flexDirection: "column", gap: "4px", justifyContent: "center" }}>
          <div>Mastery</div>
          <div style={{ color: "#bac8ce" }}>Robert Greene</div>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "24px", width: "calc(100% / 3)" }}>
        <button onClick={() => handleSkip(-10)} style={{ borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <TbRewind10 style={{ width: "28px", height: "28px", stroke: "#fff" }} />
        </button>

        <button onClick={togglePlay} style={{ display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#fff", borderRadius: "50%", width: "40px", height: "40px", cursor: "pointer" }}>
          {isPlaying
            ? <BsPauseFill style={{ color: "#042330" }} />
            : <BsPlayFill style={{ color: "#042330", marginLeft: "4px" }} />
          }
        </button>

        <button onClick={() => handleSkip(10)} style={{ borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <TbFastForward10 style={{ width: "28px", height: "28px", stroke: "#fff" }} />
        </button>
      </div>

      {/* Progress bar */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px", width: "calc(100% / 3)" }}>
        <span style={{ color: "#fff", fontSize: "14px" }}>{formatTime(currentTime)}</span>
        <input
          type="range"
          min={0}
          max={duration}
          value={currentTime}
          onChange={handleProgressChange}
          style={{
            borderRadius: "8px",
            height: "4px",
            maxWidth: "300px",
            width: "100%",
            cursor: "pointer",
            outline: "none",
            appearance: "none",
            background: `linear-gradient(to right, #2bd97c ${progressPercent}%, #6d787d ${progressPercent}%)`
          }}
        />
        <span style={{ color: "#fff", fontSize: "14px" }}>{formatTime(duration)}</span>
      </div>

    </div>

    {/* Hidden audio element */}
    <audio
      ref={audioRef}
      src=""
      onTimeUpdate={handleTimeUpdate}
      onLoadedMetadata={handleLoadedMetadata}
    />
  </>
);