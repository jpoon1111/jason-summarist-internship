"use client";

import SearchBar from "@/components/SearchBar";
import Sidebar from "@/components/Sidebar";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { closeModal } from "@/lib/slices/authSlice";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  
    const modalOpen = useAppSelector((state) => state.auth.modalOpen);
    const dispatch = useAppDispatch();
  return (
    <>
      <Sidebar />
      <main style={{ marginLeft: "200px" }} className="min-h-screen">
        <SearchBar />
        {/* Overlay when Login */}
        <div className={`fixed top-0 left-0 w-full h-full bg-[#3a4649] transition-opacity duration-[400ms] ease-in-out z-10 ${modalOpen ? "opacity-65 pointer-events-auto" : "opacity-0 pointer-events-none"}`}  onClick={(()=>dispatch(closeModal()))}>
        </div>
        {children}
      </main>
    </>
  );
}