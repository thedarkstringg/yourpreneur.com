import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Yourpreneur Canvas",
  description: "Entrepreneurial timeline and venture dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen overflow-hidden bg-black text-white" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
