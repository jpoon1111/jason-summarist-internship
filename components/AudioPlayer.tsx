import React from 'react'

export default function AudioPlayer({ audioLink, imageLink, title, author, onEnded}: AudioPlayerProps) {

  return (
    <div className='w-full h-20 mt-auto flex items-center justify-between bg-[#042330] px-10 fixed b-0 l-0 z-[9998]'>
        <audio ref={} src={} />
        {/* Track Info — width: calc(100% / 3) */}
        <div className='w-1/3 flex gap-4'>
            <figure className='flex max-w-12'>
                <figure className='h-[48px] w-[48px] min-w-[48px]'>
                    {imageLink &&}
                </figure>

            </figure>
        </div>
    </div>
  )
}

