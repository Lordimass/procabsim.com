import {SupabaseClient} from "@supabase/supabase-js";

export default async function invalidateCache(supabase: SupabaseClient, tags: string[]) {
    const jwt = (await supabase.auth.getSession()).data.session?.access_token
    await fetch(window.location.origin + "/api/cache/invalidate", {
        method: "POST",
        headers: {"Authorization": `Bearer ${jwt}`},
        body: JSON.stringify({tags})
    })
}