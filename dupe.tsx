/* Base styles */
.selected__book {
    display: flex;
    justify-content: space-between;
    width: calc((100% / 3) * 2);
    background-color: #fbefd6;
    border-radius: 4px;
    padding: 24px;
    margin-bottom: 24px;
    gap: 24px
}

/* 1200px breakpoint */
@media (max-width: 1200px) {
    .selected__book {
        width: 100%
    }
}

/* 768px breakpoint */
@media (max-width: 768px) {
    .selected__book {
        width: 100%;
        flex-direction: column;
        gap: 24px
    }

    .selected__book--content,
    .selected__book--text {
        width: 100%
    }

    .selected__book--sub-title {
        width: 100%;
        font-size: 14px
    }

    .selected__book--line {
        display: none
    }
}

/* 576px breakpoint */
@media (max-width: 576px) {
    .selected__book {
        padding: 16px
    }
}










<Link
  href={`/book/${selectedBook.id}`}
  className="flex justify-between w-2/3 bg-[#fbefd6] rounded p-6 mb-6 gap-6 no-underline text-inherit hover:bg-[#f3e4c8] transition-colors max-[1200px]:w-full max-[768px]:w-full max-[768px]:flex-col max-[768px]:gap-6 max-[576px]:p-4"
  // DIFF 1: width – HTML uses "w-2/3", here it's "w-full"
  // DIFF 2: border radius – HTML uses "rounded", here "rounded-sm" (smaller)
  // DIFF 3: extra classes – HTML has no "no-underline", "text-inherit", "hover:bg-...", "transition-colors"
>
  {/* Subtitle block */}
  <div className="text-[#032b41] w-[40%] max-[768px]:text-[14px]">
    {/* DIFF 4: mobile font size – HTML uses "max-[768px]:text-sm", here "text-[14px]" (same but different notation) */}
    {/* DIFF 5: HTML also has "max-[768px]:w-full" – here missing, but parent flex-col makes it full width anyway */}
    {selectedBook.subTitle}
  </div>

  {/* Vertical divider */}
  <div className="w-[1px] bg-[#bac8ce] max-[768px]:hidden"></div>
  {/* ✅ No difference – matches HTML exactly */}

  {/* Right side: image + text */}
  <div className="flex gap-4 w-[60%]">
    {/* DIFF 6: figure wrapper – HTML has "max-w-[140px] rounded-lg overflow-hidden" */}
    {/* here: "w-[140px] h-[140px] min-w-[140px]" – no rounding, no overflow hidden */}
    <figure className="w-[140px] h-[140px] min-w-[140px]">
      <Image
        src={selectedBook.imageLink}
        alt={selectedBook.title}
        width={140}
        height={140}
        className="w-full h-full"
      />
    </figure>

    <div className="w-full">
      {/* Book title */}
      <h3 className="font-semibold text-[#032b41] mb-2 text-lg">
        {/* DIFF 7: HTML uses a <div> with no text size; here <h3> with "text-lg" (larger) */}
        {selectedBook.title}
      </h3>

      {/* Author */}
      <div className="text-[#394547] text-[14px] mb-4">
        {/* ✅ matches HTML (HTML uses "text-sm" which is also 14px) */}
        {selectedBook.author}
      </div>

      {/* Play button + duration */}
      <div className="flex items-center gap-2">
        {/* Play button wrapper */}
        <div className="flex items-center justify-center w-10 h-10 bg-black rounded-full pl-[3px]">
          {/* DIFF 8: HTML uses raw SVG with "p-1 pl-[6px]"; here uses <BsFillPlayFill> with "pl-[3px]" and "text-2xl" */}
          <BsFillPlayFill className="text-white text-2xl" />
        </div>

        {/* Duration text */}
        <div className="text-[10px] font-medium text-[#032b41]">
          {/* DIFF 9: HTML duration is "text-sm" (14px); here it's "text-[10px]" (much smaller) */}
          3 mins 23 secs
        </div>
      </div>
    </div>
  </div>
</Link>

{/* DIFF 10: HTML snippet has NO <audio> tag inside the link. 
    In your React file, there's an <audio> element just above this <Link> (line ~118). 
    That's not part of the card itself – it's a separate player. */}






    <div class="relative flex items-center justify-between px-8 max-w-[1070px] mx-auto h-full">
  <!-- Logo (was missing) -->
  <figure>
    <img src="/assets/summarist-logo.webp" alt="Summarist Logo" />
  </figure>
  
  <!-- Search content -->
  <div class="flex items-center w-full gap-6 max-w-[340px]">
    <div class="flex items-center w-full">
      <div class="relative w-full gap-2">
        <input 
          placeholder="Search for books" 
          type="text" 
          class="h-10 w-full px-4 outline-none bg-[#f1f6f4] text-[#042330] border-2 border-[#e1e7ea] rounded-lg" 
          value=""
        />
        <div class="absolute right-2 top-0 flex h-full items-center justify-end border-l-2 border-[#e1e7ea] pl-2">
          <svg class="w-6 h-6 text-[#03314b]" fill="currentColor" viewBox="0 0 1024 1024">
            <path d="M909.6 854.5L649.9 594.8C690.2 542.7 712 479 712 412c0-80.2-31.3-155.4-87.9-212.1-56.6-56.7-132-87.9-212.1-87.9s-155.5 31.3-212.1 87.9C143.2 256.5 112 331.8 112 412c0 80.1 31.3 155.5 87.9 212.1C256.5 680.8 331.8 712 412 712c67 0 130.6-21.8 182.7-62l259.7 259.6a8.2 8.2 0 0 0 11.6 0l43.6-43.5a8.2 8.2 0 0 0 0-11.6zM570.4 570.4C528 612.7 471.8 636 412 636s-116-23.3-158.4-65.6C211.3 528 188 471.8 188 412s23.3-116.1 65.6-158.4C296 211.3 352.2 188 412 188s116.1 23.2 158.4 65.6S636 352.2 636 412s-23.3 116.1-65.6 158.4z"/>
          </svg>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Hamburger toggle (mobile only) -->
  <div class="hidden max-[768px]:flex items-center justify-center cursor-pointer">
    <svg class="w-6 h-6 text-[#03314b]" fill="currentColor" viewBox="0 0 15 15">
      <path d="M13.6006 11.0098C13.8286 11.0563 14 11.2583 14 11.5C14 11.7417 13.8286 11.9437 13.6006 11.9902L13.5 12H1.5C1.22386 12 1 11.7761 1 11.5C1 11.2239 1.22386 11 1.5 11H13.5L13.6006 11.0098ZM13.6006 7.00977C13.8286 7.05629 14 7.25829 14 7.5C14 7.74171 13.8286 7.94371 13.6006 7.99023L13.5 8H1.5C1.22386 8 1 7.77614 1 7.5C1 7.22386 1.22386 7 1.5 7H13.5L13.6006 7.00977ZM13.6006 3.00977C13.8286 3.05629 14 3.25829 14 3.5C14 3.74171 13.8286 3.94371 13.6006 3.99023L13.5 4H1.5C1.22386 4 1 3.77614 1 3.5C1 3.22386 1.22386 3 1.5 3H13.5L13.6006 3.00977Z" fill="currentColor"/>
    </svg>
  </div>
</div>