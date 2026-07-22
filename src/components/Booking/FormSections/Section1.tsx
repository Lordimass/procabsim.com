import styles from "@/app/book/page.module.scss";
import SimulatorBook from "@/components/Booking/SimulatorBook/SimulatorBook";
import {Simulator} from "@/lib/types/types";
import {Dispatch, SetStateAction, useEffect, useRef, useState} from "react";
import {getSimulators} from "@/lib/cache";

interface Section1Props {
    selectedSimulator: Simulator | undefined;
    selectSimulator:  Dispatch<SetStateAction<Simulator | undefined>>;
}

export default function Section1({selectedSimulator, selectSimulator}: Section1Props) {
    const simulators = useGetSimulators();
    const selectedIndex = useRef<number>(undefined);

    return <div className={styles.formSection} id="formSection1">
        <hr/><h2>1. Choose a Simulator</h2><hr/>
        <p>We currently have {simulators.length} simulator available to book.</p>
        {
            simulators.map((sim, i) => (
                <SimulatorBook
                    simulator={sim}
                    selected={selectedIndex.current === i}
                    selectSimulator={(sim: Simulator) => {selectedIndex.current = i; selectSimulator(sim)}}
                    key={i}
                />
            ))
        }
    </div>
}

export function useGetSimulators() {
    const [simulators, setSimulators] = useState<(Simulator | null)[]>([null]);
    useEffect(() => {
        async function fetch() {
            const resp = await getSimulators()
            setSimulators(resp)
        }
        fetch().then()
    }, [])
    return simulators;
}