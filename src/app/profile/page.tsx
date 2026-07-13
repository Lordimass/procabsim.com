import {createClient, getUser, getUserProfile} from "@/lib/supabase/server";
import {redirect} from "next/navigation";
import {Button, Table} from "react-bootstrap";
import "./globals.scss"
import { NameRow } from "@/app/profile/NameRow";
import {EmailRow} from "@/app/profile/EmailRow";
import {PasswordRow} from "@/app/profile/PasswordRow";

export default async function Page() {
    const supabase = await createClient()
    const user = await getUser(supabase);
    if (!user) {redirect("/login")}
    const profile = await getUserProfile(supabase)
    if (!profile) {redirect("/login")}

    return <div className="main-page-content" data-bs-theme="dark">
        <h1>Hello <b>{profile.name ?? user.email}</b>!</h1>
        <p>
            Welcome to your profile page. Here you can see important details about your account, and manage upcoming
            bookings.
        </p>
        <Table striped bordered hover><tbody>
            <NameRow profile={profile}/>
            <EmailRow user={user}/>
            <PasswordRow user={user}/>
            { profile.role !== "customer" ? // Don't show role to customers, it's not relevant.
                <tr>
                    <td>Role</td>
                    <td colSpan={2}>{profile.role}</td>
                </tr> : null
            }
        </tbody></Table>
    </div>
}