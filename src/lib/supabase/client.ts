import { createBrowserClient } from '@supabase/ssr'
import {SupabaseClient, User} from "@supabase/supabase-js";
import {useEffect, useState} from "react";
export function createClient() {
    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
    )
}

export function useGetUser(supabase: SupabaseClient) {
    const [user, setUser] = useState<User | null>(null);
    useEffect(() => {
        async function checkLoggedIn() {
            const {data: {user}, error: getUserError} = await supabase.auth.getUser();
            if (getUserError) throw getUserError;
            setUser(user);
        }
        checkLoggedIn().then();
    }, []);
    return user;
}