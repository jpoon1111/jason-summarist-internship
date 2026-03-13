// "use client";

// import { useState } from "react";
// import Image from "next/image";
// import {
//   AiOutlineFile,
// } from "react-icons/ai";
// import { IoLeafOutline } from "react-icons/io5";
// import { MdOutlineHandshake } from "react-icons/md";
// import { BsChevronDown } from "react-icons/bs";
// import pricingTop from "@/assets/pricing-top.png"; // adjust path as needed

// // ─── FAQ DATA ────────────────────────────────────────────────────────────────
// const FAQS = [
//   {
//     question: "How does the free 7-day trial work?",
//     answer:
//       "Begin your complimentary 7-day trial with a Summarist annual membership. You are under no obligation to continue your subscription, and you will only be billed when the trial period expires. With Premium access, you can learn at your own pace and as frequently as you desire, and you may terminate your subscription prior to the conclusion of the 7-day free trial.",
//   },
//   {
//     question:
//       "Can I switch subscriptions from monthly to yearly, or yearly to monthly?",
//     answer:
//       "While an annual plan is active, it is not feasible to switch to a monthly plan. However, once the current month ends, transitioning from a monthly plan to an annual plan is an option.",
//   },
//   {
//     question: "What's included in the Premium plan?",
//     answer:
//       "Premium membership provides you with the ultimate Summarist experience, including unrestricted entry to many best-selling books high-quality audio, the ability to download titles for offline reading, and the option to send your reads to your Kindle.",
//   },
//   {
//     question: "Can I cancel during my trial or subscription?",
//     answer:
//       "You will not be charged if you cancel your trial before its conclusion. While you will not have complete access to the entire Summarist library, you can still expand your knowledge with one curated book per day.",
//   },
// ];

// // ─── ACCORDION ────────────────────────────────────────────────────────────────
// function Accordion({ question, answer }: { question: string; answer: string }) {
//   const [open, setOpen] = useState(false);

//   return (
//     <div className="accordion__card">
//       <div
//         className="accordion__header"
//         onClick={() => setOpen((prev) => !prev)}
//       >
//         <div className="accordion__title">{question}</div>
//         <BsChevronDown
//           className={`accordion__icon ${open ? "accordion__icon--rotate" : ""}`}
//         />
//       </div>
//       {/* animated collapse */}
//       <div
//         className="collapse"
//         style={{ height: open ? "auto" : 0, overflow: "hidden", transition: "height .35s ease" }}
//       >
//         <div className="accordion__body">{answer}</div>
//       </div>
//     </div>
//   );
// }

// // ─── PAGE ─────────────────────────────────────────────────────────────────────
// export default function ChoosePlanPage() {
//   // "yearly" | "monthly"
//   const [selected, setSelected] = useState<"yearly" | "monthly">("yearly");

//   return (
//     <div className="plan">
//       {/* ── HEADER ── */}
//       <div className="plan__header--wrapper">
//         <div className="plan__header">
//           <div className="plan__title">
//             Get unlimited access to many amazing books to read
//           </div>
//           <div className="plan__sub--title">
//             Turn ordinary moments into amazing learning opportunities
//           </div>
//           {/* hero image — rounded arch shape comes from plan__img--mask CSS */}
//           <figure className="plan__img--mask">
//             <Image
//               src={pricingTop}
//               alt="pricing"
//               width={860}
//               height={722}
//               loading="lazy"
//             />
//           </figure>
//         </div>
//       </div>

//       {/* ── BODY ── */}
//       <div className="row">
//         <div className="container">

//           {/* ── FEATURES ── */}
//           <div className="plan__features--wrapper">
//             <div className="plan__features">
//               <figure className="plan__features--icon">
//                 {/* file / key ideas icon */}
//                 <AiOutlineFile size={60} />
//               </figure>
//               <div className="plan__features--text">
//                 <b>Key ideas in few min</b> with many books to read
//               </div>
//             </div>

//             <div className="plan__features">
//               <figure className="plan__features--icon">
//                 <IoLeafOutline size={60} />
//               </figure>
//               <div className="plan__features--text">
//                 <b>3 million</b> people growing with Summarist everyday
//               </div>
//             </div>

