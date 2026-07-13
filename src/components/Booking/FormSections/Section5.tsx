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
            Before you make your booking, we need to confirm you understand what we expect from you, and what you should
            expect from us.
        </p>

        {/* TODO: Save results from this */}

        <Form id="quiz">
            <FormLabel>What do you know about driving a train? (Choose only 1 option)</FormLabel>
            <div className="mb-3">
                <FormCheck type="radio" name="question1" label={<><b>Novice</b> - The 'What is a <i>"Train"</i>' / 'I only know what a train is' level"</>}/>
                <FormCheck type="radio" name="question1" label={<><b>Amateur</b> - I've driven trains on simulators like Train Sim world/Train Sim Classic but never used the real controls</>}/>
                <FormCheck type="radio" name="question1" label={<><b>Intermediate</b> -  I've driven trains on heritage railways on driver experience trips but know nothing about safety systems</>}/>
                <FormCheck type="radio" name="question1" label={<><b>Intermediate + Safety Systems</b> - I know about safety systems of UK trains.</>}/>
                <FormCheck type="radio" name="question1" label={<><b>Professional</b> - I'm a currently qualified/recently retired Mainline Train Driver.</>}/>
            </div>
            <FormLabel>
                This is NOT a training session but an educational experience, and that anything learned is NOT to be
                repeated on real trains unless you have the express permission of doing so from the owner/operator of
                those trains.
            </FormLabel>
            <div className="mb-3"><FormCheck type="radio" name="question2" label="I understand"/></div>
            <FormLabel>
                These are real components and sensitive equipment, and should be treated with respect, if I am deemed to
                be disrespecting the equipment used in the simulators, I will be asked to leave the building, with no refund.
            </FormLabel>
            <div className="mb-3"><FormCheck type="radio" name="question3" label="I understand"/></div>
            <FormLabel>
                As with the components/equipment, that I should treat my experience instructor with respect, any forms
                of harassment/discrimination will be treated in the same way as disrespecting components.
            </FormLabel>
            <div className="mb-3"><FormCheck type="radio" name="question4" label="I understand"/></div>
            <FormLabel>
                Some aspects of the experience may differ from reality due to difficulty in obtaining reference, or
                operational limitations of the simulators. - We aim to be as close to reality as possible
            </FormLabel>
            <div className="mb-3"><FormCheck type="radio" name="question5" label="I understand"/></div>
            <FormLabel>
                As per the cancellation policy - in the event I need to cancel/re-arrange my session, I need to give at
                least 24 hours notice, not showing for my session will disqualify me for re-arranging my session and
                negate a refund being issued.
            </FormLabel>
            <div className="mb-3"><FormCheck type="radio" name="question6" label="I understand"/></div>
            <FormLabel>
                If I have a disability that may affect my experience, I should make ProCab Simulators aware prior to
                arriving for my session so that they can better accommodate my disability prior to my session starting.
            </FormLabel>
            <div className="mb-3"><FormCheck type="radio" name="question7" label="I understand"/></div>
            <FormLabel>
                In very rare circumstances, the simulator I have chosen to use, may be unavailable due to technical
                reasons, should this happen more than 24 hours prior to my session starting, I will be informed by
                ProCab Simulators by means of phone call and/Or e-mail. should this happen on the day of my session, I
                will be sent an email/text message by ProCab Simulators to inform me, and I will be able to choose to
                re-schedule, or continue my session with a different simulator.
            </FormLabel>
            <div className="mb-3"><FormCheck type="radio" name="question8" label="I understand"/></div>
            <FormLabel>
                As per reality, some of my session may be spent waiting at red signals, my instructor will monitor this,
                and if it appears to go on too long, will speed up time or attempt to clear the issue - this may break
                immersion but will allow for more driving time.
            </FormLabel>
            <div className="mb-3"><FormCheck type="radio" name="question9" label="I understand"/></div>
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