import Image from "next/image";
import "./globals.scss"
import styles from "./page.module.scss";
import {Button} from "react-bootstrap";
import ImageMarquee from "@/components/ImageMarquee/ImageMarquee";

export default function Home() {
    return (<>
        <div id={styles.logo}>
            <Image
                src="/logo.svg"
                alt="Procab Logo"
                fill={true}
                priority
            />
        </div>
        <div id={styles.intro}>
            <h1>Our Vision</h1>
            <p>
                To create a place where people who may never get the chance – can experience what it’s like to drive a
                modern train, using real controls – in the safety of professional grade simulators, all whilst donating
                a portion of any money made to charities close to our owners hearts.
            </p>
            <h1>Fundraiser</h1>
            <p>
                We’re working hard to open to the public as soon as possible, but we could really do with your help to
                accomplish this a bit quicker. So we started a GoFundMe to help us move things along, If you could spare
                just £1 We would be eternally grateful, and – if you do donate please ensure to add your name so we can
                include you on our ‘Thank you Wall’.
            </p>
            <Button
                href="https://www.gofundme.com/f/fund-an-accessible-train-cab-simulator-experience"
                id={styles.donateButton}
            >Click here to donate</Button>
        </div>
        <div id={styles.supportersBox}>
            <p id={styles.supportersText}><b>Our amazing supporters:</b></p>
            <ImageMarquee images={[
                "/supporters/alstom.png",
                "/supporters/armstrong-powerhouse.jpeg",
                "/supporters/corys.png",
                "/supporters/craig&derricott.png",
                "/supporters/deuta-werke.png",
                "/supporters/dovetail.png",
                "/supporters/gessmann.png",
                "/supporters/grt.png",
                "/supporters/hitachi.png",
                "/supporters/lnwr-wmr.png",
                "/supporters/reality-modelling.jpg",
                "/supporters/retro-logo.png",
                "/supporters/spii.svg",
                "/supporters/train-sim-tech.png",
                "/supporters/train-sim-world.png",
                "/supporters/trent-instruments.png",
                "/supporters/unipart-rail.png"
            ]}/>
        </div>

    </>);
}
