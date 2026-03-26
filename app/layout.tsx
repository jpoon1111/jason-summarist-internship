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
        {/* // 
        ReduxProvider already handles auth internally
          <ReduxProvider>
            {children}
          </ReduxProvider>
          ```

          **Your `ReduxProvider.tsx`** is where auth lives — it imports `auth` from `@/lib/firebase` and runs `onAuthStateChanged` to listen for login/logout. That's the right place because it wraps your entire app.

          ---

          So your chain is already correct:
          ```
          lib/firebase.ts        ← initializes auth
                ↓
          ReduxProvider.tsx      ← imports auth, listens for changes
                ↓
          app/layout.tsx         ← wraps everything in ReduxProvider
                ↓
          your whole app         ← auth state available everywhere via Redux */}
        <ReduxProvider>
          <AuthModal />
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}