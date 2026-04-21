"use client";
// TODO Sidebar implementation Sidebar OPEN CLOSE



import Image from 'next/image';
import summaristLogo from "../public/assets/summarist-logo.webp";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { useClickOutside } from '@/app/hooks/useClickOutside';
import { closeSidebar } from '@/lib/slices/sidebarSlice';
import { openModal } from '@/lib/slices/authSlice';
import { RootState } from '@/lib/store';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { AiFillHome, AiOutlineLogin, AiOutlineLogout, AiOutlineQuestionCircle, AiOutlineSearch, AiOutlineSetting } from 'react-icons/ai';
import { BsBookmark, BsPencil } from 'react-icons/bs';


export default function Sidebar() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state)=> state.sidebar.isOpen);
  const user = useAppSelector( (state:RootState) =>state.auth.user)


  const sidebarRef = useClickOutside(()=> {
    dispatch(closeSidebar());
  })
  
  const isActive = (path:string) => pathname === path;

  const handleAuthAction = async () => {
    if(user) {
      try{
        await signOut(auth);
      } catch (err) {
        console.error("Sign-out for User error: ", err);
      }
    } else {
      dispatch(openModal());
    }
  };

  return (
    <div 
      ref={sidebarRef}
      className={`bg-[#f7faf9] w-[200px] min-w-[200px] fixed top-0 left-0 h-screen z-[1000] transition-all duration-300
      ${isOpen? "translate-x-0":"-translate-x-full"} max-md:-translate-x-0`}>
      <div className="flex items-center justify-center h-[60px] pt-4 max-w-[160px] mx-auto">
        <Link href="/">
        <Image src={summaristLogo} alt="Summarist" width={495} height={114} className="w-full h-[40px] object-contain" style={{color: "transparent"}} />
        </Link>
    </div>
    <div className="flex flex-col justify-between h-[calc(100vh-60px)] pb-5">
      <div className="flex-1 mt-10">
        <Link href="/for-you" onClick={()=> dispatch(closeSidebar())} className="flex items-center h-14 text-[#032b41] mb-2 cursor-pointer hover:bg-[#f0efef]">
          <div className={`w-[5px] h-full mr-4 ${isActive("/for-you") ? "bg-[#2bd97c]" : "bg-transparent"}`} />

          <div className="flex items-center justify-center mr-2 w-6 h-6">
            <AiFillHome size={24} />
          </div>

          <span className='text-sm'>For You</span>

        </Link>

        <Link href="/library" onClick={()=> dispatch(closeSidebar())} className='flex items-center h-14 text-[#032b41] mb-2 cursor-pointer hover:bg-[#f0efef]'>
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
        <Link href="/settings" onClick={()=> dispatch(closeSidebar())} className='flex items-center h-14 text-[#032b41] mb-2 cursor-pointer hover:bg-[#f0efef]'>
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

        <div 
          className='flex items-center h-14 text-[#032b41] cursor-pointer hover:bg-[#f0efef]' 
          onClick={handleAuthAction}
          title={user? "Logout" : "Login"}//tooltip on hover
        >
          <div className='w-[5px] h-full mr-4 bg-transparent'></div>
          <div className='flex items-center justify-center mr-2 w-6 h-6'>
            {/* will display Logo based on logout and login but evaluate false first because by default user is not logged in until it is check */}
            {user ? (
              <AiOutlineLogout size={24} />
            ) : (
              <AiOutlineLogin size={24} />
            )}
            <span>{user ? "Logout" : "Login"}</span>
            
          </div>
        </div>
      </div>
    </div>



</div>
  )
}
