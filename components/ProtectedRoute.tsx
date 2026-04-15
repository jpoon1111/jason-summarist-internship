/// Using Protected Route Pattern that applies to any page where the content requires authentication like login

// "use client" directive - Required because the page uses hooks (useAppSelector, useAppDispatch, useEffect)

// Check user state - Use useAppSelector((state) => state.auth.user) to get the current user

// Handle loading state - Check state.auth.loading to show a loading spinner while Firebase determines auth status

// Open modal if not logged in - Dispatch openModal() when !user to show the login modal

// Show content when logged in - Only render library content when user exists

// The auth flow follows the same pattern as your book/[id]/page.tsx and (main)/layout.tsx files.


"use client";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { openModal } from "@/lib/slices/authSlice";
import { useEffect } from "react";
import loginImage from '@/public/assets/login.png';
import Image from 'next/image';


interface ProtectedRouteProps{
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

export default function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
    
    const user = useAppSelector((state)=> state.auth.user);
    const loading = useAppSelector(state => state.auth.loading);
    const dispatch = useAppDispatch();

    useEffect(()=> {
        if (!loading && !user){
            dispatch(openModal());
        }
    }, [user, loading, dispatch])

    if(loading){
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="text-[#032b41]">Loading...s</div>
            </div>
        )
    }
        
    if(!user) {
        if(fallback) {
            return<>{fallback}</>;
        }
        
        return (
            <div className='max-w-[1070px] w-full mx-auto px-4 sm:px-6'>
            <div className='py-8 sm:py-10 w-full'>
                <div className='max-w-[460px] w-full sm:max-w-[460px] flex flex-col items-center mx-auto'>
                <Image 
                    src={loginImage} 
                    width={1033}
                    height={712}
                    alt="login"
                    className='w-full h-auto'
                />
                <div className='text-xl sm:text-2xl font-bold text-[#032b41] text-center mb-3sm:mb-4'>
                    Log in to your account to see your library.
                </div>
                <button
                    onClick={()=> dispatch(openModal())}
                    className='bg-[#2bd97c] hover:bg-[#20ba68] text[#032b41] w-full h-10 text-base transition-colors duration-200 flex items-center justify-center min-w-[180px] active:translate-y-px'
                >
                    Login
                </button>
                </div>
            </div>
            </div>
        );
    
    }


//------------------------
  return (
    <>{children}</>
  )
}
