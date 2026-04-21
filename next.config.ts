import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },
    ],
  },
};

export default nextConfig;



// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   images: {
//     remotePatterns: [
//       {
//         protocol: 'https',
//         hostname: 'firebasestorage.googleapis.com',
//         port: '',
//         pathname: '/v0/b/**', // This allows all images from your Firebase storage
//       },
//       // If you are using Google Authentication, you also need this for profile pics:
//       {
//         protocol: 'https',
//         hostname: 'lh3.googleusercontent.com',
//         port: '',
//         pathname: '/**',
//       },
//     ],
//   },
// };

// export default nextConfig;