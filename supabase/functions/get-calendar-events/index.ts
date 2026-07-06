// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "@supabase/functions-js/edge-runtime.d.ts";
import {SupabaseContext, withSupabase} from "@supabase/server";
import {CalEvent, RecurringCalEvent} from "../../../public/types/calendar.ts";

interface Body {
  month: string;
}

// This endpoint uses 'publishable' | 'secret' access, apiKey is required.
// Use publishable for Client-facing, key-validated endpoints
// Use secret for Server-to-server, internal calls
export default {
  fetch: withSupabase({ auth: ["publishable", "secret"] }, async (req, ctx) => {
    // ctx.supabaseAdmin bypasses RLS — use for privileged operations
    if (ctx.authMode !== "secret") return Response.json({msg: "Requires secret auth mode"}, {status: 401});
    const bodyUnchecked = await req.json();
    if (!("month" in bodyUnchecked) ||
        !bodyUnchecked.month ||
        typeof bodyUnchecked.month != "string"
    ) return Response.json({ msg: "Missing 'month' in body."})
    const body: Body = bodyUnchecked as Body

    const [startDate, endDate] = getStartAndEndDates(body)

    const singleEvents = await fetchCalendarEvents(ctx, startDate, endDate)
    const combinedEvents = await includeRecurringEvents(ctx, singleEvents, startDate, endDate)

    return Response.json(combinedEvents);
  }),
};

function getStartAndEndDates(body: Body): Date[] {
  const startDate = new Date(body.month);
  startDate.setDate(1)
  startDate.setHours(0, 0, 0, 0)
  const endDate = new Date(startDate);
  endDate.setMonth(startDate.getMonth() + 1);
  endDate.setTime(endDate.getTime()-1);
  return [startDate, endDate];
}

async function fetchCalendarEvents(ctx: SupabaseContext, startDate: Date, endDate: Date) {
  const resp = await ctx.supabaseAdmin
      .from("calendar_events")
      .select("*")
      .or(`and(start_time.gte.${startDate.toISOString()},start_time.lte.${endDate.toISOString()}),and(end_time.gte.${startDate.toISOString()},end_time.lte.${endDate.toISOString()})`)

  if (resp.error) console.error(resp.error);
  if (!resp.data) return []
  return resp.data as CalEvent[];
}

async function includeRecurringEvents(ctx: SupabaseContext, singleEvents: CalEvent[], startDate: Date, endDate: Date) {
  const resp = await ctx.supabaseAdmin.from("recurring_calendar_events").select("*, calendar_events (*)");
  if (resp.error) console.error(resp.error);
  const recurringEvents: RecurringCalEvent[] | null = resp.data
  if (!recurringEvents) return singleEvents

  const resolvedEvents = []

  // Add single events that are not also recurring events
  for (const event of singleEvents) {
    let found = false
    for (const recurringEvent of recurringEvents) {
      if (recurringEvent.id === event.id) found = true;
    }
    if (!found) resolvedEvents.push(event)
  }

  for (const event of recurringEvents) {
    const eventStart = new Date(event.calendar_events.start_time)
    const eventEnd = new Date(event.calendar_events.end_time)
    if (event.frequency === "Daily" || event.frequency === "Weekly") {
      while(eventStart <= endDate) {
        event.calendar_events.start_time = eventStart.toISOString()
        event.calendar_events.end_time = eventEnd.toISOString()
        if (isInRange(eventStart, eventEnd, startDate, endDate)) {
          resolvedEvents.push(JSON.parse(JSON.stringify(event.calendar_events)))
        }

        if (event.frequency === "Daily") {
          eventStart.setDate(eventStart.getDate()+1) // +1 Day
          eventEnd.setDate(eventEnd.getDate()+1)
        } else {
          eventStart.setTime(eventStart.getTime()+604800000) // +1 Week
          eventEnd.setTime(eventEnd.getTime()+604800000)
        }
      }
    } else if (event.frequency === "Monthly" || event.frequency === "Yearly") {
      if (event.frequency === "Monthly") {
        eventStart.setMonth(startDate.getMonth())
        eventEnd.setMonth(startDate.getMonth())
      } else {
        eventStart.setFullYear(startDate.getFullYear())
        eventEnd.setFullYear(startDate.getFullYear())
      }
      if (isInRange(eventStart, eventEnd, startDate, endDate)) {
        event.calendar_events.start_time = eventStart.toISOString()
        event.calendar_events.end_time = eventEnd.toISOString()
        resolvedEvents.push(JSON.parse(JSON.stringify(event)))
      }
    }
  }
  return resolvedEvents
}

function isInRange(startDate: Date, endDate: Date, lowerBound: Date, upperBound: Date) {
  return (startDate >= lowerBound && startDate <= upperBound) || (endDate <= upperBound && endDate >= lowerBound)
}