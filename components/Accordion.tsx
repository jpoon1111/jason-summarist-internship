import React, { useRef, useState } from 'react'
import { BsChevronDown } from 'react-icons/bs';

export default function Accordion({question, answer, isOpen, onToggle} : {question:string; answer:string; isOpen: boolean; onToggle: ()=> void; }) {
    const contentRef = useRef<HTMLDivElement>(null)

  return  (
    <>
        <div className="border-b border-[#ddd] mb-2">
            <div onClick={onToggle}className="flex justify-between items-center cursor-pointer py-6 gap-2">
                <div className="font-medium text-2xl relative mb-0 text-[#032b41] transition-all duration-300">{question}</div>
                <BsChevronDown className={` transition-transform duration-300 ${isOpen ? "rotate-180":""}`} />
            </div>

            <div ref={contentRef} style={{ maxHeight: isOpen ? "500px" : "0px" , overflow: "hidden", transition: "max-height 0.4s ease" }}>
                <p className="pb-6 text-[#394547] leading-normal">
                    {answer}
                </p>
            </div>
        </div>
    </>
    );
 
}
