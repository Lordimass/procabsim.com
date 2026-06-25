"use client"

import {Breadcrumb, BreadcrumbItem} from "react-bootstrap";
import SimulatorBook from "@/components/SimulatorBook/SimulatorBook";
import {createClient} from "@/lib/supabase/client"
import {useEffect, useState} from "react";

export default function Page() {
    const supabase = createClient();
    const [simulators, setSimulators] = useState<any[]>([]);
    useEffect(() => {
        async function fetch() {
            const resp = await supabase.rpc("get_simulators_with_images")
            setSimulators(resp.data)
        }
        fetch().then()
    }, [])

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