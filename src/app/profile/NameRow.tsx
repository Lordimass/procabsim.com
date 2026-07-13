"use client";

import {MouseEvent, useState} from "react";
import {Button, FormControl} from "react-bootstrap";
import {createClient} from "@/lib/supabase/client";
import {Profile} from "@/lib/supabase/server";

export function NameRow({profile}: {profile: Profile}) {
    const [savedName, setSavedName] = useState(profile.name ?? "");
    const [profileName, setProfileName] = useState<string>(profile.name ?? "")
    const [error, setError] = useState<boolean>(false)

    async function handleSave(e: MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        const supabase = createClient()
        const {data, error} = await supabase
            .from("profiles")
            .update({"name": profileName})
            .eq("id", profile.id)
            .select()
        if (error) {
            console.error(error)
            setError(true)
        } else if (!data || data.length < 1) {
            console.error("No data returned")
            setError(true)
        } else {
            setProfileName(data[0].name)
            setSavedName(data[0].name)
        }
    }

    function handleReset(e: MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        setProfileName(savedName ?? "");
    }

    return <tr>
        <td>Name</td>
        <td colSpan={profileName === savedName ? 2 : 1}>
            <FormControl
                as={"textarea"}
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
            />
        </td>
        {profileName !== savedName ? <td><div className="save-and-reset-buttons">
            <Button disabled={error} onClick={handleSave}>Save</Button>
            <Button variant={"outline-primary"} onClick={handleReset}>Reset</Button>
        </div>
            {error ? <p>Something went wrong! Try again later...</p> : null}
        </td> : null}

    </tr>
}