//             <div className="plan__features">
//               <figure className="plan__features--icon">
//                 <MdOutlineHandshake size={60} />
//               </figure>
//               <div className="plan__features--text">
//                 <b>Precise recommendations</b> collections curated by experts
//               </div>
//             </div>
//           </div>

//           {/* ── SECTION TITLE ── */}
//           <div className="section__title">Choose the plan that fits you</div>

//           {/* ── PLAN CARD: YEARLY ── */}
//           <div
//             className={`plan__card ${selected === "yearly" ? "plan__card--active" : ""}`}
//             onClick={() => setSelected("yearly")}
//           >
//             <div className="plan__card--circle">
//               {selected === "yearly" && <div className="plan__card--dot" />}
//             </div>
//             <div className="plan__card--content">
//               <div className="plan__card--title">Premium Plus Yearly</div>
//               <div className="plan__card--price">$99.99/year</div>
//               <div className="plan__card--text">7-day free trial included</div>
//             </div>
//           </div>

//           {/* ── SEPARATOR ── */}
//           <div className="plan__card--separator">
//             <div className="plan__separator">or</div>
//           </div>

//           {/* ── PLAN CARD: MONTHLY ── */}
//           <div
//             className={`plan__card ${selected === "monthly" ? "plan__card--active" : ""}`}
//             onClick={() => setSelected("monthly")}
//           >
//             <div className="plan__card--circle">
//               {selected === "monthly" && <div className="plan__card--dot" />}
//             </div>
//             <div className="plan__card--content">
//               <div className="plan__card--title">Premium Monthly</div>
//               <div className="plan__card--price">$9.99/month</div>
//               <div className="plan__card--text">No trial included</div>
//             </div>
//           </div>

//           {/* ── CTA (sticky) ── */}
//           <div className="plan__card--cta">
//             <span className="btn--wrapper">
//               <button className="btn" style={{ width: 300 }}>
//                 <span>
//                   {selected === "yearly"
//                     ? "Start your free 7-day trial"
//                     : "Get Premium Monthly"}
//                 </span>
//               </button>
//             </span>
//             <div className="plan__disclaimer">
//               Cancel your trial at any time before it ends, and you won&apos;t
//               be charged.
//             </div>
//           </div>

//           {/* ── FAQ ── */}
//           <div className="faq__wrapper">
//             {FAQS.map((faq) => (
//               <Accordion
//                 key={faq.question}
//                 question={faq.question}
//                 answer={faq.answer}
//               />
//             ))}
//           </div>

//         </div>
//       </div>

//       {/* ── FOOTER ── */}
//       <section id="footer">
//         <div className="container">
//           <div className="row">
//             <div className="footer__top--wrapper">
//               <div className="footer__block">
//                 <div className="footer__link--title">Actions</div>
//                 <div>
//                   {["Summarist Magazine", "Cancel Subscription", "Help", "Contact us"].map((l) => (
//                     <div key={l} className="footer__link--wrapper">
//                       <a className="footer__link">{l}</a>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               <div className="footer__block">
//                 <div className="footer__link--title">Useful Links</div>
//                 <div>
//                   {["Pricing", "Summarist Business", "Gift Cards", "Authors & Publishers"].map((l) => (
//                     <div key={l} className="footer__link--wrapper">
//                       <a className="footer__link">{l}</a>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               <div className="footer__block">
//                 <div className="footer__link--title">Company</div>
//                 <div>
//                   {["About", "Careers", "Partners", "Code of Conduct"].map((l) => (
//                     <div key={l} className="footer__link--wrapper">
//                       <a className="footer__link">{l}</a>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               <div className="footer__block">
//                 <div className="footer__link--title">Other</div>
//                 <div>
//                   {["Sitemap", "Legal Notice", "Terms of Service", "Privacy Policies"].map((l) => (
//                     <div key={l} className="footer__link--wrapper">
//                       <a className="footer__link">{l}</a>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             <div className="footer__copyright--wrapper">
//               <div className="footer__copyright">
//                 Copyright &copy; 2023 Summarist.
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }