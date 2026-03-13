import type { Metadata } from "next";
import "./globals.css";
import ReduxProvider from "@/components/ReduxProvider";
import AuthModal from "@/components/AuthModal";

export const metadata: Metadata = {
  title: "Summarist",
  description: "Gain more knowledge in less time",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>
          <AuthModal />
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}