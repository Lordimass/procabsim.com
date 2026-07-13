"use client";

import {MouseEvent, useState} from "react";
import {Button, FormControl} from "react-bootstrap";
import {createClient} from "@/lib/supabase/client";
import {User} from "@supabase/supabase-js";

export function PasswordRow({user}: {user: User}) {
    const [error, setError] = useState<boolean>(false)
    const [updated, setUpdated] = useState<boolean>(false)

    async function handleReset(e: MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        const supabase = createClient()
        const {data, error} = await supabase.auth
            .resetPasswordForEmail(user.email!, {redirectTo: window.location.origin + "/login/email-change"})
        if (error) {
            console.error(error)
            setError(true)
        } else {
            setUpdated(true)
        }
    }

    return <tr>
        <td>Password</td>
        <td colSpan={3}>
            <Button variant={"outline-primary"} onClick={handleReset}>Reset</Button>
            {error ? <p>Something went wrong! Try again later...</p> : null}
            {updated ? <p>We've sent you an email with a link to reset your password.</p> : null}
        </td>
    </tr>
}