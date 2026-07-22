export interface Simulator {
    images: SupabaseImage[] | null,
    extras: SimulatorOptionalExtra[]
    sim: {
        id: string,
        name: string,
        price: number,
        active: boolean,
        created_at: string,
        description: string
        accessibility_details: string
    }
}

export interface SupabaseImage {
    url: string;
    alt: string;
    id: string;
}

export interface SimulatorOptionalExtra {
    name: string,
    price: number | null,
    created_at: string,
    disclaimer: string | null,
    description: string,
}