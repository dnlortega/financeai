import type { Metadata } from "next";
import { Mulish } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

const mulish = Mulish({
  subsets: ["latin-ext"],
});

export const metadata: Metadata = {
  title: "Finance AI - Gestão Financeira Inteligente",
  description: "Gerencie suas finanças com o poder da inteligência artificial.",
};

import { ThemeProvider } from "./_components/theme-provider";
import { Toaster } from "@/app/_components/ui/sonner";
import BottomNav from "./_components/bottom-nav";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${mulish.className} antialiased`}>
        <ClerkProvider
          appearance={{
            baseTheme: dark,
          }}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="flex h-full flex-col overflow-y-auto pb-20 md:pb-0">
              {children}
            </div>
            <Toaster />
            <BottomNav />
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
