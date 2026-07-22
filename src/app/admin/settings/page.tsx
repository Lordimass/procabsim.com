"use client";

import Breadcrumb from "react-bootstrap/Breadcrumb";
import {useContext, useEffect, useState} from "react";
import {SiteSettingsContext} from "@/lib/siteSettings";
import styles from "./page.module.scss"
import SupportersSettings from "@/app/admin/settings/SupportersSettings";
import BookingSettings from "@/app/admin/settings/BookingSettings";
import EmailSettings from "@/app/admin/settings/EmailSettings";
import SimulatorSettings from "@/app/admin/settings/SimulatorSettings";
import {createClient} from "@/lib/supabase/client";
import Button from "react-bootstrap/Button";
import OptionalExtraSettings from "@/app/admin/settings/OptionalExtraSettings";

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

        <BookingSettings/>
        <SupportersSettings/>
        <EmailSettings/>
        <SimulatorSettings/>
        <OptionalExtraSettings/>

    </div>
}

export function DeleteFromListButton<T>(
    {item, tableName, idRowName="id", itemId, removeAction}: {
        item: T,
        tableName: string,
        idRowName?: string,
        itemId: any,
        removeAction: () => void,
    }) {
    const [deletionConfirmation, setDeletionConfirmation] = useState(false);

    useEffect(() => {
        setDeletionConfirmation(false);
    }, [item])

    async function handleDelete() {
        if (!deletionConfirmation) {
            window.setTimeout(() => {
                setDeletionConfirmation(true);
            }, 250)
            return
        }

        const supabase = createClient();
        await supabase
            .from(tableName)
            .delete()
            .eq(idRowName, itemId)

        removeAction()
    }

    return <Button
        variant={deletionConfirmation ? "danger" : "outline-danger"}
        onClick={handleDelete}
    >
        {deletionConfirmation ? "Are you sure?" : "Delete Item Entirely"}
    </Button>
}