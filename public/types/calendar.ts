export interface CalEvent {
    id: number;
    name: string;
    tags: string[]
    end_time: string;
    created_at: string;
    start_time: string;
}

export interface RecurringCalEvent {
    id: number;
    frequency: "Daily" | "Weekly" | "Monthly" | "Yearly"
    calendar_events: CalEvent
}

export type MonthsEventSlots = {
    start_time: string;
    end_time: string;
}[][]