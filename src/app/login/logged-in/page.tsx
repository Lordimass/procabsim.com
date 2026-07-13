import {Breadcrumb, BreadcrumbItem} from "react-bootstrap";
import {createClient as createServerClient} from "@/lib/supabase/server";
import {redirect} from "next/navigation";
import LogoutButton from "@/components/LogOutButton/LogOutButton";

export default async function Page() {
    const supabase = await createServerClient()
    const {data: {user}, error: getUserError} = await supabase.auth.getUser();
    if (getUserError) throw getUserError;
    else if (!user) {
        redirect("/login")
    }

    return <div className="main-page-content">
        <Breadcrumb>
            <BreadcrumbItem href="/">Home</BreadcrumbItem>
            <BreadcrumbItem href="/login">Login</BreadcrumbItem>
            <BreadcrumbItem active>Logged In</BreadcrumbItem>
        </Breadcrumb>
        <h1>You're logged in!</h1>
        <p>
            You have logged in to your account with the email address <u>{user.email}</u>.
        </p>
        <LogoutButton/>

    </div>
}

