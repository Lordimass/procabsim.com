import styles from "@/app/book/page.module.scss";
import {Button, Form, FormCheck, FormLabel} from "react-bootstrap";

import "./Section5.scss"
import SumUp from "@sumup/sdk";
import {useState} from "react";

interface Props {
    payment_amount: number;
}

export default function Section5({payment_amount}: Props) {
    const [error, setError] = useState<string>();

    const sumup = new SumUp();
    async function createOnlineCheckout() {
        return await sumup.checkouts.create({
            amount: payment_amount,
            currency: "GBP",
            checkout_reference: "payment_" + (new Date()).toUTCString(),
            merchant_code: process.env.SUMUP_MERCHANT_CODE ?? "",
            redirect_url: "thank-you",
            hosted_checkout: {
                enabled: true
            }
        });
    }

    return <div className={styles.formSection} id="formSection5">
        <hr/>
        <h2> 5. Briefing</h2>
        <hr/>
        <p>
            Before you make your booking, we need to give you a little information and ask a few questions.
        </p>

        {/* TODO: Save results from this */}

        <Form id="pre-briefing-quiz">
            <FormLabel>This is a sample question!</FormLabel>
            <div className="mb-3">
                <FormCheck type="radio" name="question1" label="Option 1"/>
                <FormCheck type="radio" name="question1" label="Option 2"/>
                <FormCheck type="radio" name="question1" label="Option 3"/>
                <FormCheck type="radio" name="question1" label="Option 4"/>
            </div>
            <FormLabel>This is a sample question! It needs filling in with a real question.</FormLabel>
            <div className="mb-3">
                <FormCheck type="radio" name="question1" label="Option 1"/>
                <FormCheck type="radio" name="question1" label="Option 2"/>
                <FormCheck type="radio" name="question1" label="Option 3"/>
                <FormCheck type="radio" name="question1" label="Option 4"/>
            </div>
            <Button variant="outline-primary" onClick={async () => {
                try {
                    const checkout = await createOnlineCheckout();
                    window.location.href = checkout.hosted_checkout_url!
                } catch (e: any) {
                    setError("Something went wrong! Sorry!");
                    console.error(e)
                }
            }}>
                Finish and Pay
            </Button>
        </Form>
        {error ? <p>{error}</p> : null}
    </div>
}