"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image"; 
import axios from "axios";
import { AiOutlineAudio, AiOutlineClockCircle, AiOutlineRead, AiOutlineStar } from "react-icons/ai";
import { BsBookmark } from "react-icons/bs";
import { HiOutlineLightBulb } from "react-icons/hi";
import { Book } from "@/lib/book";

//useAppDispatch — from lib/hooks.ts The typed hook that gives you the dispatch function to send actions to the Redux store
//useAppSelector — from lib/hooks.ts The typed hook that lets you read specific pieces of state from the Redux store — used to get state.auth.user
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
//openModal — from lib/slices/authSlice.ts The action creator that when dispatched sets modalOpen = true in Redux — which causes AuthModal to show
import { openModal } from "@/lib/slices/authSlice";

//useRouter — from next/navigation Next.js built-in hook that gives you the router object for programmatic navigation — used to redirect the user to the player page after clicking Read or Listen
import { useRouter } from "next/navigation";



const BASE_URL = "https://us-central1-summaristt.cloudfunctions.net/getBook";

const shimmer: React.CSSProperties = {
    background: "linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%)",
    backgroundSize: "200% 100%",
    animation: "shimmer 1.5s infinite",
    borderRadius: 4,
};

function BookDetailSkeleton() {
  return (
    <>
        {/* shimmer effect */}
      <style>{`@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`}</style>
      <div className="flex gap-4">
        <div className="w-full flex flex-col gap-4">
          <div style={{ ...shimmer, height: 36, width: "60%" }} />
          <div style={{ ...shimmer, height: 20, width: "30%" }} />
          <div style={{ ...shimmer, height: 20, width: "80%" }} />
          <div style={{ height: 1, background: "#e1e7ea", width: "100%" }} />
          <div className="flex flex-wrap gap-y-3">
            <div style={{ ...shimmer, height: 20, width: "40%", marginRight: 16 }} />
            <div style={{ ...shimmer, height: 20, width: "40%" }} />
            <div style={{ ...shimmer, height: 20, width: "40%", marginRight: 16 }} />
            <div style={{ ...shimmer, height: 20, width: "40%" }} />
          </div>
          <div style={{ height: 1, background: "#e1e7ea", width: "100%" }} />
          <div className="flex gap-4">
            <div style={{ ...shimmer, height: 48, width: 144 }} />
            <div style={{ ...shimmer, height: 48, width: 144 }} />
          </div>
          <div style={{ ...shimmer, height: 20, width: "40%" }} />
          <div style={{ ...shimmer, height: 16, width: "100%" }} />
          <div style={{ ...shimmer, height: 16, width: "95%" }} />
          <div style={{ ...shimmer, height: 16, width: "90%" }} />
          <div style={{ ...shimmer, height: 16, width: "100%" }} />
        </div>
        <div className="shrink-0">
          <div style={{ ...shimmer, width: 300, height: 300 }} />
        </div>
      </div>
    </>
  );
}

