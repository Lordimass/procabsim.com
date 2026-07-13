import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const { name, email, message } = body;

        await resend.emails.send({
            from: `${name} <onboarding@resend.dev>`, // TODO: Replace with custom domain
            to: "lordimass@lordimass.net", // TODO: Replace with correct endpoint email
            subject: `ProCabSim Contact Form - ${name}`,
            replyTo: email,
            html: `
<p>${message}</p>
<hr/>
<p><b>The above user filled in the "Contact us" entry form on the procabsim.com website.</b></p>`
        });

        await resend.emails.send({
            from: `${name} <onboarding@resend.dev>`, // TODO: Replace with custom domain
            to: `${email}`,
            subject: `ProCabSim Message Received - ${name}`,
            replyTo: "noreply@procabsim.com",
            html: `
<p>
    Hello!<br/>
    Thank you for contacting us, we will get in touch as soon as we can. The following message was received:
</p>
<p><i>"${message}"</i></p>
<p>
    Kind regards,<br/>
    ProCab Simulators
</p>
<hr/>
<p><b>
    This email is a receipt for your contact form submission on our website <a href="https://procabsim.com">procabsim.com</a> in which your email address was used. If that was not you, please ignore this message.
</b></p>`
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