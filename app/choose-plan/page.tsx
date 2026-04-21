"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Accordion from "@/components/Accordion"
import pricingTop from "@/public/assets/pricing-top.png"; // update path if needed
import { AiFillFileText } from "react-icons/ai";
import { FaHandshake } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/lib/hooks";
import { subscriptionService } from "@/lib/SubscriptionService";
import axios from "axios";


const FAQS = [
  {
    question: "How does the free 7-day trial work?",
    answer: "Begin your complimentary 7-day trial with a Summarist annual membership. You are under no obligation to continue your subscription, and you will only be billed when the trial period expires. With Premium access, you can learn at your own pace and as frequently as you desire, and you may terminate your subscription prior to the conclusion of the 7-day free trial.",
    defaultOpen: true,
  },
  {
    question: "Can I switch subscriptions from monthly to yearly, or yearly to monthly?",
    answer: "While an annual plan is active, it is not feasible to switch to a monthly plan. However, once the current month ends, transitioning from a monthly plan to an annual plan is an option.",
    defaultOpen: false,
  },
  {
    question: "What's included in the Premium plan?",
    answer: "Premium membership provides you with the ultimate Summarist experience, including unrestricted entry to many best-selling books high-quality audio, the ability to download titles for offline reading, and the option to send your reads to your Kindle.",
    defaultOpen: false,
  },
  {
    question: "Can I cancel during my trial or subscription?",
    answer: "You will not be charged if you cancel your trial before its conclusion. While you will not have complete access to the entire Summarist library, you can still expand your knowledge with one curated book per day.",
    defaultOpen: false,
  },
];



