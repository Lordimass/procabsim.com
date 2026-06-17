import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import "./globals.scss";
import React from "react";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";


const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "ProCab Simulators",
    description: "Real Components - Simulated Reality",
    authors: [{name: "Sam Knight", url: "https://lordimass.net"}],
    creator: "Sam Knight"
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
        <body>
        <Header/>
        <main>{children}</main>
        <Footer/>
        </body>
        </html>
    );
}
