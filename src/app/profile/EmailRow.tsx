"use client";

import {MouseEvent, useState} from "react";
import {Button, FormControl} from "react-bootstrap";
import {createClient} from "@/lib/supabase/client";
import {User} from "@supabase/supabase-js";

export function EmailRow({user}: {user: User}) {
    const [savedEmail, setSavedEmail] = useState(user.email ?? "");
    const [email, setEmail] = useState<string>(user.email ?? "")
    const [error, setError] = useState<boolean>(false)
    const [updated, setUpdated] = useState<boolean>(false)

    async function handleSave(e: MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        const supabase = createClient()
        const {data, error} = await supabase.auth
            .updateUser({"email": email}, {emailRedirectTo: window.location.origin + "/login/email-password-change"})
        if (error) {
            console.error(error)
            setError(true)
        } else {
            setUpdated(true)
        }
    }

    function handleReset(e: MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        setEmail(savedEmail ?? "");
    }

    return <tr>
        <td>Email</td>
        <td colSpan={email === savedEmail ? 2 : 1}>
            <FormControl
                disabled={updated}
                as={"textarea"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
        </td>
        {email !== savedEmail ? <td><div className="save-and-reset-buttons">
            <Button disabled={error || updated} onClick={handleSave}>Save</Button>
            <Button variant={"outline-primary"} onClick={handleReset}>Reset</Button>
        </div>
            {error ? <p>Something went wrong! Try again later...</p> : null}
            {updated ? <p>We've sent your old email and your new email a link to confirm the change.</p> : null}
        </td> : null}

    </tr>
}