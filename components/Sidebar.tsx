"use client";

import React from 'react'
import Image from 'next/image';
import summaristLogo from "../public/assets/summarist-logo.webp";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppDispatch } from '@/lib/hooks';
import { AiFillHome, AiOutlineLogin, AiOutlineQuestionCircle, AiOutlineSearch, AiOutlineSetting } from 'react-icons/ai';
import { BsBookmark, BsPencil } from 'react-icons/bs';
import { openModal } from '@/lib/slices/authSlice';

 export default function Sidebar() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();

  const isActive = (path:string) => pathname === path;

  return (
    <div className="bg-[#f7faf9] w-[200px] min-w-[200px] fixed top-0 left-0 h-screen z-[1000] transition-all duration-300">
      <div className="flex items-center justify-center h-[60px] pt-4 max-w-[160px] mx-auto">
        <Image src={summaristLogo} alt="Summarist" width={495} height={114} className="w-full h-[40px] object-contain" style={{color: "transparent"}} />
    </div>
    <div className="flex flex-col justify-between h-[calc(100vh-60px)] pb-5 overflow-y-auto">
      <div className="flex-1 mt-10">
        <Link href="/for-you" className="flex items-center h-14 text-[#032b41] mb-2 cursor-pointer hover:bg-[#f0efef]">
          <div className={`w-[5px] h-full mr-4 ${isActive("/for-you") ? "bg-[#2bd97c]" : "bg-transparent"}`} />

          <div className="flex items-center justify-center mr-2 w-6 h-6">
            <AiFillHome size={24} />
          </div>

          <span className='text-sm'> For You</span>

        </Link>

        <Link href="/library" className='flex items-center h-14 text-[#032b41] mb-2 cursor-pointer hover:bg-[#f0efef]'>
          <div className={`w-[5px] h-full mr-4 ${isActive("/library") ? "bg-[#2bd97c]" : "bg-transparent"}`} />
          <div className='flex intes center justify-center mr-2 w-6 h-6'>
            <BsBookmark size={24} />
          </div>
          <span className='text-sm'>My Library</span>
        </Link>

        <div className='flex items-center h-14 text-[#032b41] mb-2 cursor-not-allowed'>
          <div className='w-[5px] h-full mr-4 bg-transparent' />
          <div className='flex items-center justify-center mr-2 w-6 h-6'>
            <BsPencil size={24} />
          </div>
          <span className='text-sm'> Highlights</span>
        </div>

        <div className='flex items-center h-14 text-[#032b41] mb-2 cursor-not-allowed'>
          <div className='w-[5px] h-full mr-4 bg-transparent' />
          <div className='flex items-center justify-center mr-2 w-6 h-6'>
            <AiOutlineSearch size={24} />
          </div>
          <span className='text-sm'>Search</span>
        </div>
      </div>

      <div>
        <Link href="/settings" className='flex items-center h-14 text-[#032b41] mb-2 cursor-pointer hovder:bg-[#f0efef]'>
          <div className={`w-[5px] h-full mr-4 ${isActive("/settings") ? "bg-[#2bd97c]" : "bg-transparent"}`}></div>
          <div className='flex items-center justify-center mr-2 w-6 h-6'>
            <AiOutlineSetting size={24} />
          </div>
          <span className='text-sm'>Settings</span>
        </Link>

        <div className='flex items-center h-14 text-[#032b41] mb-2 cursor-not-allowed'>
          <div className='w-[5px] h-full mr-4 bg-transparent'></div>
          <div className='flex items-center justify-center mr-2 w-6 h-6'>
            <AiOutlineQuestionCircle size={24} />
          </div>
          <span className='text-sm'> Help & Support</span>
        </div>

        <div className='flex items-center h-14 text-[#032b41] cursor-pointer hover:bg-[#f0efef]' onClick={() => dispatch(openModal())}>
          <div className='w-[5px] h-full mr-4 bg-transparent'></div>
          <div className='flex items-center justify-center mr-2 w-6 h-6'>
            <AiOutlineLogin className='text-sm' />
          </div>
        </div>
      </div>
    </div>



</div>
  )
}



// export default function Sidebar() {
//   const pathname = usePathname();
//   const dispatch = useAppDispatch();

//   const isActive = (path: string) => pathname === path;

//   return (
//     // .sidebar
//     // bg-[#f7faf9] w-[200px] min-w-[200px] fixed top-0 left-0 h-screen z-[1000] transition-all duration-300
//     // mobile: max-md:-translate-x-full
//     <div className="bg-[#f7faf9] w-[200px] min-w-[200px] fixed top-0 left-0 h-screen z-[1000] transition-all duration-300 max-md:-translate-x-full">

//       {/* .sidebar__logo
//           flex items-center justify-center h-[60px] pt-4 max-w-[160px] mx-auto */}
//       <div className="flex items-center justify-center h-[60px] pt-4 max-w-[160px] mx-auto">
//         {/* .sidebar__logo img — w-full h-[40px] */}
//         <Image
//           src="/assets/logo.png"
//           alt="Summarist"
//           width={495}
//           height={114}
//           className="w-full h-[40px] object-contain"
//           style={{ color: "transparent" }}
//         />
//       </div>

