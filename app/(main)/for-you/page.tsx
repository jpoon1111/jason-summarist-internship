"use client";

import Image from "next/image";
import BookCard from "@/components/BookCard";
import { BsFillPlayFill } from "react-icons/bs";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";


interface Book {
    id:string;
    title:string;
    author: string;
    subTitle: string;
    imageLink: string;
    audioLink: string;
    totalRating: number;
    averageRating:number;
    keyIdeas: number;
    type:string;
    status:string;
    subscriptionRequired: boolean;
    summary: string;
    tags: string[];
    bookDescription: string;
    authorDescription: string;
}

// ── BASE URL ───────────────────────────────────────────────────────────────────
// All three fetches hit the same endpoint — axios appends ?status=... via params

const BASE_URL = "https://us-central1-summaristt.cloudfunctions.net/getBooks";

// ── SHIMMER STYLE ──────────────────────────────────────────────────────────────
// Replicates the moving-gradient shimmer from the design template.
// Applied as an inline style on every skeleton block.
const shimmer:React.CSSProperties = {
    background: "linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75% )",
    backgroundSize: "200% 100%",
    animation: "shimmer 1.5s infinite",
    borderRadius: 4,     
};

// ── SKELETON: SELECTED JUST FOR YOU ───────────────────────────────────────────

function SelectedBookSkeleton(){
    return (
        <>
        <style>{`@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`}</style>
        <div
            style={{background: "#fdf3e7", maxWidth: 800 }}
            className="flex items-center gap-5 p-6 mb-6 rounded-sm h-[180px]"
        >
            <div className=" flex flex-1 flex-col gap-3">
                <div style={{...shimmer, height:20, width: "80%"}} />
                <div style={{...shimmer, height:20, width: "60%"}} />
                <div style={{...shimmer, height:15, width: "40%"}} />
            </div>

            <div style={{...shimmer, width: 120, height: 160, flexShrink: 0 }} />

        </div>
        </>
    );
}

// ── SKELETON: SINGLE BOOK CARD (recommended / suggested) ──────────────────────

function BookRowSkeleton(){
    return (
        <div className="min-w-[180px] w-[180px] flex flex-col gap-2">
            <div style={{ ...shimmer, width: "100%", height:240 }}/>
            <div style={{ ...shimmer, height: 12, width: "90%" }}/>
            <div style={{ ...shimmer, height: 12, width: "50%" }}/>
        </div>
    );
}