export default function BookDetailPage() {
    const { id } = useParams<{id: string}>();
    const [book, setBook] = useState<Book | null>(null);
    const [loading, setLoading] = useState(true);
    const [saved, setSaved] = useState(false);
    const [saving, setSaving] = useState(false);

    //Getting the messenger — so you can send actions to the Redux store like dispatch(openModal())
    const dispatch = useAppDispatch();
    //Reading from the store — checking if someone is logged in. user will be null if nobody is logged in or { uid, email } if someone is
    const user = useAppSelector((state) =>state.auth.user)
    const subscribed = useAppSelector((state) => state.auth.isSubscribed)
    //Getting the navigation tool — so you can redirect the user to another page like router.push("/player/123") after they click Read or Listen
    const router = useRouter();

    useEffect(()=> {
        if(!id) return;
        axios.get<Book>(BASE_URL, { params: { id }  })  
        .then((res) => setBook(res.data))
        .catch(console.error)
        .finally(()=> setLoading(false));
    }, [id]);

    const handleProtectedAction = (destination: string) => {
        if(!user) {
            dispatch(openModal()); // No user login detected - open the login modal
            return;
        }
        if(book?.subscriptionRequired && !subscribed){
            router.push(`/choose-plan`);
            return;
        }
            
        
        router.push(destination);// user is logged in — navigate to destination
        
    };
  
    const handleAddToLibrary = async () => {
        if(!user) {
            dispatch(()=> openModal())
        }

        if (!book || saving || saved) return;
        
        setSaving(true);
    }

    return (


      <section className="mx-auto w-full max-w-[1070px] px-6 py-10">
        {loading? (
            <BookDetailSkeleton />
        ) : book ? (
            <div className="flex gap-4">
                {/* Book details */}
                <div className="w-full text-[#032b41]">

                    <h1 className="text-[32px] font-bold mb-4">
                        {book.title}
                        {book.subscriptionRequired && (
                            <span className="ml-2 text-[14px] font-normal bg-[#032b41] text-white px-2 py-1 rounded-full">
                                Premium
                            </span>
                        )}
                    </h1>

                    <div className="font-bold mb-4">{book.author}</div>
                    <div className="text-[20px] font-light mb-6 pb-6 border-b border-[#e1e7ea]">
                        {book.subTitle}
                    </div>
                    
                    <div className="flex flex-wrap max-w-[400px] gap-y-3 mb-6 border-b border-[#e1e7ea] pb-4">
                        <div className="flex items-center w-1/2 gap-1 font-medium text-[14px] text-[#032b41]">
                            <div className="flex w-[24px] h-[24px]">
                                <AiOutlineStar className="w-full h-full"/>
                            </div>
                            <span>{book.averageRating} ({book.totalRating} ratings)</span>
                        </div>

                        <div className="flex items-center w-1/2 gap-1 font-medium text-[14px] text-[#032b41]">
                            <div className="flex w-[24px] h-[24px]">
                                <AiOutlineClockCircle className="w-full h-full" />
                            </div>
                            {/* TODO WILL BE IN 4.b */}
                            <span>03:23</span>
                        </div>
                        <div className="flex items-center w-1/2 gap-1 font-medium text-[14px] text-[#032b41]">
                            <div className="flex w-[24px] h-[24px]">
                                <AiOutlineAudio className="w-full h-full" />
                            </div>
                            <span>{book.type}</span>
                        </div>


                        <div className="flex items-center w-1/2 gap-1 font-medium text-[14px] text-[#032b41]">
                            <div className="flex w-[24px] h-[24px]">
                                <HiOutlineLightBulb className="w-full h-full" />
                            </div>
                            <span>{book.keyIdeas} Key Ideas</span>
                        </div>
                    </div>
                    

                    <div className="flex gap-4 mb-6">
                        {/* TODO — wire Read button to navigate to the reader view */}
                        <button 
                            onClick={() => handleProtectedAction(`/player/${id}`)}
                            className="flex items-center justify-center gap-2 bg-[#032b41] text-white w-[144px] h-[48px] rounded hover:opacity-80 transition-opacity"
                        >
                            <div className="flex w-[24px] h-[24px]">
                                <AiOutlineRead className="text-2xl"/>
                            </div>
                            <span>Read</span>
                        </button>
                        {/* TODO — wire Listen button to open AudioPlayer with book.audioLink */}
                        <button 
                            onClick={()=> handleProtectedAction(`/player/${id}`)}
                            className="flex items-center justify-center gap-2 bg-[#032b41] text-white w-[144px] h-[48px] rounded hover:opacity-80 transition-opacity"
                        >
                            <div className="flex w-[24px] h-[24px]">
                                <AiOutlineAudio className="text-2xl"/>
                            </div>
                            <span>Listen</span>
                        </button>
                    </div>
                    {/* TODO — wire to Firebase: save book.id to user's library in Firestore */}                
                    <button onClick={handleAddToLibrary} className="flex items-center gap-2 text-[#0365f2] font-medium text-[18px] mb-10 hover:text-[#044298] transition-colors">
                        <div className="flex w-[20px] h-[20px]">
                            <BsBookmark className="w-full h-full"/>
                        </div>
                        <span>Add Title to My Library</span>
                    </button>

                    <div className="mb-6">
                        <h2 className="text-[18px] font-bold text-[#032b41] mb-4">What's it about?</h2>
                        <div className="flex flex-wrap gap-4 mb-4">
                            {book.tags.map((tag)=> (
                                <span
                                    key={tag}
                                    className="bg-[#f1f6f4] px-4 h-[48px] flex items-center rounded font-medium text-[#032b41] cursor-not-allowed"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>

                        <p className="leading-[1.5] text-[#032b41] mb-4">
                            {book.bookDescription}
                        </p>
                    </div> 
                                    
                    <div>
                        <h2 className="text-[18px] font-bold text-[#032b41] mb-2">About the Author</h2>
                        <p className="leading-[1.5] text-[#032b41]">
                            {book.authorDescription}
                        </p>
                    </div>      
                </div>

                {/* Book Photo */}
                <div className="shrink-0">
                    <Image
                        className="w-[300px] h-[300px] object-contain"
                        src={book.imageLink}
                        alt={book.title}
                        width={300}
                        height={300}
                    />

                </div>
            </div>
            

        ) : (
            <div className="text-[#032b41]">Book not found.</div>
        )}

        {/* TODO — add <AudioPlayer src={book?.audioLink} /> here once wired up (feature 4.b) */}
        <audio src="https://firebasestorage.googleapis.com/v0/b/summarist.appspot.com/o/books%2Faudios%2Fthe-lean-startup.mp3?alt=media&amp;token=c2f2b1d4-eaf2-4d47-8c8a-7a8fd062a47e"></audio>

      </section>

  );
}