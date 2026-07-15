import { NextResponse } from "next/server";
import { Resend } from "resend";
import {getSiteSettings} from "@/lib/cache";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
    try {
        const {email_template_contact_form, email_template_contact_form_confirmation} = await getSiteSettings()
        const body = await request.json();
        const { name, email, message } = body;
        let email_contact_form = email_template_contact_form;
        email_contact_form = email_contact_form.replace(`$\{name\}`, name);
        email_contact_form = email_contact_form.replace(`$\{email\}`, email);
        email_contact_form = email_contact_form.replace(`$\{message\}`, message);
        let email_contact_form_confirmation = email_template_contact_form_confirmation;
        email_contact_form_confirmation = email_contact_form_confirmation.replace(`$\{name\}`, name);
        email_contact_form_confirmation = email_contact_form_confirmation.replace(`$\{email\}`, email);
        email_contact_form_confirmation = email_contact_form_confirmation.replace(`$\{message\}`, message);

        await resend.emails.send({
            from: `${name} <onboarding@resend.dev>`, // TODO: Replace with custom domain
            to: "lordimass@lordimass.net", // TODO: Replace with correct endpoint email
            subject: `ProCabSim Contact Form - ${name}`,
            replyTo: email,
            html: email_contact_form,
        });

        await resend.emails.send({
            from: `${name} <onboarding@resend.dev>`, // TODO: Replace with custom domain
            to: `${email}`,
            subject: `ProCabSim Message Received - ${name}`,
            replyTo: "noreply@procabsim.com",
            html: email_contact_form_confirmation
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            { success: false },
            { status: 500 }
        );
    }
}