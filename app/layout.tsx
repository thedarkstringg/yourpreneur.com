import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "./components/Sidebar";
import TopNav from "./components/TopNav";
import BottomNav from "./components/BottomNav";
import MouseSpotlight from "./components/MouseSpotlight";

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
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-background text-on-background font-body-base min-h-screen flex bg-dot-grid">
        <MouseSpotlight />
        <Sidebar />
        <TopNav />
        <main className="flex-1 lg:ml-64 pt-24 pb-24 md:pt-16 min-h-screen relative overflow-hidden flex flex-col items-center w-full">
          <div className="w-full max-w-[800px] mx-auto px-6 relative z-10 flex flex-col h-full">
            {children}
          </div>
        </main>
        <BottomNav />
      </body>
    </html>
  );
}
