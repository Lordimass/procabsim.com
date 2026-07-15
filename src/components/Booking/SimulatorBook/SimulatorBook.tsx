import "./SimulatorBook.scss"
import Image from "next/image";
import {Button, Placeholder} from "react-bootstrap";
import {Simulator} from "@/lib/types/types";
import Markdown from "react-markdown";
import {useContext, useRef} from "react";
import {SiteSettingsContext} from "@/lib/siteSettings";

interface SimulatorBookProps {
    simulator: Simulator | null;
    selected: boolean;
    selectSimulator: (sim: Simulator) => void;
}

export default function SimulatorBook({simulator, selected, selectSimulator}: SimulatorBookProps) {
    if (!simulator) return <PlaceholderSimulator/>;
    const siteSettings = useContext(SiteSettingsContext);
    if (!siteSettings) {return <p>Failed to load site settings</p>}

    const firstImage = simulator.images[0];
    const priceElement = <b>£{simulator.sim.price.toFixed(2)}</b>

    return <div className="simulator-book">
        {firstImage ? <div>
            <Image src={firstImage.url} alt={firstImage.alt} width={200} height={200} loading="eager" />
        </div> : null}

        <div className="simulator-book-content">
            <h2>{simulator.sim.name}</h2>
            <Markdown>{simulator.sim.description}</Markdown>
            <a href={`/simulators/${simulator.sim.id}`}>Read More</a>
            <hr/>
            <Button
                variant="outline-primary"
                onClick={() => selectSimulator(simulator)}
                disabled={selected || !siteSettings.bookings_enabled}
            >
                {siteSettings.bookings_enabled
                    ? selected ? <>Selected for {priceElement}</> : <>Book a slot on this simulator for {priceElement}</>
                    : <>No available space.</>
                }
            </Button>
        </div>
    </div>
}

function PlaceholderSimulator() {
    return <div className="simulator-book">
        <div>
            <div
                className="simulator-book-placeholder-image"
            ></div>
        </div>

        <div className="simulator-book-content">
            <Placeholder as="h2" animation="glow">
                <Placeholder xs={6} />
            </Placeholder>

            <Placeholder animation="glow" style={{display: "flex", flexDirection: "column", gap: "5px"}} >
                <Placeholder style={{ width: "95%" }} />
                <Placeholder style={{ width: "80%" }} />
                <Placeholder style={{ width: "15%" }} />
            </Placeholder>
            <hr/>

            <Placeholder.Button variant="outline-primary"/>
        </div>
    </div>
}