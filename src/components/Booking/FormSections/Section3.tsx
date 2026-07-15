import styles from "@/app/book/page.module.scss";
import {DayPicker} from "@daypicker/react";
import {Dispatch, SetStateAction, useContext, useEffect, useRef, useState} from "react";
import "./Section3.scss"
import {Button, ButtonGroup, ToggleButton} from "react-bootstrap";
import {createClient} from "@/lib/supabase/client";
import {MonthsEventSlots} from "../../../../public/types/calendar";
import {SiteSettings, SiteSettingsContext} from "@/lib/siteSettings";

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

const noAvailableTimes = [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]]

export default function Section3({date: selectedTime, setDate: setSelectedTime}: Section3Props) {
    const siteSettings = useContext(SiteSettingsContext);
    if (!siteSettings) {return <p>Failed to load site settings</p>}

    const today = new Date();
    const lowerBound = new Date();
    const upperBound = new Date();
    lowerBound.setDate(lowerBound.getDate() + 1);
    upperBound.setMonth(lowerBound.getMonth() + 6);
    const [month, _setMonth] = useState<Date>(today);

    const [availableTimes, setAvailableTimes] = useState<EventSlot[][]>(noAvailableTimes);
    const [datesWithNoSlots, setDatesWithNoSlots] = useState<Date[]>([])
    const [date, setDate] = useState<Date | undefined>(undefined);
    const endTime = new Date(selectedTime ?? 0)
    endTime.setMinutes(endTime.getMinutes() + siteSettings.session_minutes)

    useEffect(() => {setMonth(month).then()}, []);
    async function setMonth(newMonth: Date) {
        _setMonth(newMonth);
        setAvailableTimes(noAvailableTimes)
        setDate(undefined)
        await getAvailableTimes(newMonth, setAvailableTimes, siteSettings!)
    }

    useEffect(() => {
        getDatesWithNoSlots(availableTimes, month, setDatesWithNoSlots);
    }, [availableTimes]);
    useEffect(() => {
        setSelectedTime(undefined)
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
        {selectedTime
            ? <p>
                You have selected {selectedTime.toLocaleDateString()}.
                Your slot will run from {getTimeString(selectedTime)} to {getTimeString(endTime)}
            </p> : null}
    </div>
}

function buildTimeButtons(
    availableTimes: { name: string, value: string }[],
    selectedTime: Date | undefined,
    setSelectedTime: (date: Date) => void
) {
    console.log(availableTimes);
    return availableTimes.map((item, i) => <ToggleButton
        key={i}
        id={`radio-${i}`}
        name="radio" type="radio"
        value={item.value}
        checked={selectedTime?.toISOString() === item.value}
        onChange={(e) => setSelectedTime(new Date(e.currentTarget.value))}
    >{item.name}</ToggleButton>)
}

async function getAvailableTimes(month: Date, setAvailableTimes: (times: EventSlot[][]) => void, siteSettings: SiteSettings) {
    const supabase = createClient();
    month.setMinutes(month.getMinutes() - month.getTimezoneOffset())
    const dayStart = constructDateFromTime(siteSettings.day_start)
    const dayEnd = constructDateFromTime(siteSettings.day_end)
    console.log(dayStart, dayEnd)
    const resp = await supabase.functions.invoke("get-free-timeslots", {
        body: {
            month: month.toISOString(),
            day_start: dayStart.toISOString(),
            day_end: dayEnd.toISOString(),
            slot_minutes_length: siteSettings.session_minutes
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

// TODO: Time currently taken in users local timezone, should instead be GMT+0 always, or the timezone of the server. (UK Time)
function constructDateFromTime(time: string) {
    const date = new Date();
    const timeSegs = time.split(":")
    if (timeSegs.length > 1) {
        date.setHours(Number(timeSegs[0]), Number(timeSegs[1]), 0, 0)
    }
    return date
}

function getTimeString(date: Date) {
    const timeString = date.toTimeString();
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