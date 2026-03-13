// {/* ❌ remove overflow-hidden from outer div */}
// <div className="border-b border-[#ddd] mb-2">

//   <div onClick={() => setOpen(p => !p)} className="flex justify-between items-center cursor-pointer py-6 gap-2">
//     ...
//   </div>

//   {/* overflow: hidden stays here on the inner div only */}
//   <div ref={contentRef} style={{ height: open ? contentRef.current?.scrollHeight + "px" : "0px", overflow: "hidden", transition: "height .35s ease-in-out" }}>
//     <p className="pb-6 text-[#394547] leading-normal">
//       {answer}
//     </p>
//   </div>

// </div>




// <div ref={contentRef} style={{ maxHeight: open ? "500px" : "0px", overflow: "hidden", transition: "max-height .35s ease" }}></div>