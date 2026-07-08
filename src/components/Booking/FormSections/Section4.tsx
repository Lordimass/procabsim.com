import styles from "@/app/book/page.module.scss";
import {Simulator, SimulatorOptionalExtra} from "@/lib/types/types";
import {Button, ToggleButton, ToggleButtonGroup} from "react-bootstrap";

import "./Section4.scss"

interface Props {
    simulator: Simulator;
    optionalExtras: SimulatorOptionalExtra[]
    setOptionalExtras: (optionalExtras: SimulatorOptionalExtra[]) => void;
}

export default function Section4({simulator, optionalExtras, setOptionalExtras}: Props) {
    return <div className={styles.formSection} id={"formSection4"}>
        <hr/>
        <h2>4. Optional Extras</h2>
        <hr/>
        <div className="optional-extras">
            {simulator.extras.map((extra) =>
                <OptionalExtra
                    extra={extra}
                    key={extra.name}
                    optionalExtras={optionalExtras}
                    setOptionalExtras={setOptionalExtras}
                />
            )}
        </div>
    </div>;
}

interface OptionalExtraProps {
    extra: SimulatorOptionalExtra,
    optionalExtras: SimulatorOptionalExtra[]
    setOptionalExtras: (optionalExtras: SimulatorOptionalExtra[]) => void;
}

function OptionalExtra({extra, optionalExtras, setOptionalExtras}: OptionalExtraProps) {
    const priceElement = extra.price ? <b>£{extra.price.toFixed(2)}</b> : null;

    return <div className="optional-extra" id={`optional-extra-${extra.name}`}>
        <h2 className="optional-extra-header">{extra.name}</h2>
        <p className="optional-extra-desc">{extra.description}</p>
        {extra.disclaimer ? <>
            <hr/>
            <p><b>DISCLAIMER: </b><i>{extra.disclaimer}</i></p>
            <hr/>
        </> : null}
        <ToggleButtonGroup type="checkbox">
            <ToggleButton
                id={extra.name}
                value={extra.name}
                className="optional-extra-btn"
                checked={optionalExtras.includes(extra)}
                onClick={() => {
                    let newOptionalExtras: SimulatorOptionalExtra[];
                    if (optionalExtras.includes(extra)) {
                        newOptionalExtras = optionalExtras.filter(e => e.name !== extra.name);
                    } else {
                        newOptionalExtras = [...optionalExtras, extra];
                    }
                    setOptionalExtras(newOptionalExtras);
                }}
            >

                {optionalExtras.includes(extra)
                    ? priceElement ? <>✅ Extra has been added [+{priceElement}]</> : "✅ Extra has been added"
                    : priceElement ? <>Add [+{priceElement}]</> : "Add"}
            </ToggleButton>
        </ToggleButtonGroup>

    </div>;
}