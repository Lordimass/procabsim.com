import {createClient, getUser, getUserProfile, Profile} from "@/lib/supabase/server";
import {redirect} from "next/navigation";
import {Breadcrumb, BreadcrumbItem, Button, Table} from "react-bootstrap";
import "./globals.scss"
import {NameRow} from "@/app/profile/NameRow";
import {EmailRow} from "@/app/profile/EmailRow";
import {PasswordRow} from "@/app/profile/PasswordRow";
import {User} from "@supabase/supabase-js";
import Image from "next/image";

export default async function Page() {
    const supabase = await createClient()
    const user = await getUser(supabase);
    if (!user) {
        redirect("/login")
    }
    const profile = await getUserProfile(supabase)
    if (!profile) {
        redirect("/login")
    }

    return <div className="main-page-content" data-bs-theme="dark">
        <Breadcrumb>
            <BreadcrumbItem href="/">Home</BreadcrumbItem>
            <BreadcrumbItem active>Profile</BreadcrumbItem>
        </Breadcrumb>
        <h1>Hello <b>{profile.name ?? user.email}</b>!</h1>
        <p>
            Welcome to your profile page. Here you can see important details about your account, and manage upcoming
            bookings.
        </p>
        <Table striped bordered hover>
            <tbody>
            <NameRow profile={profile}/>
            <EmailRow user={user}/>
            <PasswordRow user={user}/>
            {profile.role !== "customer" ? // Don't show role to customers, it's not relevant.
                <tr>
                    <td>Role</td>
                    <td colSpan={2}>{profile.role}</td>
                </tr> : null
            }
            </tbody>
        </Table>
        {profile.role === "admin" ? <AdminPanel user={user} profile={profile}/> : null}
    </div>
}

function AdminPanel({user, profile}: { user: User, profile: Profile }) {
    const panelLinks = [
        {
            name: "Settings",
            href: "/admin/settings",
            icon: "/cog.svg"
        },
        {
            name: "Calendar",
            href: "/admin/calendar",
            icon: "/calendar.svg"
        }]
    return <>
        <hr/>
        <h1>Admin Panel</h1>
        <p>Only admins can access this panel, customer accounts are not be able to see this section.</p>

        <div className="adminPanel">
            {panelLinks.map((link) => (
                <Button variant={"outline-primary"} key={link.name} className={"panelLink"} href={link.href}>
                    <Image
                        src={link.icon}
                        alt={link.name}
                        width={150}
                        height={150}
                        className={"invert"}
                    />
                    <h3>{link.name}</h3>
                </Button>))}
        </div>
    </>
}