
"use client";

import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'next/navigation';
import Image from 'next/image';
import axios from 'axios';
import { BsPauseFill, BsPlayFill } from 'react-icons/bs';
import { RefreshIconLeft } from '@/public/assets/RefreshIconLeft';
import { RefreshIconRight } from '@/public/assets/RefreshIconRight';
import { Book } from '@/lib/book';
import Button from '@/components/Button';
import { useAppSelector } from '@/lib/hooks';
import { markBookFinished} from '@/lib/libraryService';
// you can just {SavedBookData } but using type have its advantages( guard clause = so that other dev don't use it as a value in places like console.log() which will cayse a crash)
// It enables smarter bundling (dead‑code elimination) so that both TypeScript and bundlers like Webpack, Vite, or Next.js knows it have no runtime, which will be dropped from the final bundle which generates a and smaller bundle often loads faster and executes faster
// Your Code (TypeScript)
        
//    BUILD TIME (Vite/Webpack/Next.js)
//    - Strips out all types
//    - Removes `import type` (no JS generated)
//    - Tree shakes dead code
//    - Bundles everything into plain JS files
        
//    RUNTIME (Browser/Node.js)
//    - Executes the plain JS bundle
//    - Types are completely gone at this point
//    - Only actual values/functions/objects exist
        
//    PRODUCTION
//    - Smaller bundle = faster load
//    - No type overhead
import type { SavedBookData } from '@/lib/libraryService';
import { finished } from 'stream';

function SkipBackIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" stroke="currentColor" className="w-[28px] h-[28px] stroke-white">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l-3-3m0 0L6 6m3 3H3m9 9a9 9 0 100-18" />
        </svg>
    )
}

function SkipForwardIcon () {
    return(
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" stroke="currentColor" className="w-[28px] h-[28px] stroke-white">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l3-3m0 0l3-3m-3 3H21m-9 9a9 9 0 110-18" />
        </svg>  
    )
}




const BASE_URL = "https://us-central1-summaristt.cloudfunctions.net/getBook";


export default function PlayerPage() {
    const {id} = useParams<{id: string }>();
    const [book, setBook] = useState<Book | null>(null);
    const [loading, setLoading] = useState(true);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    // this state is to keep track if a book was ever finished
    const [hasMarkedFinished, setHasMarkedFinished] = useState(false);
    
    const audioRef = useRef<HTMLAudioElement>(null);
    //stores the state of whether the user is authorized (logged in)
    const user = useAppSelector((state)=> state.auth.user);
    
    const formatTime = (time: number) => {
        const minutes = Math.floor(time/60);
        const seconds = Math.floor(time % 60);
        return `${minutes < 10? ("0" + minutes) : minutes}:${seconds < 10? ("0" + seconds):seconds}`;
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

    // Mark finished when audio ends

    const handleEnded = async () => {
        
        setIsPlaying(false);
        // !user =  is not logged in, 
        // !book = if null(because no book object which is needed to construct SavedBookData object below)
        // hasMarkedFinished = true (his is your "already done" flag. Without it,  in rare cases will fire multiple times, so this guard clause already marked this book as finished in this session → skip to avoid a duplicate write)
        // this guard clause for hasMarkedFinished will return to prevent duplications and multiple calls when it is already marked(set to true)
        if (!user || !book || hasMarkedFinished) return;
        // if user =true, book = true( have an object),  hasMarkedFinished =  false (no book marks)
        setHasMarkedFinished(true);
        //now define the bookData using SavedBookData
        const bookData: SavedBookData = {
            id,
            title: book.title,
            author:book.author,
            subTitle: book.subTitle,
            imageLink: book.imageLink,
            audioLink: book.audioLink,
            averageRating: book.averageRating,
            subscriptionRequired: book.subscriptionRequired,
            savedAt: new Date().toISOString(),
        };
        try{
            await markBookFinished(user.uid, {...bookData, finishedAt: new Date().toISOString()});
            console.log("Book marked as finished!");
        }catch(err) {
            console.error('Error Marking book finished: ', err);
        }
    };

    

    useEffect(()=> {
        if(!id) return;
        axios
            .get<Book>(BASE_URL, { params: { id} })
            .then((res) => setBook(res.data))
            .catch(console.error)
            .finally(()=> setLoading(false));
    },[id])

    const progressPercent = duration ? (currentTime/duration) * 100 : 0;

    if (!book) return null; // Returns a blank page or return a skeleton

  return (
  <>
    {/* Scrollable summary area */}
    <div className="relative w-full overflow-y-auto h-[calc(100vh-160px)] max-md:h[calc(100vh-260px)]">
        <div className='whitespace-pre-line p-6 max-w-[800px] mx-auto'>
            <h2 className='text-[#032b41] text-[24px] border-b border-[#e1e7ea] mb-8 pb-4 leading-normal'>
                {book?.title}
            </h2>
            <p className='whitespace-pre-line leading-[1.4] text-[#032b41]'>
                {book?.summary}
            </p>
        </div>
        </div>
        {/* Fixed audio bar to bottom  and AUDIOTRACK Wrapper for */} 
        <div className="flex w-full h-[80px] max-md:max-w-full flex items-center justify-between bg-[#042330] px-10 fixed bottom-0 left-0 z-[9998] max-md:h-[180px] max-md:flex-col max-md:px-6 max-md:py-4">
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
                        <BsPauseFill className={`text-[#042330] text-[20px]`} />
                        :
                        <BsPlayFill className={`text-[#042330] ml-1 text-[20px]`} />
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
        <audio 
            ref={audioRef} 
            src={book?.audioLink || ""} 
            onTimeUpdate={handleTimeUpdate} 
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={handleEnded}
        />
    )}
  </>
  )
}



