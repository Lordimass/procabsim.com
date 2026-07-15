"use client";

import {createContext, ReactNode} from "react";

export interface SiteSettings {
    id: number;
    supporters: string[];
    bookings_enabled: boolean;
    day_start: string;
    day_end: string;
    session_minutes: number
    email_template_contact_form_confirmation: string;
    email_template_contact_form: string;
}

export const SITE_SETTINGS_CACHE_TAG = "site-settings";

export const SiteSettingsContext = createContext<SiteSettings | null>(null);

export default function SiteSettingsProvider({ value, children }: { value: SiteSettings | null, children: ReactNode }) {
    return <SiteSettingsContext.Provider value={value}>{children}</SiteSettingsContext.Provider>;
}