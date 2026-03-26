"use client";

import { Book } from '@/lib/book';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';

const BASE_URL = "https://us-central1-summaristt.cloudfunctions.net/getBook";

export default function PlayerPage() {
    const { id } = useParams<{ id: string }>();
    const [book, setBook] = useState<Book | null>(null);
    const [loading, setLoading] = useState(true);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    const audioRef = useRef<HTMLAudioElement>(null);

    const formatTime = (time: number) => {
        if (isNaN(time) || time === 0) return "00:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes < 10 ? "0" + minutes : minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
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
        audioRef.current.currentTime = Math.max(
            0,
            Math.min(audioRef.current.currentTime + seconds, duration)
        );
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
        const value = Number(e.target.value);
        audioRef.current.currentTime = value;
        setCurrentTime(value);
    };

    const handleEnded = () => {
        setIsPlaying(false);
        setCurrentTime(0);
        if (audioRef.current) audioRef.current.currentTime = 0;
    };

    const progressPercent = duration ? (currentTime / duration) * 100 : 0;

    useEffect(() => {
        if (!id) return;
        axios
            .get<Book>(BASE_URL, { params: { id } })
            .then((res) => setBook(res.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) {
        return (
            <div className="audio__book--spinner">
                <svg stroke="currentColor" fill="none" strokeWidth="0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z" opacity=".5"/>
                    <path d="M20 12h2A10 10 0 0 0 12 2v2a8 8 0 0 1 8 8z"/>
                </svg>
            </div>
        );
    }

    if (!book) return null;

    return (
        <div className="summary">
            {/* Scrollable book summary */}
            <div className="audio__book--summary">
                <div className="audio__book--summary-title">
                    <b>{book.title}</b>
                </div>
                <div className="audio__book--summary-text">
                    {book.summary}
                </div>
            </div>

            {/* Fixed audio player bar — matches .audio__wrapper in globals.css */}
            <div className="audio__wrapper">

                {/* LEFT third: track info */}
                <div className="audio__track--wrapper">
                    <figure className="audio__track--image-mask">
                        <figure
                            className="book__image--wrapper"
                            style={{ height: 48, width: 48, minWidth: 48 }}
                        >
                            {book.imageLink && (
                                <Image
                                    className="book__image"
                                    src={book.imageLink}
                                    alt="book"
                                    width={48}
                                    height={48}
                                    style={{ display: "block" }}
                                />
                            )}
                        </figure>
                    </figure>
                    <div className="audio__track--details-wrapper">
                        <div className="audio__track--title">{book.title}</div>
                        <div className="audio__track--author">{book.author}</div>
                    </div>
                </div>

                {/* CENTER third: playback controls */}
                <div className="audio__controls--wrapper">
                    <div className="audio__controls">

                        {/* Rewind 10s — matches the reference's "rewind" SVG */}
                        <button
                            className="audio__controls--btn"
                            onClick={() => handleSkip(-10)}
                            aria-label="Rewind 10 seconds"
                        >
                            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                <path fill="none" stroke="#000" strokeWidth="2" d="M3.11111111,7.55555556 C4.66955145,4.26701301 8.0700311,2 12,2 C17.5228475,2 22,6.4771525 22,12 C22,17.5228475 17.5228475,22 12,22 L12,22 C6.4771525,22 2,17.5228475 2,12 M2,4 L2,8 L6,8 M9,16 L9,9 L7,9.53333333 M17,12 C17,10 15.9999999,8.5 14.5,8.5 C13.0000001,8.5 12,10 12,12 C12,14 13,15.5000001 14.5,15.5 C16,15.4999999 17,14 17,12 Z M14.5,8.5 C16.9253741,8.5 17,11 17,12 C17,13 17,15.5 14.5,15.5 C12,15.5 12,13 12,12 C12,11 12.059,8.5 14.5,8.5 Z" />
                            </svg>
                        </button>

                        {/* Play / Pause */}
                        <button
                            className="audio__controls--btn audio__controls--btn-play"
                            onClick={togglePlay}
                            aria-label={isPlaying ? "Pause" : "Play"}
                        >
                            {isPlaying ? (
                                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M96 448V64h112v384zm208 0V64h112v384z" />
                                </svg>
                            ) : (
                                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" className="audio__controls--play-icon" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M96 448l320-192L96 64v384z" />
                                </svg>
                            )}
                        </button>

                        {/* Forward 10s — matches the reference's "forward" SVG */}
                        <button
                            className="audio__controls--btn"
                            onClick={() => handleSkip(10)}
                            aria-label="Forward 10 seconds"
                        >
                            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                <path fill="none" stroke="#000" strokeWidth="2" d="M20.8888889,7.55555556 C19.3304485,4.26701301 15.9299689,2 12,2 C6.4771525,2 2,6.4771525 2,12 C2,17.5228475 6.4771525,22 12,22 L12,22 C17.5228475,22 22,17.5228475 22,12 M22,4 L22,8 L18,8 M9,16 L9,9 L7,9.53333333 M17,12 C17,10 15.9999999,8.5 14.5,8.5 C13.0000001,8.5 12,10 12,12 C12,14 13,15.5000001 14.5,15.5 C16,15.4999999 17,14 17,12 Z M14.5,8.5 C16.9253741,8.5 17,11 17,12 C17,13 17,15.5 14.5,15.5 C12,15.5 12,13 12,12 C12,11 12.059,8.5 14.5,8.5 Z" />
                            </svg>
                        </button>

                    </div>
                </div>

                {/* RIGHT third: progress bar + time labels */}
                <div className="audio__progress--wrapper">
                    <div className="audio__time">{formatTime(currentTime)}</div>
                    <input
                        type="range"
                        className="audio__progress--bar"
                        min={0}
                        max={duration || 100}
                        value={currentTime}
                        step={0.1}
                        onChange={handleProgressChange}
                        style={{
                            background: `linear-gradient(to right, rgb(43, 217, 124) ${progressPercent}%, rgb(109, 120, 125) ${progressPercent}%)`,
                        }}
                    />
                    <div className="audio__time">{formatTime(duration)}</div>
                </div>

            </div>

            {/* Hidden audio element */}
            {book.audioLink && (
                <audio
                    ref={audioRef}
                    src={book.audioLink}
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    onEnded={handleEnded}
                />
            )}
        </div>
    );
}