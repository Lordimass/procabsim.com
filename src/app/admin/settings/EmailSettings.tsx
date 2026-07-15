import {useContext, useState} from "react";
import {SiteSettingsContext} from "@/lib/siteSettings";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import styles from "./page.module.scss"
import "./globals.scss"
import InputGroup from "react-bootstrap/esm/InputGroup";
import {Button} from "react-bootstrap";
import {createClient} from "@/lib/supabase/client";
import {getSiteSettingsCacheTag} from "@/lib/cache";
import invalidateCache from "@/lib/cacheClient";

export default function EmailSettings() {
    const siteSettings = useContext(SiteSettingsContext);
    if (!siteSettings) {return <p>Site settings could not be loaded</p>}

    const [originalSiteSettings, setOriginalSiteSettings] = useState(siteSettings);
    const [newSiteSettings, setNewSiteSettings] = useState(originalSiteSettings);
    const [feedback, setFeedback] = useState("");

    async function handleSave() {
        setFeedback("");
        const supabase = createClient()
        const {error} = await supabase
            .from("site_settings")
            .update({
                email_template_contact_form_confirmation: newSiteSettings.email_template_contact_form_confirmation,
                email_template_contact_form: newSiteSettings.email_template_contact_form,
            })
            .eq("id", "1")
        if (error) {
            console.error(error)
            setFeedback("Something went wrong!");
        } else {
            setFeedback("Saved successfully.");
            setOriginalSiteSettings(newSiteSettings)
            await invalidateCache(supabase, [await getSiteSettingsCacheTag()])
        }
    }

    function handleReset() {
        setNewSiteSettings(originalSiteSettings);
    }

    return <><hr/><h2>Emails</h2><hr/>
        <p>The following fields are written in HTML and accept the following template variables:</p>
        <ul>
            <li><code>$&#123;message&#125;</code> - The message the user sent.</li>
            <li><code>$&#123;email&#125;</code> - The email of the user.</li>
            <li><code>$&#123;name&#125;</code> - The name of the user.</li>
        </ul>
        <Form className={styles.settingsForm} id="email-settings-form">
            {/* =============== Contact Form Response Received ===============*/}
            <Form.Group>
                <Form.Label>Contact Form Response Received</Form.Label><br/>
                <Form.Text id="email_template_contact_form-description">
                    The format of the email that <i>you</i> receive when someone fills in the contact form.
                </Form.Text>
                <Form.Control
                    as="textarea"
                    aria-describedby="email_template_contact_form-description"
                    value={newSiteSettings.email_template_contact_form}
                    onChange={(e) => {
                        setNewSiteSettings({...newSiteSettings, email_template_contact_form: e.target.value})
                        if (feedback !== "") setFeedback("")
                        e.currentTarget.style.height = (e.currentTarget.scrollHeight) + "px"
                    }}
                    onFocus={(e) => {
                        e.currentTarget.style.height = (e.currentTarget.scrollHeight) + "px"
                    }}
                />
            </Form.Group>

            {/* =============== Contact Form Confirmation ===============*/}
            <Form.Group>
                <Form.Label>Contact Form Confirmation</Form.Label><br/>
                <Form.Text id="email_template_contact_form_confirmation-description">
                    The format of the email that the user receives as confirmation that the contact form was
                    successfully submitted.
                </Form.Text>
                <Form.Control
                    as="textarea"
                    aria-describedby="email_template_contact_form_confirmation-description"
                    value={newSiteSettings.email_template_contact_form_confirmation}
                    onChange={(e) => {
                        setNewSiteSettings({...newSiteSettings, email_template_contact_form_confirmation: e.target.value})
                        if (feedback !== "") setFeedback("")
                        e.currentTarget.style.height = (e.currentTarget.scrollHeight) + "px"
                    }}
                    onFocus={(e) => {
                        e.currentTarget.style.height = (e.currentTarget.scrollHeight) + "px"
                    }}
                />
            </Form.Group>

            {/* =============== SUBMISSION ===============*/}
            <div>
                <InputGroup>
                    <Button variant={"success"}
                            disabled={newSiteSettings === originalSiteSettings}
                            onClick={handleSave}>Save Changes</Button>
                    <Button variant={"danger"}
                            disabled={newSiteSettings === originalSiteSettings}
                            onClick={handleReset}>Reset</Button>
                </InputGroup>
                <p>{feedback}</p>
            </div>
        </Form>
    </>
}