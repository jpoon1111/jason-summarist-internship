import { ReactNode } from 'react';

interface FeatureCardProps {
    icon: ReactNode;
    title: string;
    sub: string;
}


// import { ReactNode } from "react";

// interface FeatureCardProps {
//   icon: ReactNode;
//   title: string;
//   sub: string;
// }

// export default function FeatureCard({ icon, title, sub }: FeatureCardProps) {
//   return (
//     <div className="flex flex-col items-center text-center">
//       <div className="flex justify-center mb-2 text-[#032b41]">{icon}</div>
//       <div className="text-2xl max-md:text-xl text-[#032b41] mb-4 font-medium">{title}</div>
//       <div className="text-lg max-md:text-sm text-[#394547] font-light">{sub}</div>
//     </div>
//   );
// }