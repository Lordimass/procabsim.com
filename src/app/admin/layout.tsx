import React from "react";
import {createClient, getUserProfile} from "@/lib/supabase/server";
import {redirect} from "next/navigation";

export default async function AdminLayout({children}: Readonly<{children: React.ReactNode}>) {
    const supabase = await createClient()
    const profile = await getUserProfile(supabase)
    if (!profile || profile.role !== "admin") redirect("/");

    return children
}