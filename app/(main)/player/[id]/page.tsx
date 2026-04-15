
"use client";

import { Book } from '@/lib/book';
import Button from '@/components/Button';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react'
import { BsPauseFill, BsPlayFill } from 'react-icons/bs';
import { RefreshIconLeft } from '@/public/assets/RefreshIconLeft';
import { RefreshIconRight } from '@/public/assets/RefreshIconRight';
import axios from 'axios';

const BASE_URL = "https://us-central1-summaristt.cloudfunctions.net/getBook";


export default function PlayerPage() {
    const {id} = useParams<{id: string }>();
    const [book, setBook] = useState<Book | null>(null);
    const [loading, setLoading] = useState(true);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    
    const audioRef = useRef<HTMLAudioElement>(null);
    
    

    const formatTime = (time: number) => {
        const minutes = Math.floor(time/60);
        const seconds = Math.floor(time % 60);
        return `${minutes < 10? ("0" + minutes) : minutes} : ${seconds < 10? ("0" + seconds) : seconds}`;
    }
    const togglePlay = () => {
        
        if(!audioRef.current) return;
        
        if(isPlaying) {
            audioRef.current.pause();

        } else {
            audioRef.current.play();
        }

        setIsPlaying(!isPlaying);
    };

    const handleskip = (seconds: number) => {
        
        if (!audioRef.current) return;

        audioRef.current.currentTime += seconds;
    }

    const handleTimeUpdate = () => {
        if(!audioRef.current) return;
        
        setCurrentTime(audioRef.current.currentTime);
    };

    const handleLoadedMetadata = () => {
        if(!audioRef.current) return;
        setDuration(audioRef.current.duration);
    }

    const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(!audioRef.current) return;
        audioRef.current.currentTime = Number(e.target.value);
        setCurrentTime(Number(e.target.value));
    }

    const progressPercent = duration ? (currentTime/duration) * 100 : 0;

    useEffect(()=> {
        if(!id) return;
        axios.get<Book>(BASE_URL, { params: { id} })
        .then((res) => setBook(res.data))
        .catch(console.error)
        .finally(()=> setLoading(false));
    },[id])


    if (!book) return null; // Returns a blank page or return a skeleton

  return (
  <>
    {/* Scrollable summary area */}
    <div className="relative w-full overflow-y-auto h-[calc(100vh-160px)] max-md-h[calc(100vh-260px)]">
        <div className='whitespace-pre-line p-6 max-w-[800px] mx-auto'>
            <h2 className='text-[#032b41] text-[24px] border-b border-[#e1e7ea] mb-8 pb-4 leading-normal'>
                {book?.title}
            </h2>
            <p className='whitespace-pre-line leading-[1.4] text-[#032b41]'>
                {book?.summary}
            </p>
        </div>
        </div>
        {/* Fixed audio bar at bottom AUDIOTRACK Wrapper */} 
        <div className="flex w-full h-[80px] max-md:max-w-flex items-center justify-between bg-[#042330] px-10 fixed bottom-0 left-0 z-[9998] max-md:h-[180px] max-md:flex-col max-md:px-6 max-md:py-4">
        {/* Track info */}
        <div className='flex gap-3 w-full sm:w-[calc(100%/3)] items-center'>
            <figure className='flex max-w-[48px] min-w-[48px] min-h-[48px] max-h-[48px]'>
                {book?.imageLink && (
                        <Image src={book?.imageLink || ""} alt="book" className='w-full h-full min-w-[48px]' width={48} height={48}/>  
                )}
            </figure>
            <div className='text-[#fff] text-[14px] flex flex-col gap-0 justify-center'>
                <p>{book?.title}</p>
                <span className='text-[#bac8ce]'>{book?.author}</span>
            </div>
        </div>
    

        {/* Controls */}
        <div className='flex items-center justify-center gap-6 sm:w-[calc(100%/3)]'>
            <Button onClick={()=> handleskip(-10)} className="rounded-full cursor-pointer flex items-center justify-center">
                <RefreshIconLeft className='w-[28px] h-[28px] stroke-[#fff] ' />
            </Button>

            <Button onClick={togglePlay} className={`flex items-center justify-center bg-[#fff] rounded-full w-[40px] h-[40px] cursor-pointer`}>
                {
                    isPlaying ?
                        <BsPauseFill className={`text-[#042330]`} size={32}/>
                        :
                        <BsPlayFill className={`text-[#042330] ml-1`} size={32}/>
                }
            </Button>

            <Button onClick={()=> handleskip(10)} className={`rounded-full cursor-pointer flex items-center justify-center`}>
                <RefreshIconRight className='w-[28px] h-[28px] stroke-[#fff]'/>
            </Button>
        </div>
        
            {/* Progress bar */}
            <div className='flex items-center gap-4 w-full sm:w-[calc(100%/3)]'>
                <span className='text-[#fff] text-[14px] whitespace-nowrap'>{formatTime(currentTime)}</span>
                <input 
                    type="range"
                    min={0}
                    max={duration}
                    value={currentTime}
                    onChange={handleProgressChange}
                    className='rounded-sm h-[4px] max-w-[300px] w-full cursor-pointer outline-none appearance-none'
                    style={{background: `linear-gradient(to right, #2bd97c ${progressPercent}%, #6d787d ${progressPercent}%)`}}
                />
                <span className='text-[#fff] text-[14px] whitespace-nowrap'>{formatTime(duration)}</span>
            </div>
    </div>
    {book?.audioLink && (
        <audio ref={audioRef} src={book?.audioLink || ""} onTimeUpdate={handleTimeUpdate} onLoadedMetadata={handleLoadedMetadata}/>
    )}
  </>
  )
}



