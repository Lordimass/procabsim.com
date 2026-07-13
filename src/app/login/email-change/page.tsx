"use client";

import {Breadcrumb, BreadcrumbItem} from "react-bootstrap";

export default function Page() {
    const searchParams = new URLSearchParams(window.location.search);
    const msg = searchParams.get("message")
    const error = searchParams.get("error")
    const error_code = searchParams.get("error_code")
    const error_description = searchParams.get("error_description")
    if (!msg && !error) {
        window.location.href = "/login";
    }

    return <div className="main-page-content">
        <Breadcrumb>
            <BreadcrumbItem href="/">Home</BreadcrumbItem>
            <BreadcrumbItem href="/login">Login</BreadcrumbItem>
            <BreadcrumbItem active>Email Change</BreadcrumbItem>
        </Breadcrumb>
        {error ? <h1>{error_code}; {error}</h1>: null}
        <p>
            {msg ?? error_description}
        </p>
    </div>
}