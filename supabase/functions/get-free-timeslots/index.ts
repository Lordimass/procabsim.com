// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "@supabase/functions-js/edge-runtime.d.ts";
import {SupabaseContext, withSupabase} from "@supabase/server";
import {CalEvent, MonthsEventSlots} from "../../../public/types/calendar.ts";

interface Body {
  month: string;
  day_start: string;
  day_end: string;
  slot_minutes_length: number;
}

// This endpoint uses 'publishable' | 'secret' access, apiKey is required.
// Use publishable for Client-facing, key-validated endpoints
// Use secret for Server-to-server, internal calls
export default {
  fetch: withSupabase({ auth: ["publishable", "secret"] }, async (req, ctx) => {
    // Reading body and setting up variables
    const body: Body = await req.json();
    const month = new Date(body.month).getMonth()
    const dayStart = new Date(body.day_start);
    dayStart.setFullYear(new Date(body.month).getFullYear(), month)
    const dayEnd = new Date(body.day_end);
    dayEnd.setFullYear(new Date(body.month).getFullYear(), month)
    console.log(dayEnd.toISOString())

    const slotStart = new Date(body.month);
    slotStart.setDate(1)
    slotStart.setHours(dayStart.getHours(), dayStart.getMinutes(), dayStart.getSeconds(), dayStart.getMilliseconds());

    // Get existing events
    const events = await getExistingEvents(body.month, ctx)

    // Iterate through each day of the month and find available slots for each day
    const slots: MonthsEventSlots = []
    while (slotStart.getMonth() === month) {
      const slotEnd = new Date(slotStart)
      slotEnd.setMinutes(slotStart.getMinutes() + body.slot_minutes_length);
      dayStart.setDate(slotStart.getDate());
      dayEnd.setDate(slotStart.getDate());

      const daySlots: MonthsEventSlots[0] = []
      while (slotStart >= dayStart && slotStart < dayEnd && slotEnd > dayStart && slotEnd <= dayEnd) {
        if (isSlotFree(slotStart, slotEnd, events)) {
          daySlots.push({
            start_time: (new Date(slotStart)).toISOString(),
            end_time: (new Date(slotEnd)).toISOString()
          })
        }
        slotStart.setMinutes(slotStart.getMinutes() + body.slot_minutes_length);
        slotEnd.setMinutes(slotEnd.getMinutes() + body.slot_minutes_length);
      }
      slots.push(daySlots)

      slotStart.setDate(slotStart.getDate() + 1);
      slotStart.setHours(dayStart.getHours(), dayStart.getMinutes(), dayStart.getSeconds(), dayStart.getMilliseconds());
    }

    return Response.json(slots);
  }),
};

async function getExistingEvents(month: string, ctx: SupabaseContext) {
  const resp =  await ctx.supabaseAdmin
      .functions
      .invoke<CalEvent[]>("get-calendar-events", {body: {month}})
  if (resp.error) console.error(resp.error);
  return resp.data ?? [];
}

function isSlotFree(startTime: Date, endTime: Date, events: CalEvent[]) {
  for (const event of events) {
    const eventStart = new Date(event.start_time)
    const eventEnd = new Date(event.end_time)
    if ((startTime > eventStart && startTime < eventEnd) ||
        (endTime > eventStart && endTime < eventEnd) ||
        (startTime <= eventStart && endTime >= eventEnd)
    ) {
      return false;
    }
  }
  return true;
}

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/get-free-timeslots' \
    --header 'apiKey: sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH' \
    --data '{"name":"Functions"}'

*/
