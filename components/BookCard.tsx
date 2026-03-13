"use client";

import Link from "next/link";
import Image from "next/image";
import { AiFillStar, AiOutlineClockCircle } from "react-icons/ai";

interface BookProps {
  id: string;
  title: string;
  author: string;
  subTitle: string;
  image: string;
  audio: string;
  duration: string;
  rating: string;
  subscriptionRequired?: boolean;
}

const BookCard = ({id, title, author, subTitle, image, duration, rating, subscriptionRequired }: BookProps) => {
  const metadata = [
    {icon: <AiOutlineClockCircle className="text-lg" />, value: duration },
    {icon: <AiFillStar className="text-lg text-[#f5c518]" />, value: rating},
  ];

  return (
    <Link
      href={`/book/${id}`}
      className="relative snap-start pt-8 px-3 pb-3 no-underline rounded max-w-[200px] w-full min-w-[172px] min-h-[340px] flex flex-col gap-2 hover:bg-[#f1f6f4] transition-colors"
    >
      {subscriptionRequired && (
        <div className="absolute top-0 right-0 z-10 bg-[#032b41] text-white text-[10px] px-[8px] h-[18px] rounded-[20px]">
          Premium
        </div>
      )}
      
      {/* Image Wrapper */}
      <div className="w-[172px] h-[172px]">
        <Image
          src={image}
          alt={title}
          width={172}
          height={172}
          className="object-cover"
        />
      </div>

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
        {metadata.map(({ icon, value})=> (
          <div key={value} className="flex items-center gap-1 text-[14px] font-light text-[#6b757b]">
            {icon}
            <span>{value}</span>
          </div>
        ))}
      </div>
    </Link>

  )
}

export default BookCard;