export default function ForYouPage() {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [recommended, setRecommended] = useState<Book[]>([]);
  const [suggested, setSuggested] = useState<Book[]>([]);

  const [loadingSelected, setLoadingSelected] = useState(true);
  const [loadingRecommended, setLoadingRecommended] = useState(true);
  const [loadingSuggested, setLoadingSuggested] = useState(true);

// All three fetches fire in parallel — no waterfall delay
  useEffect(()=> {
    axios.get(BASE_URL, {params: {status: "selected"} })
    .then((res) => setSelectedBook(res.data))
    .catch(console.error)
    .finally(()=> setLoadingSelected(false));
    
    axios.get(BASE_URL, {params: {status: "recommended"}})
    .then((res) => setRecommended(res.data))
    .catch(console.error)
    .finally (()=>setLoadingRecommended(false));

    axios.get(BASE_URL, { params: {status: "suggested"}})
    .then((res) => setSuggested(res.data))
    .catch(console.error)
    .finally(()=> setLoadingSuggested(false));
  }, []);



  return (
    <div className="max-w-[1070px] w-full mx-auto px-6">
      <div className="py-10 w-full">
        {loadingSelected ? (
          <>
            <div style={{ ...shimmer, height: 24, width: 150, marginBottom: 20}} />
            <SelectedBookSkeleton />
          </>
        ) : selectedBook ? (
          <>
            <h2 className="text-[22px] font-bold text-[#032b41] mb-4">
            Selected just for you
          </h2>
          
          <audio 
            src="https://firebasestorage.googleapis.com/v0/b/summaristt.appspot.com/o/books%2Faudios%2Fthe-lean-startup.mp3?alt=media&token=c2f2b1d4-eaf2-4d47-8c8a-7a8fd062a47e"
          />
          
          <Link
            href={`/book/${selectedBook.id}`}
            className="flex justify-between w-full md:w-2/3 bg-[#fbefd6] rounded-sm p-6 mb-6 gap-6 no-underline text-inherit hover:bg-[#f3e4c8] transition-colors"
          >
            <div className="text-[#032b41] w-[40%]">
              How Constant Innovation Creates Radically Successful Businesses
            </div>
            <div className="w-[1px] bg-[#bac8ce]"></div>
            <div className="flex gap-4 width-[60%]">
              <figure className="w-[140px] h-[140px] min-w-[140px]">
                <Image
                  src="https://firebasestorage.googleapis.com/v0/b/summaristt.appspot.com/o/books%2Fimages%2Fthe-lean-startup.png?alt=media&token=087bb342-71d9-4c07-8b0d-4dd1f06a5aa2"
                  alt="book"
                  width={140}
                  height={140}
                  className="w-full h-full"
                />
              </figure>
              
              <div className="w-full">
                <h3 className="font-semibold text-[#032b41] mb-2 text-lg]">The Lean Startup</h3>
                <div className="text-[#394547] text-[14px] mb-4 font-light">Eric Ries</div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-10 h-10 bg-black rounded-full pl-[3px]">
                    <BsFillPlayFill className="text-white text-2xl"/>
                  </div>
                  <div className="text-[14px] font-medium text-[#032b41]">3 mins 23 secs</div>
                </div>
              </div>
            </div>
          </Link>
          </>
        ) : null}
    </div>    

        
        <div className="mb-8">
          
          {/* Recommened for you */}
          {loadingRecommended ? (
            <div style={{ ...shimmer, height:24, width: 150, marginBottom: 20}}/>
          ) : (
            <>
              <h2 className="text-[22px] font-bold text-[#032b41]">Recommended For You</h2>
              <p className="text-sm text-[#394547] mb-4">We think you’ll like these</p>

            </>
          )}
          
          <div className="flex overflow-x-auto no-scrollbar gap-4 snap-x snap-mandatory mb-8">
            {loadingRecommended ? (
              new Array(7).fill(null).map((_, i) => <BookRowSkeleton key={i} />)
            ) : (
              recommended.map(book=>(
                <BookCard
                  key={book.id}
                  id={book.id}
                  title={book.title}
                  author={book.author}
                  subTitle={book.subTitle}
                  image={book.imageLink}
                  audio={book.audioLink}
                  duration="" //filled in feature 4.b
                  rating={String(book.averageRating ?? "")}
                  subscriptionRequired={book.subscriptionRequired}
                />
              )
            ))}
            
          </div>
          
          <div className="mb-8">
            {loadingSuggested ? (
                <div style={{...shimmer, height: 24, width: 150, marginBottom: 20}} />
            ) : (
              <>
                <h2 className="text-[22px] font-bold text-[#032b41] mb-4">
                  Suggested Books
                </h2>
                <p className="font-light text-[#394547] mb-4 text-sm">
                  Browse these curated picks
                </p>
              </>
            )}
            <div className="flex overflow-x-auto no-scrollbar gap-4 snap-x snap-mandatory mb-8">
              {loadingSuggested?
                  Array.from({ length: 7}).map((_,i)=> <BookRowSkeleton key={i} /> 
                ) : (
                  suggested.map(book=>(
                    <BookCard 
                      key={book.id}
                      id={book.id}
                      title={book.title}
                      author={book.author}
                      subTitle={book.subTitle}
                      image={book.imageLink}
                      audio={book.audioLink}
                      duration="" // filled in 4.b
                      rating={String(book.averageRating ?? "")}
                      subscriptionRequired= {book.subscriptionRequired}
                    />
                  ))
                )
              }
            </div>
          </div>
          
      </div>
    </div>
  );
}
