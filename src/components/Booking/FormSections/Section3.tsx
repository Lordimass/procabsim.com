import styles from "@/app/book/page.module.scss";
import {DayPicker} from "@daypicker/react";
import {Dispatch, SetStateAction, useEffect, useRef, useState} from "react";
import "./Section3.scss"
import {Button, ButtonGroup, ToggleButton} from "react-bootstrap";
import {createClient} from "@/lib/supabase/client";
import {MonthsEventSlots} from "../../../../public/types/calendar";

interface Section3Props {
    date: Date | undefined;
    setDate: Dispatch<SetStateAction<Date | undefined>>
}

interface EventSlot {
    name: string,
    value: string,
    start_time: Date,
    end_time: Date
}

// Works under the assumption that all bookings will be in the UK (where the timezone changes, but universally)
const DAY_START = new Date(2026, 1, 1,
    9, 0, 0, 0
)

const DAY_END = new Date(2026, 1, 1,
    17, 0, 0, 0
)

const SLOT_MINUTES_LENGTH = 60;

export default function Section3({date, setDate}: Section3Props) {
    const today = new Date();
    const lowerBound = new Date();
    const upperBound = new Date();
    lowerBound.setDate(lowerBound.getDate() + 1);
    upperBound.setMonth(lowerBound.getMonth() + 6);
    const [month, _setMonth] = useState<Date>(today);

    const [availableTimes, setAvailableTimes] = useState<EventSlot[][]>([[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]]);
    const [datesWithNoSlots, setDatesWithNoSlots] = useState<Date[]>([])
    const [selectedTime, setSelectedTime] = useState<string | null>(null);

    async function setMonth(newMonth: Date) {
        console.log(newMonth, newMonth.toISOString())
        _setMonth(newMonth);
        await getAvailableTimes(newMonth, setAvailableTimes)
    }

    useEffect(() => {
        getDatesWithNoSlots(availableTimes, month, setDatesWithNoSlots);
    }, [availableTimes]);
    useEffect(() => {
        setSelectedTime(null)
    }, [date]);

    const [vertical, setVertical] = useState<boolean>(false);
    const verticalRef = useRef<boolean>(false);

    function updateVertical() {
        const newVertical = window.innerHeight > window.innerWidth;
        if (newVertical !== verticalRef.current) {
            setVertical(newVertical);
            verticalRef.current = newVertical;
        }
    }

    window.addEventListener("resize", updateVertical);
    useEffect(updateVertical, []);

    return <div className={styles.formSection} id={"formSection3"}>
        <hr/>
        <h2>3. Choose Date and Time</h2>
        <hr/>
        <div>
            <div id={"day-picker-container"}>
                <DayPicker
                    animate fixedWeeks required
                    mode="single"
                    selected={date} onSelect={setDate}
                    month={month} onMonthChange={setMonth}
                    footer={date ? `Selected: ${date.toLocaleDateString()}` : "Pick a day"}
                    weekStartsOn={1}
                    startMonth={today}
                    disabled={[
                        {before: lowerBound, after: upperBound},
                        datesWithNoSlots
                    ]}
                />
                <Button
                    id="go-to-today"
                    variant="outline-primary"
                    onClick={() => setMonth(today)}
                >Go to Today</Button>
                {vertical && date
                    ? <ButtonGroup className="btn-group-custom">{
                        buildTimeButtons(availableTimes[date.getDate()-1], selectedTime, setSelectedTime)
                    }</ButtonGroup> : null}
            </div>
            {!vertical && date
                ? <ButtonGroup vertical>{
                    buildTimeButtons(availableTimes[date.getDate()-1], selectedTime, setSelectedTime)
                }</ButtonGroup> : null}
        </div>
    </div>
}

function buildTimeButtons(
    availableTimes: { name: string, value: string }[],
    selectedTime: string | null,
    setSelectedTime: (date: string) => void
) {
    return availableTimes.map((item, i) => <ToggleButton
        key={i}
        id={`radio-${i}`}
        name="radio" type="radio"
        value={item.value}
        checked={selectedTime === item.value}
        onChange={(e) => setSelectedTime(e.currentTarget.value)}
    >{item.name}</ToggleButton>)
}

async function getAvailableTimes(month: Date, setAvailableTimes: (times: EventSlot[][]) => void) {
    const supabase = createClient();
    DAY_START.setMinutes(DAY_START.getMinutes() + DAY_START.getTimezoneOffset())
    DAY_END.setMinutes(DAY_END.getMinutes() + DAY_END.getTimezoneOffset())
    month.setMinutes(month.getMinutes() - month.getTimezoneOffset())
    console.log(month.toISOString())
    const resp = await supabase.functions.invoke("get-free-timeslots", {
        body: {
            month: month.toISOString(),
            day_start: DAY_START.toISOString(),
            day_end: DAY_END.toISOString(),
            slot_minutes_length: SLOT_MINUTES_LENGTH
        }
    })
    if (resp.error) console.error(resp.error);

    const eventSlots: EventSlot[][] = []
    const data = resp.data as MonthsEventSlots;
    for (const day of data) {
        const dayEvents: EventSlot[] = []
        for (const event of day) {
            dayEvents.push({
                start_time: new Date(event.start_time),
                end_time: new Date(event.end_time),
                name: getTimeString(new Date(event.start_time)),
                value: event.start_time
            })
        }
        eventSlots.push(dayEvents)
    }
    setAvailableTimes(eventSlots)
}

function getTimeString(date: Date) {
    const timeString = date.toTimeString()
    const segments = timeString.split(":")
    return `${segments[0]}:${segments[1]}`;
}

function getDatesWithNoSlots(availableTimes: EventSlot[][], month: Date, setDatesWithNoSlots: (dates: Date[]) => void) {
    const datesWithNoSlots = []
    const date = new Date(month)
    date.setDate(1)
    for (const day of availableTimes) {
        if (day.length === 0) datesWithNoSlots.push(new Date(date))
        date.setDate(date.getDate() + 1)
    }
    setDatesWithNoSlots(datesWithNoSlots)
}