import ContactForm from "@/components/ContactForm/ContactForm";
import {Breadcrumb, BreadcrumbItem} from "react-bootstrap";

export default function Page() {
    return <div className="main-page-content">
        <Breadcrumb>
            <BreadcrumbItem href="/">Home</BreadcrumbItem>
            <BreadcrumbItem active>Contact Us</BreadcrumbItem>
        </Breadcrumb>
        <ContactForm/>
    </div>
}