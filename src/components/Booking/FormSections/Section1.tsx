import styles from "@/app/book/page.module.scss";
import SimulatorBook from "@/components/Booking/SimulatorBook/SimulatorBook";
import {Simulator} from "@/lib/types/types";
import {Dispatch, SetStateAction, useEffect, useRef, useState} from "react";
import {createClient} from "@/lib/supabase/client";

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

function useGetSimulators() {
    const supabase = createClient();
    const [simulators, setSimulators] = useState<(Simulator | null)[]>([null]);
    useEffect(() => {
        async function fetch() {
            const resp = await supabase.rpc("get_simulators_with_images")
            setSimulators(resp.data[0])
        }
        fetch().then()
    }, [])
    return simulators;
}