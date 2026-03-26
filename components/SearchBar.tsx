import React from 'react'
import { AiOutlineSearch } from 'react-icons/ai'
import { RxHamburgerMenu } from 'react-icons/rx'

function SearchBar() {
  return (
    <div className='bg-white border-b border-[#e1e7ea] h-20 z-[1]'>
      <div className='relative flex items-center justify-between px-[32px] max-w-[1070px] mx-auto h-full'>
        <div></div>
          
          {/* Search */}
          <div className="flex items-center w-full gap-[24px] max-w-[340px]">
            <div className='flex items-center w-full'>
              <div className='relative w-full'>
                <input suppressHydrationWarning placeholder="Search for books" type="text" defaultValue="" className='h-10 w-full px-4 pr-10 outline-none bg-[#f1f6f4] text-[#14px] text-[#042330] border-2 border-[#e1e7ea] rounded-lg focus:border-[#2be080] transition-all'/>
                <div className='absolute right-[8px] top-0 flex h-full items-center justify-end border-l-2 border-[#e1e7ea] pl-2'>
                  <AiOutlineSearch className='w-6 h-6 text-[#03314b]'/>
                </div>
              </div>
            </div>
          </div>
          {/* Hamburger Menu */}
          <div className='flex md:hidden items-center justify-center cursor-pointer'>
            <RxHamburgerMenu className='w-6 h-6 text-[#03314b]'></RxHamburgerMenu>
          </div>
          
      </div>
    </div>
  )
}

export default SearchBar
