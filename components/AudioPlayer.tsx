import React, { useRef, useState, useEffect } from 'react';
import { FaPlay, FaPause } from 'react-icons/fa';

interface AudioPlayerProps {
  audioSrc: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioSrc }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // States for playback logic
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  // Toggle Play/Pause
  const togglePlay = () => {
    if (audioRef.current) {
      isPlaying ? audioRef.current.pause() : audioRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  // Update progress bar as audio plays
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const total = audioRef.current.duration;
      setProgress((current / total) * 100);
    }
  };

  // Allow user to click the progress bar to skip
  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      const newTime = (Number(e.target.value) / 100) * audioRef.current.duration;
      audioRef.current.currentTime = newTime;
      setProgress(Number(e.target.value));
    }
  };

  return (
    <div className="flex items-center gap-4 w-full bg-white p-4 rounded-xl shadow-sm border border-gray-100">
      {/* Hidden Audio Tag */}
      <audio 
        ref={audioRef} 
        src={audioSrc} 
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
        onEnded={() => setIsPlaying(false)}
      />

      {/* Play/Pause Button */}
      <button 
        onClick={togglePlay}
        className="flex items-center justify-center w-10 h-10 bg-[#032b41] text-white rounded-full hover:scale-105 transition-transform"
      >
        {isPlaying ? <FaPause size={14} /> : <FaPlay className="ml-1" size={14} />}
      </button>

      {/* Progress Bar Container */}
      <div className="relative flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
        {/* Visual Progress Fill */}
        <div 
          className="absolute h-full bg-[#032b41] transition-all duration-100 ease-linear"
          style={{ width: `${progress}%` }}
        />
        
        {/* Invisible Range Input for Interaction */}
        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={handleProgressChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>

      {/* Time Display (Optional) */}
      <span className="text-xs font-semibold text-[#032b41] min-w-[40px]">
        {formatTime(audioRef.current?.currentTime || 0)}
      </span>
    </div>
  );
};

// Helper function to format seconds into 0:00
const formatTime = (time: number) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

export default AudioPlayer;









// "use client"; // Client Component — required for event handlers (onClick, onChange) and direct DOM access via audioRef

// import { RefObject } from "react"; // TypeScript type for React refs — used to type the audioRef prop
// import { Book } from "@/components/BookCard"; // Shared Book interface — used to type the `selected` prop

// // ── HELPER: formatMM ────────────────────────────────────────────────────────
// // Converts a raw number of seconds into a zero-padded MM:SS display string
// // e.g. 185 → "03:05"  |  62 → "01:02"  |  9 → "00:09"
// // Used for both the current playback time and the total duration labels
// function formatMM(secs: number) {
//   const m = Math.floor(secs / 60);       // Whole minutes
//   const s = Math.floor(secs % 60);       // Remaining seconds after stripping full minutes
//   return `${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`; // Pad both values with a leading zero if needed
// }

// // ── PROPS INTERFACE ─────────────────────────────────────────────────────────
// // AudioPlayer is a "controlled" component — it owns no state of its own.
// // All playback state lives in page.tsx and flows down here as props.
// // This keeps the source of truth in one place and avoids sync bugs.
// interface AudioPlayerProps {
//   selected: Book;                            // The currently playing book — used to display title, author, and cover image
//   audioRef: RefObject<HTMLAudioElement | null>; // Ref to the actual <audio> DOM element in page.tsx — allows us to call .play(), .pause(), and set .currentTime directly
//   playing: boolean;                          // True = audio is playing; False = paused — drives the play/pause button icon
//   setPlaying: (v: boolean) => void;          // Callback to flip the playing state in page.tsx
//   currentTime: number;                       // Current playback position in seconds — drives the progress bar fill and left time label
//   setCurrentTime: (v: number) => void;       // Callback to update currentTime in page.tsx when user drags the slider
//   duration: number;                          // Total audio duration in seconds — used as the slider's max value and right time label
// }

