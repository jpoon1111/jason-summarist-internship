"use client";

import { useAppSelector } from "@/lib/hooks";
import Image from "next/image";
import loginImage from "@/public/assets/login.png";
import { useDispatch } from "react-redux";
import { openModal } from "@/lib/slices/authSlice";
import Link from "next/link";



function Settings() {
    const dispatch = useDispatch();
    const user = useAppSelector((state) => state.auth.user);
    const loading = useAppSelector((state) => state.auth.loading);
    const subscribed = useAppSelector((state) => state.auth.isSubscribed);

    // check for loading
    if(loading) {
        return (
            <div className="py-10 w-full">
                <div className="max-w-[1070px] w-full mx-auto px-6">
                    <div className="text-[32px] text-[#032b41] font-bold mb-8 pb-4 text-left border-b border-[#e1e7ea]">Settings</div>
                    <div className="text-[#032b41]">Loading...</div>
                </div>
            </div>
        );
    }

    if(!user){
        return(
            <div className="py-10 w-full">
                <div className="max-w-[1070px] w-full mx-auto py-6">
                    
                    <div className="text-[32px] text-[#032b41] font-bold mb-8 pb-4 text-left border-b border-[#e1e7ea]">Settings</div>
                    
                    {/* .settings__login--wrapper */}
                    <div className="max-w-[460px] flex flex-col items-center mx-auto">
                            <Image src={loginImage} alt='login' width={1033} height={712} loading="lazy" className="w-full h-full"/>
                            <div className="text-2xl font-bold text-[#032b41] text-center mb-4">
                                Log in to your account to see your details.
                            </div>
                        
                        {/* Login button  */}
                        <button
                            onClick={() => dispatch(openModal())}
                            className="bg-[#2bd97c] text-[#032b41] w-[100px] h-[40px] rounded-sm text-[16px] border-none cursor-pointer flex items-center justify-center"
                        >
                            Login
                        </button>
                    </div>
                </div>

            </div>
            
        );
    }

    return (
        <div className="py-10 w-full">
            <div className="max-w-[1070px] w-full mx-auto px-6">

                <div className="text-[32px] text-[#032b41] font-bold mb-8 text-left border-b  border-[#e1e7ea] pb-4">
                    Settings
                </div>

                <div className="flex flex-col items-start gap-2 mb-8 border-b border-[#e1e7ea] pb-6">
                    <div className="text-[18px] font-bold text-[#032b41]">Your Subscription plan</div>  
                    <div className="text-[#032b41]">{ subscribed ? "Premium" : "Basic"}</div>
                    {!subscribed && (
                        <Link
                            href="/choose-plan"
                            className="bg-[#2bd97c] text-[#032b41] h-[40px] rounded-sm text-[16px] flex items-center justify-center min-w-[180px] w-fit px-4 no-underline"
                        >
                            Upgrade to Premium
                        </Link>
                    )}

                </div>
                    <div className="flex flex-col items-start gap-2">
                        <div className="text-[18px] font-bold text-[#032b41]">Email</div>
                        <div className="text-[#032b41]">{user.email}</div>

                    </div>
            </div>
        </div>
    )
}

export default Settings;
