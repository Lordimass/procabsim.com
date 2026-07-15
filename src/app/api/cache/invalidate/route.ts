import {NextRequest} from "next/server";
import {createClient} from "@/lib/supabase/server";
import {revalidateTag} from "next/cache";

const BAD_JWT_RESPONSE = new Response("Supply a JWT in the Authorization header in the form 'Bearer {{JWT}}'", {status: 401});
const NO_USER_RESPONSE = new Response("JWT did not evaluate to a valid user.", {status: 401});
const NO_PROFILE_RESPONSE = new Response("Couldn't find a profile associated with that user.", {status: 401});
const NO_ADMIN_RESPONSE = new Response("That user does not have permission to invalidate caches. User must have 'admin' role.", {status: 401});
const NO_TAGS_RESPONSE = new Response("No 'tags' supplied in body.", {status: 400});
const BAD_TAG_RESPONSE = new Response("All tags must be of type 'string'", {status: 400});

export async function POST(request: NextRequest) {
    const supabase = await createClient()
    const authorization = request.headers.get("Authorization");
    if (!authorization) return BAD_JWT_RESPONSE;
    const split = authorization.split(" ")
    if (split.length != 2) return BAD_JWT_RESPONSE;
    const jwt = split[1];
    const {data: {user}, error} = await supabase.auth.getUser(jwt)
    if (error) {
        console.error(error);
        return new Response(undefined, {status: 500});
    }
    if (!user) return NO_USER_RESPONSE

    const {data: profileData, error: profileError} = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
    if (profileError) {console.error(error); return new Response(undefined, {status: 500});}
    else if (!profileData || profileData.length === 0) return NO_PROFILE_RESPONSE
    else if (profileData[0].role !== "admin") return NO_ADMIN_RESPONSE;

    const body = await request.json()
    if (typeof body.tags !== "object" || body.tags.length === 0) {
        return NO_TAGS_RESPONSE;
    }
    const tags = body.tags
    for (let tag of tags) {
        if (typeof tag !== "string") return BAD_TAG_RESPONSE;
        revalidateTag(tag, "max")
    }
    return new Response(undefined, {status: 204})
}