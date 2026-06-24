import privacyPolicy from "../../../public/policies/privacy.md"
import Policy from "@/components/Policy/Policy";
import {Breadcrumb, BreadcrumbItem} from "react-bootstrap";

export default function Page() {
    return <div className="main-page-content">
        <Breadcrumb>
            <BreadcrumbItem href="/">Home</BreadcrumbItem>
            <BreadcrumbItem active>Privacy Policy</BreadcrumbItem>
        </Breadcrumb>
        <Policy>{privacyPolicy}</Policy>
    </div>
}