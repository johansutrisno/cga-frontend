import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs'
import "./globals.css";
import HeaderWrapper from "@/components/shared/header-wrapper";
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CGA",
  description: "Content Generator Application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <div className="min-h-screen flex flex-col">
            <HeaderWrapper />
            <main className="flex-1 w-full max-w-7xl mx-auto p-4">
              {children}
            </main>
            <Toaster />
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
