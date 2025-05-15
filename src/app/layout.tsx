import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/providers/LanguageProvider";
import { Toaster } from "@/components/ui/sonner";

import "@mysten/dapp-kit/dist/index.css";
import Sidebar from "@/components/Sidebar";
import { SolanaDappProviders } from "@/components/solana/solana-dapp-providers";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "AI-GOAL",
    description:
        "A goal management platform integrating staking mechanisms, social witnessing, and AI planning to help everyone achieve their goals scientifically and efficiently.",
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
                <SolanaDappProviders>
                    <LanguageProvider>
                        {/* <NavBar /> */}
                        <div className="min-h-screen bg-gray-50">
                            <Sidebar />
                            <div className="ml-64">
                                <div className="p-8">{children}</div>
                            </div>
                        </div>
                    </LanguageProvider>
                </SolanaDappProviders>
                <Toaster />
            </body>
        </html>
    );
}
