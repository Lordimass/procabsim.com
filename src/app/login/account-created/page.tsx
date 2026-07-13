import {Breadcrumb, BreadcrumbItem} from "react-bootstrap";
import {createClient as createServerClient} from "@/lib/supabase/server";
import {redirect} from "next/navigation";

export default async function Page() {
    const supabase = await createServerClient()
    const {data: {user}, error: getUserError} = await supabase.auth.getUser();
    if (getUserError) throw getUserError;
    else if (user) {
        redirect("/login/logged-in")
    }

    return <div className="main-page-content">
        <Breadcrumb>
            <BreadcrumbItem href="/">Home</BreadcrumbItem>
            <BreadcrumbItem href="/login">Login</BreadcrumbItem>
            <BreadcrumbItem active>Account Created</BreadcrumbItem>
        </Breadcrumb>
        <h1>Verify Your Email</h1>
        <p>
            You have successfully created a new account! We've sent you an email with a verification link, then you
            can <a href="/login">login</a> to your account.
        </p>
    </div>
}