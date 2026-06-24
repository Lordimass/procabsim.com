import {Breadcrumb, BreadcrumbItem} from "react-bootstrap";
import path from "node:path";
import * as fs from "node:fs";
import SimulatorBook from "@/components/SimulatorBook/SimulatorBook";

export default async function Page() {
    const files = await new Promise((resolve, reject) => {
        fs.readdir(process.cwd() + "/public/simulators", undefined,
            (err, files) => {
                if (err) reject(err);
                else resolve(files);
            });
    })
    console.log(files);

    return <div className="main-page-content">
        <Breadcrumb>
            <BreadcrumbItem href="/">Home</BreadcrumbItem>
            <BreadcrumbItem active>Book</BreadcrumbItem>
        </Breadcrumb>
        <h1>Book Your Train Simulator Experience</h1>
        <p>We currently have 1 simulator available to book.</p>
        <SimulatorBook/>
    </div>
}