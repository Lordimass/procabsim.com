import {Breadcrumb, BreadcrumbItem, Button} from "react-bootstrap";
import Image from "next/image";

export default function Page() {
    return (<div className={"main-page-content"}>
        <Breadcrumb>
            <BreadcrumbItem href="/">Home</BreadcrumbItem>
            <BreadcrumbItem active>Our Simulators</BreadcrumbItem>
            <BreadcrumbItem active>Class 700</BreadcrumbItem>
        </Breadcrumb>
        <h1>Class 700</h1>
        <p>
            Our first completed simulator, is a wheelchair accessible–converted CORYS Compact driver training
            simulator, Purchased from <i>Govia Thameslink Railway – Southern</i>, in January 2025 at their Selhurst
            driver training centre (Who donated the proceeds of the sale to charity), Using a heavily modified version
            of <i>Dovetail Games Train Sim World®</i> it was transformed from what it was (a generic drivers desk
            pictured with the <i>Windows XP</i> logo on the screens) to now represent a Class 700 style of cab desk
            using real cab components.
        </p>
        <Button href="https://www.youtube.com/shorts/-X2EO77Pg4g" variant="outline-primary">
            Watch a short video of the simplified cab setup here
        </Button>
        <div className={"simulator-showcase-images"}>
            <Image src="/class700/2.webp" width={300} height={400} alt="Class 700 image" />
            <Image src="/class700/1.webp" width={300} height={400} alt="Class 700 image" />
            <Image src="/class700/3.webp" width={300} height={400} alt="Class 700 image" />
        </div>
    </div>);
}