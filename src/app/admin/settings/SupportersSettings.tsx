import InputGroup from "react-bootstrap/InputGroup";
import {useContext, useState} from "react";
import {SiteSettingsContext} from "@/lib/siteSettings";
import {Button, FormControl} from "react-bootstrap";
import styles from "./page.module.scss"
import {createClient} from "@/lib/supabase/client";
import invalidateCache from "@/lib/cacheClient";
import {getSiteSettingsCacheTag} from "@/lib/cache";

export default function SupportersSettings() {
    const siteSettings = useContext(SiteSettingsContext);
    if (!siteSettings) {return <p>Site settings could not be loaded</p>}

    const [originalSupporters, setOriginalSupporters] = useState(siteSettings.supporters);
    const [newSupporters, setNewSupporters] = useState(originalSupporters);
    const [feedback, setFeedback] = useState("");

    async function handleSave() {
        setFeedback("");
        const supabase = createClient()
        const {error} = await supabase
            .from("site_settings")
            .update({supporters: newSupporters})
            .eq("id", "1")
        if (error) {
            console.error(error)
            setFeedback("Something went wrong!");
        } else {
            setFeedback("Saved successfully.");
            setOriginalSupporters(newSupporters)
            await invalidateCache(supabase, [await getSiteSettingsCacheTag()])
        }
    }

    function handleReset() {
        setNewSupporters(originalSupporters);
    }

    return <><hr/><h2>Supporters</h2><hr/>
        <p>
            References to images which should be displayed as a "supporter" on the home page. These may be relative
            paths to images stored in the '/public/' directory on the server, e.g. '/supporters/hitachi.png', or they
            may be URLs which point to an image on the internet somewhere.
        </p>
    <InputGroup className={styles.supporters}>
        {newSupporters.map((supporter, i) => <InputGroup key={i} className={styles.supporter}>
            <FormControl value={supporter} onChange={(e) => {
                setNewSupporters([...newSupporters.slice(0, i), e.currentTarget.value, ...newSupporters.slice(i+1)]);
                if (feedback !== "") setFeedback("")
            }}/>
            <Button onClick={() => {
                setNewSupporters([...newSupporters.slice(0, i), ...newSupporters.slice(i+1)])
                if (feedback !== "") setFeedback("")
            }}>X</Button>
        </InputGroup>)}

        <Button id={styles.supportersAddButton} onClick={() => {
            setNewSupporters([...newSupporters, ""])
        }}>Add</Button>
        <InputGroup>
            <Button variant={"success"}
                    disabled={newSupporters === originalSupporters}
                    onClick={handleSave}>Save Changes</Button>
            <Button variant={"danger"}
                    disabled={newSupporters === originalSupporters}
                    onClick={handleReset}>Reset</Button>
        </InputGroup>
        <p>{feedback}</p>
    </InputGroup></>
}