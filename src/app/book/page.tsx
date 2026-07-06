"use client"

import {Breadcrumb, BreadcrumbItem} from "react-bootstrap";
import {useEffect, useState} from "react";
import {Simulator} from "@/lib/types/types";
import "@daypicker/react/style.css"
import Section1 from "@/components/Booking/FormSections/Section1";
import Section2 from "@/components/Booking/FormSections/Section2";
import Section3 from "@/components/Booking/FormSections/Section3";

export default function Page() {
    const [selectedSimulator, selectSimulator] = useState<Simulator>();
    const [accessibilityRead, setAccessibilityRead] = useState(false);
    const [date, setDate] = useState<Date>();

    useEffect(() => {
        setAccessibilityRead(false);
    }, [selectedSimulator]);

    return <div className="main-page-content">
        <Breadcrumb>
            <BreadcrumbItem href="/">Home</BreadcrumbItem>
            <BreadcrumbItem active>Book</BreadcrumbItem>
        </Breadcrumb>
        <h1>Book Your Train Simulator Experience</h1>
        <p>The following form will take you through the steps of booking your simulator experience. It's important read
            each part carefully to ensure we can give you the best service possible.</p>

        <Section1 selectedSimulator={selectedSimulator} selectSimulator={selectSimulator}/>

        {selectedSimulator
            ? <Section2
                selectedSimulator={selectedSimulator}
                accessibilityRead={accessibilityRead}
                setAccessibilityRead={setAccessibilityRead}
            /> : null}

        {accessibilityRead
            ? <Section3
                date={date}
                setDate={setDate}
            />: null}
    </div>
}