//       {/* .sidebar__wrapper
//           flex flex-col justify-between h-[calc(100vh-60px)] pb-5 overflow-y-auto */}
//       <div className="flex flex-col justify-between pb-5 overflow-y-auto" style={{ height: "calc(100vh - 60px)" }}>

//         {/* .sidebar__top — flex-1 mt-10 */}
//         <div className="flex-1 mt-10">

//           {/* For You */}
//           {/* .sidebar__link--wrapper: flex items-center h-14 text-[#032b41] mb-2 cursor-pointer hover:bg-[#f0efef] */}
//           <Link href="/for-you" className="flex items-center h-14 text-[#032b41] mb-2 cursor-pointer hover:bg-[#f0efef] no-underline">
//             {/* .sidebar__link--line — w-[5px] h-full mr-4 | .active--tab — bg-[#2bd97c] */}
//             <div className={`w-[5px] h-full mr-4 ${isActive("/for-you") ? "bg-[#2bd97c]" : "bg-transparent"}`} />
//             {/* .sidebar__icon--wrapper — flex items-center justify-center mr-2 w-6 h-6 */}
//             <div className="flex items-center justify-center mr-2 w-6 h-6">
//               <AiFillHome size={24} />
//             </div>
//             {/* .sidebar__link--text — text-sm */}
//             <span className="text-sm">For you</span>
//           </Link>

//           {/* My Library */}
//           <Link href="/library" className="flex items-center h-14 text-[#032b41] mb-2 cursor-pointer hover:bg-[#f0efef] no-underline">
//             <div className={`w-[5px] h-full mr-4 ${isActive("/library") ? "bg-[#2bd97c]" : "bg-transparent"}`} />
//             <div className="flex items-center justify-center mr-2 w-6 h-6">
//               <BsBookmark size={24} />
//             </div>
//             <span className="text-sm">My Library</span>
//           </Link>

//           {/* Highlights — .sidebar__link--not-allowed: cursor-not-allowed hover:bg-transparent */}
//           <div className="flex items-center h-14 text-[#032b41] mb-2 cursor-not-allowed hover:bg-transparent">
//             <div className="w-[5px] h-full mr-4 bg-transparent" />
//             <div className="flex items-center justify-center mr-2 w-6 h-6">
//               <BsPencil size={24} />
//             </div>
//             <span className="text-sm">Highlights</span>
//           </div>

//           {/* Search — disabled */}
//           <div className="flex items-center h-14 text-[#032b41] mb-2 cursor-not-allowed hover:bg-transparent">
//             <div className="w-[5px] h-full mr-4 bg-transparent" />
//             <div className="flex items-center justify-center mr-2 w-6 h-6">
//               <AiOutlineSearch size={24} />
//             </div>
//             <span className="text-sm">Search</span>
//           </div>

//         </div>

//         {/* .sidebar__bottom */}
//         <div>

//           {/* Settings */}
//           <Link href="/settings" className="flex items-center h-14 text-[#032b41] mb-2 cursor-pointer hover:bg-[#f0efef] no-underline">
//             <div className={`w-[5px] h-full mr-4 ${isActive("/settings") ? "bg-[#2bd97c]" : "bg-transparent"}`} />
//             <div className="flex items-center justify-center mr-2 w-6 h-6">
//               <AiOutlineSetting size={24} />
//             </div>
//             <span className="text-sm">Settings</span>
//           </Link>

//           {/* Help & Support — disabled */}
//           <div className="flex items-center h-14 text-[#032b41] mb-2 cursor-not-allowed hover:bg-transparent">
//             <div className="w-[5px] h-full mr-4 bg-transparent" />
//             <div className="flex items-center justify-center mr-2 w-6 h-6">
//               <AiOutlineQuestionCircle size={24} />
//             </div>
//             <span className="text-sm">Help &amp; Support</span>
//           </div>

//           {/* Login — dispatches openModal, last child so no mb */}
//           <div
//             className="flex items-center h-14 text-[#032b41] cursor-pointer hover:bg-[#f0efef]"
//             onClick={() => dispatch(openModal())}
//           >
//             <div className="w-[5px] h-full mr-4 bg-transparent" />
//             <div className="flex items-center justify-center mr-2 w-6 h-6">
//               <AiOutlineLogin size={24} />
//             </div>
//             <span className="text-sm">Login</span>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// }


// import { useAppDispatch } from "@/lib/hooks";
// import { openModal } from "@/lib/slices/authSlice";
// import Image from "next/image";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import {
//   AiFillHome,
//   AiOutlineLogin,
//   AiOutlineQuestionCircle,
//   AiOutlineSearch,
//   AiOutlineSetting,
// } from "react-icons/ai";
// import { BsBookmark, BsPencil } from "react-icons/bs";
