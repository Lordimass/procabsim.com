"use server";

import { createServerClient } from "@supabase/ssr";
import {unstable_cache} from "next/cache";
import {SiteSettings} from "@/lib/siteSettings/siteSettings";

const SITE_SETTINGS_CACHE_TAG = "site-settings";
export async function getSiteSettingsCacheTag() {return SITE_SETTINGS_CACHE_TAG}
export const getSiteSettings = unstable_cache(
    async () => {
        const supabase = createServerClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
                {cookies: {getAll() {return null}, setAll() {}}}
            );
        const {data, error} = await supabase
            .from("site_settings")
            .select("*")
        if (error) throw error;
        if (data.length === 0) throw new Error("No site settings found");
        if (data.length > 1) console.warn("Multiple rows found in site_settings table, using the first row");
        return data[0] as SiteSettings;
    },
    [SITE_SETTINGS_CACHE_TAG],
    {
        tags: [SITE_SETTINGS_CACHE_TAG],
        revalidate: 300
    }
);