export default function ChoosePlanPage() {
  // This is the FAQ index that keeps track of the current index between 1-4 but initial value is 0
  const [openIndex, setOpenIndex] = useState(0);
  //sets the plan options with either monthly or yearly with a initial value of yearly
  const [selectedPlan, setSelectedPlan] = useState<'yearly' | 'monthly'>('yearly')// <- this track selected plan
  const [loading, setLoading] = useState(false);// loading set to false until user selects a plan and hit "Start your first month"

  const router = useRouter() // used for navigation
  const user = useAppSelector((state) => state.auth.user);//← Check if user is logged in
  const isSubscribed = useAppSelector((state)=> state.auth.isSubscribed)//← Check if already subscribed

  useEffect(()=>{

    //if user is logged in and already have a subscription then redirect them to the "/for-you" page
    if(isSubscribed){
      router.replace('/for-you');//will be redirected to for-you
      return;// this stops all other functions after this line from running if isSubscribed is true
    }
  },[isSubscribed, router])

  
  const handleSubcribe =async () => {
      // Check if user is logged in(this is the guard if they are not signed in )
      if (!user) {//if not logged in then...
        router.replace('/') //// Redirect to home page to login
        return; // this will return but actually returns undefined behind the scenes
                // it will stop here if user is not logged in
      }
  
      setLoading(true);//set loading is try because user hit button to call this function

      try {
        //async call to get the status of this user to see if they selected a plan and update "yearly"
        //NOTE This bypass stripe and talk to firebase directly
        // const result = await subscriptionService.activatePremium(
        //   user.uid,
        //   //this will check if user picked either yearly or monthly  by checking "yearly"
        //   // then this value gets updated in the firebase
        //   selectedPlan === 'yearly' ? 'premium_yearly' : 'premium_monthly'
        // );

        const {data} = await axios.post(
          '/api/checkout', {
            priceId: selectedPlan === 'yearly' ?
            process.env.NEXT_PUBLIC_STRIPE_PRICE_YEARLY //refernces the yearly by product_id  from env by var
            : process.env.NEXT_PUBLIC_STRIPE_PRICE_MONTHLY,
            userId: user.uid,
          },
        );

        router.push(data.url);

      } catch (error) {
        console.error('Subscription error', error);
      } finally {
        setLoading(false);
      }
  }

  {/*JSX*/}
  return(
    <div className="relative flex flex-col transition-all duration-300">
      <div className="w-full ">
         {/* Head Section */}      
         <div className="plan__header--wrapper relative text-center w-full pt-12 mb-6 ">
            <div className="max-w-[1000px] mx-auto text-white px-6">
              <div className="text-[48px] font-bold mb-10">
                Get unlimited access to many amazing books to read
              </div>
              <div className="text-xl mb-8">Turn ordinary moments into amazing learning opportunities</div>
              <figure className="flex justify-center max-w-[340px] mx-auto rounded-t-[180px] overflow-hidden">
                <Image  src={pricingTop} alt="Pricing" width={860} height={722} loading="lazy"/>

              </figure>
            </div>
         </div>

         <div className="max-w-[1070px] w-full mx-auto px-6">
          <div className="py-10 w-full">
            {/* Features Section */}
            <div className="grid gird-cols-3 justify-items-center text-center gap-6 max-w-[800px] mx-auto mb-14">
              <div>
                <figure className="flex justify-center text-[#032b41] mb-3">
                  <AiFillFileText size={24}/>
                </figure>
                <div className="text-{#394547} leading-normal">
                  <b>Key Ideas in few min</b> with many books to read
                </div>
              </div>
              <div>
                <figure className="flex justify-center text-[#032b41] mb-3">
                  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 640 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                    <path d="M434.7 64h-85.9c-8 0-15.7 3-21.6 8.4l-98.3 90c-.1.1-.2.3-.3.4-16.6 15.6-16.3 40.5-2.1 56 12.7 13.9 39.4 17.6 56.1 2.7.1-.1.3-.1.4-.2l79.9-73.2c6.5-5.9 16.7-5.5 22.6 1 6 6.5 5.5 16.6-1 22.6l-26.1 23.9L504 313.8c2.9 2.4 5.5 5 7.9 7.7V128l-54.6-54.6c-5.9-6-14.1-9.4-22.6-9.4zM544 128.2v223.9c0 17.7 14.3 32 32 32h64V128.2h-96zm48 223.9c-8.8 0-16-7.2-16-16s7.2-16 16-16 16 7.2 16 16-7.2 16-16 16zM0 384h64c17.7 0 32-14.3 32-32V128.2H0V384zm48-63.9c8.8 0 16 7.2 16 16s-7.2 16-16 16-16-7.2-16-16c0-8.9 7.2-16 16-16zm435.9 18.6L334.6 217.5l-30 27.5c-29.7 27.1-75.2 24.5-101.7-4.4-26.9-29.4-24.8-74.9 4.4-101.7L289.1 64h-83.8c-8.5 0-16.6 3.4-22.6 9.4L128 128v223.9h18.3l90.5 81.9c27.4 22.3 67.7 18.1 90-9.3l.2-.2 17.9 15.5c15.9 13 39.4 10.5 52.3-5.4l31.4-38.6 5.4 4.4c13.7 11.1 33.9 9.1 45-4.7l9.5-11.7c11.2-13.8 9.1-33.9-4.6-45.1z" />
                      </svg>
                </figure>
                <div className="text-{#394547} leading-normal">
                  <b>3 million</b> people growing with Summarist everyday
                </div>
              </div>
              <div>
                <figure className="flex justify-center text-[#032b41] mb-3">
                  <FaHandshake size={24}/>
                </figure>
                <div className="text-{#394547} leading-normal">
                  <b>Precise recommendations</b> collections curated by experts
                </div>
              </div>
            </div>

            <h2 className="text-[32px] text-[#032b41] text-center mb-8 font-bold">
              Choose the plan that fits you
            </h2>
            {/* Yearly Plan - Make it selectable  */}
            <div 
              onClick={() => setSelectedPlan('yearly')}
              className={`flex gap-6 p-6 bg-[#f1f6f4] rounded cursor-pointer max-w-[680px] mx-auto transition-all
                  ${ 
                    selectedPlan === 'yearly' ? 
                      'border-4 border-[#2bd97c] plan__card--active'
                      :
                      'border-4 border-[#bac8ca]'
                  }
              `}
            >
              <div className="relative w-6 h-6 rounded-full border-2 border-black flex items-center justify-center">
                {selectedPlan === 'yearly' && (<div className="absolute w-1.5 h-1.5 bg-black rounded-full"></div>)}
              </div>
              <div className="plan__card--content">
                <div className="text-[24px] font-bold text-[#032b41] mb-2">Premium Plus Yearly</div>
                <div className="text-[24px] font-bold text-[#032b41] mb-2">$99.99/year</div>
                <div className="text-[#6b757b] text-[14px]">7-day free trial included</div>
              </div>
            </div>

            <div className="text-sm text-[#6b757b] flex items-center gap-2 max-w-[240px] mx-auto my-6 before:flex-grow before:h-px before:bg-[#bac8ce] after:flex-grow after:h-px after:bg-[#bac8ce]">
              <div>or</div>
            </div>
            
            <div 
              onClick={() => setSelectedPlan('monthly')}                
              className={`flex gap-6 p-6 bg-[#f1f6f4] rounded cursor-pointer max-w-[680px] mx-auto transition-all
                  ${ 
                    selectedPlan === 'monthly' ? 
                      'border-4 border-[#2bd97c] plan__card--active'
                      :
                      'border-4 border-[#bac8ca]'
                  }
              `}
            >
              <div className="relative w-6 h-6 rounded-full border-2 border-black flex items-center justify-center">
                {selectedPlan === 'monthly' && (<div className="absolute w-1.5 h-1.5 bg-black rounded-full"></div>)}
              </div>
              <div>
                <div className="text-[24px] font-bold text-[#032b41] mb-2">Premium Monthly</div>
                <div className="text-[24px] font-bold text-[#032b41] mb-2">$9.99/month</div>
                <div className="text-[#6b757b] text-[14px]">No trial included</div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="plan__card--cta bg-white sticky bottom-0 z-[1] py-8 flex flex-col items-center gap-4">
              <button 
                onClick={handleSubcribe}
                disabled={loading}
                className="bg-[#2bd97c] text-[#032b41] w-[300px] h-10 rounded text-base transition-colors duration-200 flex items-center justify-center min-w-[180px] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Start your first month
              </button>
              <div className="text-xs text-[#6b757b] text-center">30-day money back guarantee, no questions asked.</div>
            </div>

            {/* FAQ Section */}
            <div className="faq__wrapper">
              {// This gets FAQ and generate a list of FAQ questions and answers
                FAQS.map((faq, index) => (
                  <Accordion key={faq.question} question={faq.question} answer={faq.answer} isOpen={index===openIndex} onToggle={()=>setOpenIndex(index === openIndex ? -1 : index)}/>
                ))
              }
            </div>

          </div>
         </div>
         <footer className="bg-[#f1f6f4]">
              <div className="row max-w-[1070px] w-full mx-auto px-6">
                <div className="footer-top--wrapper grid grid-cols-4 text-[14px] mt-8 mx-auto mb-16">
                  <div className="block">
                    <h3 className="font-semibold mb-4 text-[18px] text-[#032b41]">Actions</h3>
                    <ul>
                      <li className="mb-3 leading-none"><a className="text-[#394547] text-[14px] cursor-not-allowed">Summarist Magazine</a></li>
                      <li className="mb-3 leading-none"><a className="text-[#394547] text-[14px] cursor-not-allowed">Cancel Subscription</a></li>
                      <li className="mb-3 leading-none"><a className="text-[#394547] text-[14px] cursor-not-allowed">Help</a></li>
                      <li className="mb-3 leading-none"><a className="text-[#394547] text-[14px] cursor-not-allowed">Contact us</a></li>
                    </ul>

                  </div>
                  <div className="block">
                    <h3 className="font-semibold mb-4 text-[18px] text-[#032b41]">Useful Links</h3>
                    <ul>
                      <li className="mb-3 leading-none"><a className="text-[#394547] text-[14px] cursor-not-allowed">Pricing</a></li>
                      <li className="mb-3 leading-none"><a className="text-[#394547] text-[14px] cursor-not-allowed">Summarist Business</a></li>
                      <li className="mb-3 leading-none"><a className="text-[#394547] text-[14px] cursor-not-allowed">Gift Cards</a></li>
                      <li className="mb-3 leading-none"><a className="text-[#394547] text-[14px] cursor-not-allowed">Authors & Publishers</a></li>
                    </ul>

                  </div>
                  <div className="block">
                    <h3 className="font-semibold mb-4 text-[18px] text-[#032b41]">Company</h3>
                    <ul>
                      <li className="mb-3 leading-none"><a className="text-[#394547] text-[14px] cursor-not-allowed">About</a></li>
                      <li className="mb-3 leading-none"><a className="text-[#394547] text-[14px] cursor-not-allowed">Careers</a></li>
                      <li className="mb-3 leading-none"><a className="text-[#394547] text-[14px] cursor-not-allowed">Partners</a></li>
                      <li className="mb-3 leading-none"><a className="text-[#394547] text-[14px] cursor-not-allowed">Code of Conduct</a></li>
                    </ul>

                  </div>
                  <div className="block">
                    <h3 className="font-semibold mb-4 text-[18px] text-[#032b41]">Other</h3>
                    <ul>
                      <li className="mb-3 leading-none"><a className="text-[#394547] text-[14px] cursor-not-allowed">Sitemap</a></li>
                      <li className="mb-3 leading-none"><a className="text-[#394547] text-[14px] cursor-not-allowed">Legal Notice</a></li>
                      <li className="mb-3 leading-none"><a className="text-[#394547] text-[14px] cursor-not-allowed">Terms of Service</a></li>
                      <li className="mb-3 leading-none"><a className="text-[#394547] text-[14px] cursor-not-allowed">Privacy Policies</a></li>
                    </ul>

                  </div>
                </div>

                <div className="flex justify-center items center">
                  <p className="text-[#032b41] font-medium">Copyright © 2023 Summarist.</p>
                </div>

              </div>

            </footer>
      </div>
    </div>    

  );
}