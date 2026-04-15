"use client";

import Link from "next/link";
import Image from "next/image";
import { AiFillStar, AiOutlineClockCircle } from "react-icons/ai";
import { useEffect, useRef, useState } from "react";
import axios from "axios";

export interface BookProps {
  id: string;
  title: string;
  author: string;
  subTitle: string;
  image: string;
  audioLink: string;
  rating: string;
  subscriptionRequired?: boolean;
}

const formatDuration = (seconds: number ): string => {
  //security check to ensure that if it isn't a number then return 0:00 instead
  if(isNaN(seconds)) return "0:00"
  //converts all success division of 60 into minutes
  const mins = Math.floor(seconds / 60);
  //checks for any left over and converts it into left over seconds
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" + secs : secs}`;
}

const BookCard = ({
  id, 
  title, 
  author, 
  subTitle, 
  image, 
  audioLink, 
  rating, 
  subscriptionRequired 
}: BookProps) => {  
  //when the document loads we will set it based on whether it is a number or null but default will be null
  const [duration, setDuration] = useState<number | null>(null);


  useEffect(()=> {
    // Creates a new HTML5 Audio element in JavaScript only in memory (not visible on the page)
    const audio = new Audio(audioLink);
    
    ///This creates a function named onLoadedMetadata that is stored. It doesn't run yet – it's just defined and ready to be used.
    const onLoadedMetadata = () => {
      //setting the "duration" state to the audio's duration in seconds
      setDuration(audio.duration);
    }
    //handles an error incase it fails to load
    const onError = () => {
      console.error(`Failed to load audio duration for: ${title}`);
      //when error is called then it sets "duration" state to 0 as a fallback
      setDuration(0);//fallback
    }
    //on this audio element - attach or addEventListner that listens to only  when 'loadedmetadata' event occurs  and if or when it occurs, then run "onLoadedMetadata"
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    // add another addEventListner that listens to only  when 'error' event occurs(when an error happens)  and if or when it occurs, then run "onError"
    audio.addEventListener("error", onError);

    //  This is the trigger that actually starts the audio file loading process
    // this should only fire after the audio element is set up so that the listeners can catch them since the listeners already attached to audio
    //otherwise it will fetch it before listeners are added which will result in nothing
    audio.load();// "OK, now go fetch the actual file!"

    // this is going to be the cleanup phase
    //this is to reset memory so that it doesnt build up and cause a memory leak(memory builds up over time if the memory isn't realeased back into the system)
    return () => {
       audio.removeEventListener('loadedmetadata', onLoadedMetadata);        
       audio.removeEventListener("error", onError);
       audio.src = "";//this release memories
    }

  },[audioLink, title])

    
  const metadata = [
    {
      icon: <AiOutlineClockCircle className="text-lg" />, 
      value: duration === null ? "..." : formatDuration(duration), 
    },
    {
      icon: <AiFillStar className="text-lg text-[#f5c518]" />, 
      value: rating
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

      {/* Image Wrapper */}
      <figure className="w-[172px] h-[172px]">
        <Image
          src={image}
          alt={title}
          width={172}
          height={172}
          className="object-cover"
        />
      </figure>

      {/* Book Info */}
      <div className="text-[16px] font-bold text-[#032b41] line-clamp-2 leading-tight">
        {title}
      </div>
      <div className="text-[14px] text-[#6b757b] font-light">{author}</div>
      <div className="text-[14px] text-[#394547] line-clamp-2 font-light">
        {subTitle}
      </div>
      {/* Metadata */}
      <div className="flex items-center gap-2 mt-auto pt-2">
        
        {metadata.map(({ icon, value}, idx)=> (
          <div key={idx} className="flex items-center gap-1 text-[14px] font-light text-[#6b757b]">
            {icon}
            <span>{value}</span>
          </div>
        ))}

      </div>
    </Link>

  )
}

export default BookCard;
