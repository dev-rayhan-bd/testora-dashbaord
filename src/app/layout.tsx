import { Toaster } from "@/components/ui/sonner";
import ReduxProvider from "@/store/ReduxProvider";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "katex/dist/katex.min.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Testora Dashboard",
  description: "Testora Admin Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className={`${geistSans.className} ${geistMono.variable} antialiased`}
      >
        <ReduxProvider>
          {children}
          <Toaster richColors position="top-right" closeButton />
        </ReduxProvider>
      </body>
    </html>
  );
}
