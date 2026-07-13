import {Breadcrumb, BreadcrumbItem} from "react-bootstrap";

export default function Page() {
    return <div className="main-page-content">
        <Breadcrumb>
            <BreadcrumbItem href="/">Home</BreadcrumbItem>
            <BreadcrumbItem href="/login">Login</BreadcrumbItem>
            <BreadcrumbItem active>Welcome</BreadcrumbItem>
        </Breadcrumb>
        <h1>Your email has been verified</h1>
        <p>
            You have successfully verified your email! You can now <a href="/login">login</a> to your account.
        </p>
    </div>
}