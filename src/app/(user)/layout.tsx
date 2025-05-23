import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";
import Footer from "./components/layout/footer/footer";

import Navbar from "./components/layout/header/Navbar";
import { Toaster } from "@/components/ui/sonner";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="min-h-screen flex flex-col bg-white">
          <div className="flex-1">
            <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
              <Navbar />
              {children}
            </div>
          </div>

          <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
            <Footer />
          </div>

          <Toaster />
        </div>
      </body>
    </html>
  );
}
