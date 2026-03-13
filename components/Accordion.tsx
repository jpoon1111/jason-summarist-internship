import React, { useRef, useState } from 'react'
import { BsChevronDown } from 'react-icons/bs';

export default function Accordion({question, answer, defaultOpen} : {question:string; answer:string; defaultOpen: boolean;}) {

    const [open, setOpen] = useState(defaultOpen);
    const contentRef = useRef<HTMLDivElement>(null)

  return  (
    <>
        <div className="border-b border-[#ddd] mb-2">
            <div onClick={() => setOpen(p => !p)}className="flex justify-between items-center cursor-pointer py-6 gap-2">
                <div className="font-medium text-2xl relative mb-0 text-[#032b41] transition-all duration-300">{question}</div>
                <BsChevronDown className={` transition-transform duration-300 ${open ? "rotate-180":""}`} />
            </div>

            <div ref={contentRef} style={{ maxHeight: open ? "500px" : "0px" , overflow: "hidden", transition: "max-height 0.4s ease" }}>
                <p className="pb-6 text-[#394547] leading-normal">
                    {answer}
                </p>
            </div>
        </div>
    </>
    );
 
}