// export default function AudioPlayer({
//   selected,
//   audioRef,
//   playing,
//   setPlaying,
//   currentTime,
//   setCurrentTime,
//   duration,
// }: AudioPlayerProps) {

//   // ── togglePlay ──────────────────────────────────────────────────────────
//   // Called when the user clicks the central play/pause button
//   // Directly calls browser-native .play()/.pause() on the <audio> element via audioRef,
//   // then flips the `playing` state — which updates the button icon in the UI
//   const togglePlay = () => {
//     if (!audioRef.current) return; // Safety guard: exit if the <audio> element isn't mounted yet
//     if (playing) {
//       audioRef.current.pause();    // Browser API: pauses playback immediately
//     } else {
//       audioRef.current.play();     // Browser API: resumes/starts playback
//     }
//     setPlaying(!playing);          // Flips state → triggers re-render → button icon switches
//   };

//   // ── skip ────────────────────────────────────────────────────────────────
//   // Called by the skip-back (-10s) and skip-forward (+10s) buttons
//   // Clamps the result between 0 and the track's total duration to prevent invalid positions
//   // secs is negative for skip-back (-10) and positive for skip-forward (+10)
//   const skip = (secs: number) => {
//     if (!audioRef.current) return;
//     audioRef.current.currentTime = Math.max(
//       0,                                           // Can't go below 0 seconds
//       Math.min(audioRef.current.currentTime + secs, duration) // Can't go past the end of the track
//     );
//     // Note: We don't call setCurrentTime here — the <audio> element's onTimeUpdate event
//     // in page.tsx fires automatically after currentTime changes, which keeps state in sync
//   };

//   // ── progress ────────────────────────────────────────────────────────────
//   // Calculates how far through the track we are as a percentage (0–100)
//   // Used to set the two-tone background on the range input (green = played, grey = remaining)
//   // (duration || 1) prevents division by zero when duration hasn't loaded yet
//   const progress = (currentTime / (duration || 1)) * 100;

//   return (
//     // Fixed bar at the very bottom of the viewport — always visible during playback
//     // z-[9998]: sits above everything except modals — prevents page content from hiding it
//     // bg-[#042330]: dark navy background — distinct from the white page content
//     // Three sections (track info / controls / progress) each take w-1/3 on desktop
//     // On mobile (max-md): stacks vertically (flex-col), becomes taller (h-[180px])
//     <div
//       className="w-full h-20 flex items-center justify-between bg-[#042330] px-10 fixed bottom-0 left-0 z-[9998]
//         max-md:h-[180px] max-md:px-6 max-md:flex-col max-md:py-4"
//     >

//       {/* ── LEFT: TRACK INFO ─────────────────────────────────────────────── */}
//       {/* Shows the book's cover thumbnail, title, and author */}
//       {/* w-1/3: occupies the left third of the player bar on desktop */}
//       <div className="flex gap-3 w-1/3 max-md:w-full max-md:justify-center">

//         {/* Cover image thumbnail — small square, max 48px wide on desktop, 80px on mobile */}
//         <div className="flex max-w-[48px] max-md:max-w-[80px]">
//           <img
//             className="w-full h-full"
//             src={selected.imageLink}
//             alt={selected.title}
//           />
//         </div>

//         {/* Title and author text — white on dark background */}
//         <div className="flex flex-col justify-center gap-1 text-white text-sm">
//           <div className="font-medium">{selected.title}</div>
//           {/* Muted blue-grey for the author — slightly less prominent than the title */}
//           <div className="text-[#bac8ce]">{selected.author}</div>
//         </div>

//       </div>

//       {/* ── CENTER: PLAYBACK CONTROLS ────────────────────────────────────── */}
//       {/* Three buttons: skip back 10s | play/pause | skip forward 10s */}
//       {/* w-1/3: center third of the bar; centered with justify-center */}
//       <div className="flex items-center justify-center gap-6 w-1/3 max-md:w-full max-md:justify-center">

