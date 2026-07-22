"use client";

import {useContext, useEffect, useState} from "react";
import {createEventsServicePlugin} from "@schedule-x/events-service";
import {ScheduleXCalendar, useCalendarApp} from "@schedule-x/react";
import {
    CalendarEvent,
    createViewDay,
    createViewMonthAgenda,
    createViewMonthGrid,
    createViewWeek,
    createViewWeekAgenda
} from "@schedule-x/calendar";
import { Temporal } from "temporal-polyfill";
import '@schedule-x/theme-default/dist/index.css'
import Breadcrumb from "react-bootstrap/esm/Breadcrumb";
import BookingSettings from "@/app/admin/settings/BookingSettings";
import "./globals.scss"
import {SiteSettingsContext} from "@/lib/siteSettings";
import {createClient} from "@/lib/supabase/client";
import {CalEvent} from "../../../../public/types/calendar";
import {createCurrentTimePlugin} from "@schedule-x/current-time";
import {createEventModalPlugin} from "@schedule-x/event-modal";
import EventModal from "@/app/admin/calendar/EventModal";

type DateRange = {
    start: Temporal.ZonedDateTime;
    end: Temporal.ZonedDateTime;
};

const tagsToEventColours: {[key: string]: string} = {
    "default": "#4f378b",
    "booking": "#ae6f11"
}

export default function Page() {
    const {calendar, eventsService} = useInitCalendarApp()
    if (!eventsService) {return null}

    const [customComponents] = useState({
        eventModal: (event: CalendarEvent) => <EventModal calendarEvent={event.calendarEvent} eventsService={eventsService}/>
    })

    return (<div className={"main-page-content"}>
            <Breadcrumb>
                <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
                <Breadcrumb.Item href="/admin">Admin</Breadcrumb.Item>
                <Breadcrumb.Item active>Calendar</Breadcrumb.Item>
            </Breadcrumb>
            <h1>Calendar & Availability</h1>

            <div id="calendar-container">
                <ScheduleXCalendar calendarApp={calendar} customComponents={customComponents} />
            </div>

            <BookingSettings showLinkToCalendar={false} />
        </div>
    )
}

function useInitCalendarApp() {
    const siteSettings = useContext(SiteSettingsContext)
    if (!siteSettings) {return {calendar: null, eventsService: null}}

    const eventsService = useState(() => createEventsServicePlugin())[0]
    const currentTimePlugin = useState(() => createCurrentTimePlugin())[0]
    const eventModalPlugin = useState(() => createEventModalPlugin())[0]

    const dayStartSplit = siteSettings.day_start.split(":")
    const startHour = Number(dayStartSplit[0]) - 1 - Math.round((new Date()).getTimezoneOffset() / 60)
    const dayStart = startHour > 0 && startHour < 24 ? new Temporal.PlainTime(startHour) : undefined;
    const dayEndSplit = siteSettings.day_end.split(":")
    const endHour = Number(dayEndSplit[0]) + 1 - Math.round((new Date()).getTimezoneOffset() / 60)
    const dayEnd = startHour > 0 && startHour < 24 ? new Temporal.PlainTime(endHour) : undefined;
    const calendar = useCalendarApp({
        views: [createViewDay(), createViewWeekAgenda(), createViewWeek(), createViewMonthGrid(), createViewMonthAgenda()],
        weekOptions: {gridHeight: 700},
        dayBoundaries: dayStart && dayEnd ? {
            start: dayStart.toString().substring(0,5),
            end: dayEnd.toString().substring(0,5)
        } : undefined,
        plugins: [eventsService, currentTimePlugin, eventModalPlugin],
        isDark: true,
        callbacks: {
            onRangeUpdate: range => onRangeUpdate(range, eventsService),
            onRender: async (app) => {
                const dateRange: DateRange | null = app.calendarState.range.peek()
                if (dateRange) await onRangeUpdate(dateRange, eventsService)
            }
        },
        skipAnimations: true
    })

    useEffect(() => {
        // get all events
    }, [])

    return {calendar, eventsService}
}

async function onRangeUpdate(range: DateRange, eventsService: ReturnType<typeof createEventsServicePlugin>) {
    const month = range.start.toInstant().toString();
    const endMonth = range.end.toInstant().toString();
    const supabase = createClient()
    const resp = await supabase.functions.invoke("get-calendar-events", {body: {month, endMonth}});
    if (resp.error) {
        console.log(resp.error)
        return;
    }
    const events: CalEvent[] = resp.data;
    eventsService.getAll().forEach(event => {eventsService.remove(event.id)})
    events.forEach(event => {
        const startTime = new Date(event.start_time)
        const endTime = new Date(event.end_time)
        eventsService.add({
            id: event.id,
            start: new Temporal.ZonedDateTime(BigInt(startTime.getTime()).valueOf() * BigInt(1000000).valueOf(), Temporal.Now.timeZoneId()),
            end: new Temporal.ZonedDateTime(BigInt(endTime.getTime()) * BigInt(1000000).valueOf(), Temporal.Now.timeZoneId()),
            title: event.name,
            _options: {additionalClasses: event.tags.map(tag => `event-tag-${tag}`)},
            _color: tagsToEventColours[event.tags[0]] ?? tagsToEventColours.default
        })
    })
}