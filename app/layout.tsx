import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "./components/Sidebar";
import TopNav from "./components/TopNav";
import BottomNav from "./components/BottomNav";

export const metadata: Metadata = {
  title: "Institutional Legacy - Timeline",
  description: "A curated archive of institutional ventures and milestones",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className="bg-background text-on-background font-body-base min-h-screen flex bg-dot-grid">
        <Sidebar />
        <TopNav />
        <main className="flex-1 lg:ml-64 pt-24 pb-24 md:pt-16 min-h-screen relative overflow-hidden flex flex-col items-center w-full">
          {/* Background Ambient Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/5 blur-[120px] rounded-full pointer-events-none z-0"></div>
          <div className="w-full max-w-[800px] mx-auto px-6 relative z-10 flex flex-col h-full">
            {children}
          </div>
        </main>
        <BottomNav />
      </body>
    </html>
  );
}
