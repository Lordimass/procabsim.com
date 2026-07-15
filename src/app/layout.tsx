import type {Metadata} from "next";
import "./globals.scss";
import React from "react";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import SiteSettingsProvider from "@/lib/siteSettings/siteSettings";
import {getSiteSettings} from "@/lib/siteSettings/siteSettingsServer";

export const metadata: Metadata = {
    title: "ProCab Simulators",
    description: "Real Components - Simulated Reality",
    authors: [{name: "Sam Knight", url: "https://lordimass.net"}],
    creator: "Sam Knight"
};

export default async function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    const settings = await getSiteSettings()

    return (
        <html lang="en" data-bs-theme="dark">
        <body>
        <SiteSettingsProvider value={settings}>
            <Header/>
            <main className="main">
                {children}
            </main>
            <Footer/>
        </SiteSettingsProvider>
        </body>
        </html>
    );
}
