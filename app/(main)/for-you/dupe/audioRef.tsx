"use client";

import Link from "next/link";
import Image from "next/image";
import { AiFillStar, AiOutlineClockCircle } from "react-icons/ai";
import { useEffect, useState } from "react";

interface BookProps {
  id: string;
  title: string;
  author: string;
  subTitle: string;
  image: string;
  audioLink: string;
  // duration: string;   // ❌ removed – we get it from audioLink
  rating: string;
  subscriptionRequired?: boolean;
}

// Helper: seconds → "MM:SS"
const formatDuration = (seconds: number): string => {
  if (isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" + secs : secs}`;
};

const BookCard = ({
  id,
  title,
  author,
  subTitle,
  image,
  audioLink,
  rating,
  subscriptionRequired,
}: BookProps) => {
  const [duration, setDuration] = useState<number | null>(null);

  useEffect(() => {
    const audio = new Audio(audioLink);

    const onLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const onError = () => {
      console.error(`Failed to load audio duration for: ${title}`);
      setDuration(0); // fallback
    };

    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("error", onError);
    audio.load(); // start loading metadata

    return () => {
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("error", onError);
      audio.src = ""; // release memory
    };
  }, [audioLink, title]);

  const metadata = [
    {
      icon: <AiOutlineClockCircle className="text-lg" />,
      value: duration === null ? "..." : formatDuration(duration),
    },
    {
      icon: <AiFillStar className="text-lg text-[#f5c518]" />,
      value: rating,
    },
  ];

  return (
    <Link
      href={`/book/${id}`}
      className="relative snap-start pt-8 px-3 pb-3 no-underline rounded max-w-[200px] w-full flex flex-col gap-2 hover:bg-[#f1f6f4] transition-colors"
    >
      {subscriptionRequired && (
        <div className="absolute top-0 right-0 z-10 bg-[#032b41] text-white text-[10px] px-[8px] h-[18px] rounded-[20px]">
          Premium
        </div>
      )}

      <figure className="w-[172px] h-[172px]">
        <Image
          src={image}
          alt={title}
          width={172}
          height={172}
          className="object-cover"
        />
      </figure>

      <div className="text-[16px] font-bold text-[#032b41] line-clamp-2 leading-tight">
        {title}
      </div>
      <div className="text-[14px] text-[#6b757b] font-light">{author}</div>
      <div className="text-[14px] text-[#394547] line-clamp-2 font-light">
        {subTitle}
      </div>

      <div className="flex items-center gap-2 mt-auto pt-2">
        {metadata.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center gap-1 text-[14px] font-light text-[#6b757b]"
          >
            {item.icon}
            <span>{item.value}</span>
          </div>
        ))}
      </div>
    </Link>
  );
};

export default BookCard;






Key improvements
loadedmetadata event – waits until the audio file’s duration is known.

Error handling – prevents broken audio links from breaking the UI.

Cleanup – removes event listeners and releases the audio object to avoid memory leaks.

Duration formatting – converts seconds to MM:SS format (e.g., 3:45).

Loading state – shows ... while duration is being fetched.

Unique keys – uses idx instead of value+1 (safer).

⚠️ Note: The duration prop from BookProps is no longer used. 
If you still need it as a fallback (when audio fails to load), 
you can replace "..." with propsDuration (passed as duration prop). 
But the code above prioritises the actual audio duration.

const [duration, setDuration] = useState<number>(() => {
  const parsed = parseFloat(propsDuration);
  return isNaN(parsed) ? 0 : parsed;
});