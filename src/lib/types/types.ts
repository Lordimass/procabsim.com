export interface Simulator {
   images: SupabaseImage[],
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
}