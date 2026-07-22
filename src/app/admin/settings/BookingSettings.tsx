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
import {getUser} from "@/lib/supabase/server";
import {getSiteSettingsCacheTag} from "@/lib/cache";
import invalidateCache from "@/lib/cacheClient";
import {constructDateFromLocalTime, constructDateFromUTCTime, getTimeString} from "@/lib/lib";

export default function BookingSettings({showLinkToCalendar = true}: {showLinkToCalendar?: boolean}) {
    const siteSettings = useContext(SiteSettingsContext);
    if (!siteSettings) {return <p>Site settings could not be loaded</p>}

    const [originalSiteSettings, setOriginalSiteSettings] = useState(siteSettings);
    const [newSiteSettings, setNewSiteSettings] = useState(originalSiteSettings);
    const [feedback, setFeedback] = useState("");

    const startTime = constructDateFromUTCTime(newSiteSettings.day_start)
    const endTime = constructDateFromUTCTime(newSiteSettings.day_end)

    async function handleSave() {
        setFeedback("");
        const supabase = createClient()
        const {error} = await supabase
            .from("site_settings")
            .update({
                bookings_enabled: newSiteSettings.bookings_enabled,
                day_start: newSiteSettings.day_start,
                day_end: newSiteSettings.day_end,
                session_minutes: newSiteSettings.session_minutes,
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

    return <><hr/><h2>Bookings</h2><hr/>
        <p>
            Settings changed here will only apply to new bookings, whilst existing bookings will be unaffected. All
            times are in your current local timezone.
        </p>
        <Form className={styles.settingsForm} id="booking-settings-form">
            {/* =============== BOOKINGS ENABLED ===============*/}
            <Form.Group><Row>
                <Col><Form.Label>Bookings Enabled</Form.Label></Col>
                <Col><Form.Check
                    type="checkbox"
                    aria-describedby="bookings-enabled-description"
                    checked={newSiteSettings.bookings_enabled}
                    onChange={(e) => {
                        setNewSiteSettings({...newSiteSettings, bookings_enabled: e.target.checked})
                        if (feedback !== "") setFeedback("")
                    }}/></Col>
            </Row>
                <Form.Text id="bookings-enabled-description">
                    Whether potential clients are currently allowed to make new bookings.
                </Form.Text>
            </Form.Group>

            {/* =============== START TIME ===============*/}
            <Form.Group><Row>
                <Col><Form.Label>Day Start</Form.Label></Col>
                <Col><Form.Control
                    type="time"
                    aria-describedby="day-start-description"
                    value={getTimeString(startTime)}
                    onChange={(e) => {
                        const date = constructDateFromLocalTime(e.target.value);
                        date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
                        setNewSiteSettings({...newSiteSettings, day_start: getTimeString(date)})
                        if (feedback !== "") setFeedback("")
                    }}/></Col>
            </Row>
                <Form.Text id="day-start-description">
                    The earliest time that a client is able to make a booking start. No new bookings will start earlier
                    than this.
                </Form.Text>
            </Form.Group>


            {/* =============== END TIME ===============*/}
            <Form.Group><Row>
                <Col><Form.Label>Day End</Form.Label></Col>
                <Col><Form.Control
                    type="time"
                    aria-describedby="day-end-description"
                    value={getTimeString(endTime)}
                    onChange={(e) => {
                        const date = constructDateFromLocalTime(e.target.value);
                        date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
                        setNewSiteSettings({...newSiteSettings, day_end: getTimeString(date)})
                    }}/></Col>
            </Row>
                <Form.Text id="day-end-description">
                    The latest time that a client is able to make a booking end. No new bookings will end any later than
                    this.
                </Form.Text>
            </Form.Group>

            {/* =============== SESSION LENGTH ===============*/}
            <Form.Group><Row>
                <Col><Form.Label>Session Length (Minutes)</Form.Label></Col>
                <Col><Form.Control
                    type="number"
                    aria-describedby="session-length-description"
                    value={newSiteSettings.session_minutes}
                    onChange={(e) => {
                        setNewSiteSettings({...newSiteSettings, session_minutes: Number(e.target.value) ?? 0})
                        if (feedback !== "") setFeedback("")
                    }}/></Col>
            </Row>
                <Form.Text id="session-length-description">
                    How long a session should run for, in minutes.
                </Form.Text>
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

        {showLinkToCalendar ? <p>
            If you want to block out specific or repeating times, or view your current bookings, go to{" "}
            <a href={"/admin/calendar"}>the calendar</a>.
        </p> : null}

    </>
}