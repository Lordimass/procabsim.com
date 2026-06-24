import "./SimulatorBook.scss"
import Image from "next/image";
import {Price} from "lordis-react-components";
import {Button} from "react-bootstrap";

export default function SimulatorBook() {
    return <div className="simulator-book">
        <div>
            <Image src={"/simulators/class700/1.webp"} alt={""} width={200} height={200} />
        </div>

        <div className="simulator-book-content">
            <h2>Class 700</h2>
            <p>
                Our first completed simulator, is a wheelchair accessible–converted CORYS Compact driver training
                simulator, Purchased from <i>Govia Thameslink Railway – Southern</i>, in January 2025 at their Selhurst
                driver training centre (Who donated the proceeds of the sale to charity).
            </p>
            <a href={"/simulators/class700"}>Read More</a>
            <hr/>
            <Button variant="outline-primary">Book a slot on this simulator for <b>£20.00</b></Button>
        </div>
    </div>
}