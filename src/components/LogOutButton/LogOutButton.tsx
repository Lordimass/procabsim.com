"use client"

import {createClient} from "@/lib/supabase/client";
import {Button} from "react-bootstrap";

export default function LogoutButton() {
    const supabase = createClient()
    return <Button onClick={() => {
        supabase.auth.signOut().then(r => {
            if (r.error) throw r.error;
            window.location.href = "/login"
        })
    }}>
        Log Out
    </Button>
}