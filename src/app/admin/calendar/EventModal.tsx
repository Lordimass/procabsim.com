import TimeIcon from "@/components/icons/TimeIcon";
import UserIcon from "@/components/icons/UserIcon";
import DescriptionIcon from "@/components/icons/DescriptionIcon";
import LocationPinIcon from "@/components/icons/LocationPinIcon";
import {CalendarEvent} from "@schedule-x/calendar";
import { Temporal } from "temporal-polyfill";
import {useState} from "react";
import {createClient} from "@/lib/supabase/client";
import {ConfirmationButton} from "@/components/ConfirmationButton/ConfirmationButton";
import {createEventsServicePlugin} from "@schedule-x/events-service";

export default function EventModal({calendarEvent, eventsService}: {calendarEvent: CalendarEvent, eventsService: ReturnType<typeof createEventsServicePlugin>}) {
    const supabase = createClient();
    const [feedback, setFeedback] = useState<string>();

    async function handleDelete() {
        const resp = await supabase
            .from("calendar_events")
            .delete()
            .eq("id", calendarEvent.id);
        if (resp.error) {
            console.error(resp.error);
            setFeedback(`Something went wrong! ${resp.error.message}`);
            return;
        }
        eventsService.remove(calendarEvent.id);
    }

    return (<>
        <div className="sx__has-icon sx__event-modal__title">
            <div
                style={{
                    backgroundColor: `${calendarEvent._color}`,
                }}
                className="sx__event-modal__color-icon sx__event-icon"
            />

            {calendarEvent.title}
        </div>

        <div className="sx__has-icon sx__event-modal__time">
            <TimeIcon strokeColor={"var(--sx-color-neutral-variant)"}/>

            <div dangerouslySetInnerHTML={{__html: getTimestamp(calendarEvent)}}/>
        </div>

        {calendarEvent.people && calendarEvent.people.length && (
            <div className="sx__has-icon sx__event-modal__people">
                <UserIcon strokeColor={"var(--sx-color-neutral-variant)"}/>

                {calendarEvent.people.reduce((acc, person, index) => {
                    if (index === 0) return person

                    if (index === calendarEvent.people!.length - 1) return `${acc} & ${person}`

                    return `${acc}, ${person}`
                }, '')}
            </div>
        )}

        {calendarEvent.location && (
            <div className="sx__has-icon sx__event-modal__location">
                <LocationPinIcon strokeColor={"var(--sx-color-neutral-variant)"}/>

                {calendarEvent.location}
            </div>
        )}

        {calendarEvent.description && (
            <div className="sx__has-icon sx__event-modal__description">
                <DescriptionIcon strokeColor={"var(--sx-color-neutral-variant)"}/>

                {calendarEvent.description}
            </div>
        )}
        <ConfirmationButton
            className={"deleteEvent"}
            variant={"outline-danger"}
            content={"Delete"}
            confirmationContent={<>Are you sure? If this is a recurring event, <i>all</i> instances will be deleted!</>}
            onConfirmed={handleDelete}
        >
            Delete
        </ConfirmationButton>
        {feedback ? <p>{feedback}</p> : null}
    </>)
}

function dateFn (
    dateTime: Temporal.ZonedDateTime | Temporal.PlainDate,
    locale: string
) {
    return dateTime.toLocaleString(locale, {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    })
}

function timeFn(dateTime: Temporal.ZonedDateTime, locale: string){
    const dateTimeString = dateTime.toString()
    const preHours = dateTimeString.slice(11, 13),
        preMinutes = dateTimeString.slice(14, 16)
    const { year, month, date, hours, minutes } = {
        year: Number(dateTimeString.slice(0, 4)),
        month: Number(dateTimeString.slice(5, 7)) - 1,
        date: Number(dateTimeString.slice(8, 10)),
        hours: preHours !== '' ? Number(preHours) : undefined,
        minutes: preMinutes !== '' ? Number(preMinutes) : undefined,
    }

    return new Date(year, month, date, hours, minutes).toLocaleTimeString(
        locale,
        {
            hour: 'numeric',
            minute: 'numeric',
        }
    )
}

function getTimestamp(calendarEvent: CalendarEvent) {
    const locale = "en-GB";

    const eventTime = { start: calendarEvent.start, end: calendarEvent.end } as {
        start: Temporal.ZonedDateTime | Temporal.PlainDate
        end: Temporal.ZonedDateTime | Temporal.PlainDate
    }

    if (calendarEvent._isSingleDayFullDay) {
        return dateFn(eventTime.start, locale)
    }

    if (calendarEvent._isMultiDayFullDay) {
        return `${dateFn(eventTime.start, locale)} - ${dateFn(
            eventTime.end,
            locale
        )}`
    }

    if (
        calendarEvent._isSingleDayTimed &&
        eventTime.start?.toString() !== eventTime.end?.toString()
    ) {
        return `${dateFn(eventTime.start, locale)} <span aria-hidden="true">⋅</span> ${timeFn(
            eventTime.start as Temporal.ZonedDateTime,
            locale
        )} - ${timeFn(eventTime.end as Temporal.ZonedDateTime, locale)}`
    }

    if (
        calendarEvent._isSingleDayTimed &&
        calendarEvent.start?.toString() === calendarEvent.end?.toString()
    ) {
        return `${dateFn(eventTime.start, locale)}, ${timeFn(
            eventTime.start as Temporal.ZonedDateTime,
            locale
        )}`
    }

    return `${dateFn(eventTime.start, locale)}, ${timeFn(
        eventTime.start as Temporal.ZonedDateTime,
        locale
    )} - ${dateFn(eventTime.end, locale)}, ${timeFn(
        eventTime.end as Temporal.ZonedDateTime,
        locale
    )}`
}