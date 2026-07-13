"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import {SupabaseClient} from "@supabase/supabase-js";

export async function createClient() {
    const cookieStore = await cookies();

    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        );
                    }
                    catch {
                        // If it's running in a Server Component, just ignore
                    }
                },
            },
        }
    );
}

export async function getUser(supabase: SupabaseClient) {
    const {data: {user}, error: getUserError} = await supabase.auth.getUser();
    if (getUserError) throw getUserError;
    return user;
}

export interface Profile {
    id: string;
    name?: string;
    role: string;
}
export async function getUserProfile(supabase: SupabaseClient): Promise<Profile | null> {
    const {data, error} = await supabase.from("profiles").select("*");
    if (error) throw error;
    return data.length > 0 ? data[0] : null;
}