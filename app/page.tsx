"use client";
//Landing Home Page
import { AiFillFileText, AiFillBulb, AiFillAudio } from "react-icons/ai";
import { BsStarFill, BsStarHalf } from "react-icons/bs";
import { BiCrown } from "react-icons/bi";
import { RiLeafLine } from "react-icons/ri";
import Image from "next/image";
import { openModal } from "@/lib/slices/authSlice";
import { useAppDispatch } from "@/lib/hooks";
import { useEffect, useState } from "react";



export default function Landing() {
  const dispatch = useAppDispatch();
  //initial state is 0 which is the default state
  const [activeIdx, setActiveIdx] = useState<number>(0);

  useEffect(()=> {
    const interval = setInterval(()=> {
      //checks which number prev was and then take that add 1 then modular by 6 to get 0-5
      // then update activeIdx with setActiveIdx()
      setActiveIdx(prev=> ((prev+1) % 6));
    }, 2000);
  }, []);
  

  return (
    <>

      {/* NAVBAR */}
      <nav className="h-20">
        <div className="flex justify-between items-center max-w-[1070px] w-full h-full mx-auto px-6">
          <figure className="max-w-[200px]">
            <Image className="w-full h-full" src="/assets/logo.png" alt="logo" width={200} height={50} />
          </figure>
          <ul className="flex gap-6">
            <li onClick={()=> dispatch(openModal())} className="cursor-pointer text-[#032b41] transition-colors duration-100 hover:text-[#2bd97c]">Login</li>
            <li className="cursor-not-allowed text-[#032b41] max-[576px]:hidden transition-colors duration-100">About</li>
            <li className="cursor-not-allowed text-[#032b41] max-[576px]:hidden transition-colors duration-100">Contact</li>
            <li className="cursor-not-allowed text-[#032b41] max-[576px]:hidden transition-colors duration-100">Help</li>
          </ul>
        </div>
      </nav>

      {/* LANDING */}
      <section id="landing">
        <div className="py-10 w-full">
          <div className="max-w-[1070px] w-full mx-auto px-6">
            <div className="flex md:flex-row flex-col items-center text-center md:text-left">
              <div className="w-full flex flex-col items-center md:flex-col md:items-start">
                <div className="text-[#032b41] text-[2.5rem] max-md:text-2xl font-bold mb-6">
                  Gain more knowledge <br className="max-md:hidden" />
                  in less time
                </div>
                <div className="text-[#394547] text-xl max-md:text-base font-light mb-6 leading-normal">
                  Great summaries for busy people,
                  <br className="max-md:hidden" />
                  individuals who barely have time to read,
                  <br className="max-md:hidden" />
                  and even people who don&apos;t like to read.
                </div>
                <button onClick={()=>dispatch(openModal())} className="bg-[#2bd97c] hover:bg-[#20ba68] text-[#032b41] w-full max-w-[300px] h-10 rounded px-4 text-base transition-colors duration-200 flex items-center justify-center">
                  Login
                </button>
              </div>
              <figure className="w-full flex justify-end max-md:hidden">
                <Image src="/assets/landing.png" alt="landing" width={400} height={400} className="w-full h-full max-w-[400px]" />
              </figure>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features">

        <div className="py-10 w-full">
          <div className="max-w-[1070px] w-full mx-auto px-6">
            <h2 className="text-3xl max-md:text-2xl text-[#032b41] text-center mb-8 font-bold">
              Understand books in few minutes
            </h2>
            <div className="grid grid-cols-3 max-md:grid-cols-1 gap-10 mb-24">
              {[
                { icon: <AiFillFileText className="w-[60px] h-[60px] max-md:w-12 max-md:h-12" />, title: "Read or listen", sub: "Save time by getting the core ideas from the best books." },
                { icon: <AiFillBulb className="w-[60px] h-[60px] max-md:w-12 max-md:h-12" />, title: "Find your next read", sub: "Explore book lists and personalized recommendations." },
                { icon: <AiFillAudio className="w-[60px] h-[60px] max-md:w-12 max-md:h-12" />, title: "Briefcasts", sub: "Gain valuable insights from briefcasts" },
              ].map(({ icon, title, sub }) => (
                <div key={title} className="flex flex-col items-center text-center">
                  <div className="flex justify-center mb-2 text-[#032b41]">{icon}</div>
                  <div className="text-2xl max-md:text-xl text-[#032b41] mb-4 font-medium">{title}</div>
                  <div className="text-lg max-md:text-sm text-[#394547] font-light">{sub}</div>
                </div>
              ))}
            </div>

            {/* Statistics block 1 */}
            <div className="flex max-md:flex-col gap-20 max-md:gap-8 mb-24 max-md:mb-8">
              <div className="w-full flex flex-col justify-center">
                {["Enhance your knowledge", 
                  "Achieve greater success", 
                  "Improve your health", 
                  "Develop better parenting skills", 
                  "Increase happiness", 
                  "Be the best version of yourself!"].map((h, i) => (
                    
                    <div key={h} className={`text-3xl max-md:text-2xl font-medium ${i === activeIdx? 'text-[#2bd97c]' : 'text-[#6b757b]'} mb-4 last:mb-0 `} style={{animationDelay: `${i}s`}}>{h}</div>
                                                                                              
                ))}
              </div>

              <div className="w-full flex flex-col justify-center gap-6 bg-[#f1f6f4] py-10 px-6">
                {[
                  { num: "93%", text: <>of Summarist members <b>significantly increase</b> reading frequency.</> },
                  { num: "96%", text: <>of Summarist members <b>establish better</b> habits.</> },
                  { num: "90%", text: <>have made <b>significant positive</b> change to their lives.</> },
                ].map(({ num, text }) => (
                  <div key={num} className="flex gap-4">
                    <div className="text-[#0365f2] text-xl font-semibold mt-1 shrink-0">{num}</div>
                    <div className="text-xl max-md:text-base font-light text-[#394547]">{text}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Statistics block 2 */}
            <div className="flex max-md:flex-col gap-20 max-md:gap-8">
              <div className="w-full flex flex-col justify-center gap-6 bg-[#f1f6f4] py-10 px-6 max-md:order-1">
                {[
                  { num: "91%", text: <><b>report feeling more productive</b> after incorporating the service into their daily routine.</> },
                  { num: "94%", text: <>have <b>noticed an improvement</b> in their overall comprehension and retention of information.</> },
                  { num: "88%", text: <><b>feel more informed</b> about current events and industry trends since using the platform.</> },
                ].map(({ num, text }) => (
                  <div key={num} className="flex gap-4">
                    <div className="text-[#0365f2] text-xl font-semibold mt-1 shrink-0">{num}</div>
                    <div className="text-xl max-md:text-base font-light text-[#394547]">of Summarist members {text}</div>
                  </div>
                ))}
              </div>
              <div className="w-full flex flex-col justify-center items-end max-md:items-start">
                {
                  ["Expand your learning", 
                    "Accomplish your goals", 
                    "Strengthen your vitality", 
                    "Become a better caregiver", 
                    "Improve your mood", 
                    "Maximize your abilities"].map((h, i) => (
                      <div key={h} className={ `text-3xl max-md:text-2xl font-medium ${i === activeIdx?"text-[#2bd97c]":"text-[#6b757b]"} mb-4 last:mb-0` }>{h}</div>
                    ))
                }                                                                                                        
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section id="reviews">
        <div className="py-10 w-full">
          <div className="max-w-[1070px] w-full mx-auto px-6">
            <h2 className="text-3xl max-md:text-2xl text-[#032b41] text-center mb-8 font-bold">
              What our members say
            </h2>
            <div className="max-w-[600px] mx-auto">
              {[
                { name: "Hanna M.", body: <>This app has been a <b>game-changer</b> for me! It&apos;s saved me so much time and effort in reading and comprehending books. Highly recommend it to all book lovers.</> },
                { name: "David B.", body: <>I love this app! It provides <b>concise and accurate summaries</b> of books in a way that is easy to understand. It&apos;s also very user-friendly and intuitive.</> },
                { name: "Nathan S.", body: <>This app is a great way to get the main takeaways from a book without having to read the entire thing. <b>The summaries are well-written and informative.</b> Definitely worth downloading.</> },
                { name: "Ryan R.", body: <>If you&apos;re a busy person who <b>loves reading but doesn&apos;t have the time</b> to read every book in full, this app is for you! The summaries are thorough and provide a great overview of the book&apos;s content.</> },
              ].map(({ name, body }) => (
                <div key={name} className="bg-[#fff3d7] p-4 mb-8 rounded font-light">
                  <div className="text-[#032b41] flex gap-2 mb-2 items-center">
                    <span>{name}</span>
                    <div className="flex">
                      <BsStarFill className="w-4 h-4 fill-[#0564f1]" />
                    </div>
                  </div>
                  <div className="text-[#394547] max-md:text-sm tracking-wide leading-snug">{body}</div>
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-8">
              <button onClick={()=> dispatch(openModal())}className="bg-[#2bd97c] hover:bg-[#20ba68] text-[#032b41] w-full max-w-[300px] h-10 rounded px-4 text-base transition-colors duration-200 flex items-center justify-center">
                Login
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* NUMBERS */}
      <section id="numbers">
        <div className="py-10 w-full">
          <div className="max-w-[1070px] w-full mx-auto px-6">
            <h2 className="text-3xl max-md:text-2xl text-[#032b41] text-center mb-8 font-bold">
              Start growing with Summarist now
            </h2>
            <div className="grid grid-cols-3 max-md:grid-cols-1 gap-10 max-md:gap-6">
              <div className="bg-[#d7e9ff] flex flex-col items-center text-center p-6 pb-10 rounded-xl">
                <div className="flex items-center h-[60px]">
                  <BiCrown className="text-[#0365f2] w-12 h-12" />
                </div>
                <div className="text-[40px] max-md:text-3xl text-[#032b41] font-semibold mb-4">3 Million</div>
                <div className="text-[#394547] font-light max-md:text-sm">Downloads on all platforms</div>
              </div>
              <div className="bg-[#d7e9ff] flex flex-col items-center text-center p-6 pb-10 rounded-xl">
                <div className="flex items-center h-[60px] gap-1">
                  <BsStarFill className="text-[#0365f2] w-5 h-5" />
                  <BsStarHalf className="text-[#0365f2] w-5 h-5" />
                </div>
                <div className="text-[40px] max-md:text-3xl text-[#032b41] font-semibold mb-4">4.5 Stars</div>
                <div className="text-[#394547] font-light max-md:text-sm">Average ratings on iOS and Google Play</div>
              </div>
              <div className="bg-[#d7e9ff] flex flex-col items-center text-center p-6 pb-10 rounded-xl">
                <div className="flex items-center h-[60px]">
                  <RiLeafLine className="text-[#0365f2] w-12 h-12" />
                </div>
                <div className="text-[40px] max-md:text-3xl text-[#032b41] font-semibold mb-4">97%</div>
                <div className="text-[#394547] font-light max-md:text-sm">Of Summarist members create a better reading habit</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#f1f6f4]">
        <div className="py-10 w-full">
          <div className="max-w-[1070px] w-full mx-auto px-6">
            <div className="flex max-md:flex-col justify-between text-sm mt-8 mb-16 max-md:gap-8">
              {[
                { title: "Actions", links: ["Summarist Magazine", "Cancel Subscription", "Help", "Contact us"] },
                { title: "Useful Links", links: ["Pricing", "Summarist Business", "Gift Cards", "Authors & Publishers"] },
                { title: "Company", links: ["About", "Careers", "Partners", "Code of Conduct"] },
                { title: "Other", links: ["Sitemap", "Legal Notice", "Terms of Service", "Privacy Policies"] },
              ].map(({ title, links }) => (
                <div key={title}>
                  <div className="font-semibold mb-4 text-lg text-[#032b41]">{title}</div>
                  {links.map(link => (
                    <div key={link} className="mb-3 last:mb-0">
                      <a className="text-[#394547] text-sm cursor-not-allowed">{link}</a>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div className="flex justify-center items-center">
              <div className="text-[#032b41] font-medium">Copyright &copy; 2023 Summarist.</div>
            </div>
          </div>
        </div>
      </footer>

    </>
  );
}