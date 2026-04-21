"use client";

import SearchBar from "@/components/SearchBar";
import Sidebar from "@/components/Sidebar";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { closeModal, openModal } from "@/lib/slices/authSlice";
import { closeSidebar, openSidebar } from "@/lib/slices/sidebarSlice";

import { useEffect } from "react";

export default function MainLayout({ children }: { children: React.ReactNode }) {
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.auth.user);
    const loading = useAppSelector((state) => state.auth.loading);
    const modalOpen = useAppSelector((state) => state.auth.modalOpen);
    const sidebarOpen = useAppSelector((state)=> state.sidebar.isOpen);    
    
    useEffect(()=> {
      if(loading) return
      if(!user) dispatch(openModal());
    }, [user, loading]);

  return (
    <>
      <Sidebar />
      <main className="min-h-screen w-full transition-all duration-300 ml-0 min-[769px]:ml-[200px] min-[769px]:w-[calc(100%-200px)]">
        <SearchBar onHamburgerClick={()=> dispatch(openSidebar())} />
        {/* Overlay when Login */}
        <div className={`fixed top-0 left-0 w-full h-full bg-[#3a4649] transition-opacity duration-[400ms] ease-in-out z-10 
          ${modalOpen ? "opacity-65 pointer-events-auto" : "opacity-0 pointer-events-none"}`}  onClick={(()=>dispatch(closeModal()))}
          onAuxClick={()=> dispatch(closeModal())}
        >
        </div>
        {children}
      </main>
    </>
  );
}





