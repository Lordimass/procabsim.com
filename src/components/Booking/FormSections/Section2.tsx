import styles from "@/app/book/page.module.scss";
import {Simulator} from "@/lib/types/types";
import Markdown from "react-markdown";
import {FormControl, FormLabel} from "react-bootstrap";
import FormCheckInput from "react-bootstrap/cjs/FormCheckInput";
import {Dispatch, SetStateAction} from "react";
import "./Section2.scss"

interface Section2Props {
    selectedSimulator: Simulator | undefined;
    accessibilityRead: boolean;
    setAccessibilityRead: Dispatch<SetStateAction<boolean>>
}

export default function Section2({selectedSimulator, accessibilityRead, setAccessibilityRead}: Section2Props) {
    return <div className={styles.formSection} id="formSection2">
        <hr/><h2>2. Accessibility Details</h2><hr/>
        <Markdown>{selectedSimulator?.sim.accessibility_details}</Markdown>
        <FormLabel>
            If you have specific accessibility needs you would like us to know about please enter them below.
        </FormLabel>
        <FormControl as="textarea" name="message"/> {/* TODO: Save this */}
        <p>
            Information entered here may be read or shared internally in order to do our best to help you. We
            will never share your information externally. Please see our <a href="/privacy">Privacy Policy</a>{" "}
            for more details.
        </p>
        <div id="accessibilityInfoRead">
            <FormCheckInput
                checked={accessibilityRead}
                onChange={() => {
                    setAccessibilityRead(!accessibilityRead)
                }}
            />
            <p>I have read and acknowledge the information above.</p>
        </div>
    </div>
}