//         {/* Skip back 10 seconds — curved arrow pointing left */}
//         <button
//           className="flex items-center justify-center rounded-full cursor-pointer"
//           onClick={() => skip(-10)} // Negative = go back in time
//         >
//           <svg stroke="currentColor" fill="none" strokeWidth="1.5" viewBox="0 0 24 24"
//             className="w-7 h-7 stroke-white hover:stroke-[#2bd97c] transition-all" // Turns green on hover
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
//           </svg>
//         </button>

//         {/* Play / Pause toggle — white circle containing either a pause or play icon */}
//         {/* bg-white + text-[#042330]: inverted colours from the bar (white button, dark icon) */}
//         <button
//           className="flex items-center justify-center bg-white rounded-full w-10 h-10 cursor-pointer"
//           onClick={togglePlay}
//         >
//           {playing ? (
//             // PAUSE icon: two vertical bars — shown when audio is currently playing
//             <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24"
//               className="w-6 h-6 text-[#042330]"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
//             </svg>
//           ) : (
//             // PLAY icon: right-pointing triangle — shown when audio is paused
//             // ml-1: nudges the triangle slightly right so it looks visually centered in the circle
//             <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24"
//               className="w-6 h-6 text-[#042330] ml-1"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path d="M8 5v14l11-7z" />
//             </svg>
//           )}
//         </button>

//         {/* Skip forward 10 seconds — curved arrow pointing right */}
//         <button
//           className="flex items-center justify-center rounded-full cursor-pointer"
//           onClick={() => skip(10)} // Positive = jump forward in time
//         >
//           <svg stroke="currentColor" fill="none" strokeWidth="1.5" viewBox="0 0 24 24"
//             className="w-7 h-7 stroke-white hover:stroke-[#2bd97c] transition-all" // Turns green on hover
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l6-6m0 0l-6-6m6 6H9a6 6 0 000 12h3" />
//           </svg>
//         </button>

//       </div>

//       {/* ── RIGHT: PROGRESS BAR + TIME LABELS ───────────────────────────── */}
//       {/* Shows elapsed time | scrubber slider | total duration */}
//       {/* w-1/3: right third of the bar; justify-end aligns everything to the right */}
//       <div className="flex items-center gap-4 w-1/3 justify-end max-md:w-full max-md:justify-center">

//         {/* Current playback position — updates ~4x per second via onTimeUpdate in page.tsx */}
//         <span className="text-white text-sm">{formatMM(currentTime)}</span>

//         {/* ── SCRUBBER SLIDER ──────────────────────────────────────────── */}
//         {/* HTML range input — the user can drag this to seek to any position in the track */}
//         {/* appearance-none: removes browser default styling so we can apply our own */}
//         {/* The two-tone background (green left / grey right) is set via inline style
//             because Tailwind can't dynamically compute a percentage-based gradient.
//             linear-gradient fills green up to `progress`% then switches to grey */}
//         <input
//           type="range"
//           className="rounded-lg h-1 max-w-[300px] w-full cursor-pointer outline-none appearance-none"
//           min={0}
//           max={duration || 100}  // Falls back to 100 if duration hasn't loaded yet, so the slider still renders
//           value={currentTime}    // Controlled: always reflects the current position
//           style={{
//             background: `linear-gradient(to right, #2bd97c ${progress}%, #6b757b ${progress}%)`,
//             // #2bd97c = green (played portion)   #6b757b = grey (remaining portion)
//           }}
//           onChange={(e) => {
//             const v = Number(e.target.value); // Convert string from the input event to a number
//             setCurrentTime(v);                // Update React state → re-renders the time label and progress bar
//             if (audioRef.current) audioRef.current.currentTime = v; // Seek the actual audio to the new position
//           }}
//         />

//         {/* Total track duration — set once audio metadata loads in page.tsx */}
//         <span className="text-white text-sm">{formatMM(duration)}</span>

//       </div>
//     </div>
//   );
// }