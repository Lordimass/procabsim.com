"use client";

import Breadcrumb from "react-bootstrap/Breadcrumb";
import {useContext} from "react";
import {SiteSettingsContext} from "@/lib/siteSettings/siteSettings";
import styles from "./page.module.scss"
import Supporters from "@/app/admin/settings/SupportersSettings";

export default function Page() {
    const siteSettings = useContext(SiteSettingsContext);
    if (!siteSettings) {return <p>Site settings could not be loaded</p>}

    return <div className="main-page-content">
        <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/admin">Admin</Breadcrumb.Item>
            <Breadcrumb.Item active>Settings</Breadcrumb.Item>
        </Breadcrumb>
        <h1>Admin Settings</h1>
        <p>Here, you can modify key information for the website's operation and appearance.</p>

        <Supporters/>
    </div>
}