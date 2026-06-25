import type {Metadata} from "next";
import "./globals.scss";
import React from "react";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";

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
        <html lang="en">
        <body>
        <Header/>
        <main className="main">
            {children}
        </main>
        <Footer/>
        </body>
        </html>
    );
}
