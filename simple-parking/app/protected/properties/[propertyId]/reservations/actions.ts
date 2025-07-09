"use server";

import { Tables } from "@/lib/supabase/database.types";
import { createClient } from "@/lib/supabase/server";
import { handleSupabaseError } from "@/lib/supabaseError";

enum ReservationFilter {
    All = "all",
    Arriving = "arriving",
    CheckingOut = "checking_out",
    Stayover = "stayover",
}

type PropertyReservationsProps = {
    className?: string;
    property_id: string;
    filter?: ReservationFilter;
    limit?: number;
}

export async function getPropertyReservations({ property_id, filter = ReservationFilter.All, limit = 20 }: PropertyReservationsProps) {
    const supabase = await createClient();

    let query = supabase
        .from("reservations")
        .select("*")
        .eq("property_id", property_id)
        .order("created_at", { ascending: false })
        .limit(limit);

    const today = new Date().toISOString().split("T")[0]; // Get current date in YYYY-MM-DD

    switch (filter) {
        case ReservationFilter.Arriving:
            query = query.filter("check_in", "eq", today);
            break;
        case ReservationFilter.CheckingOut:
            query = query.filter("check_out", "eq", today);
            break;
        case ReservationFilter.Stayover:
            query = query
                .filter("check_in", "lt", today)
                .filter("check_out", "gt", today);
            break;
    }

    const { data, error } = await query;

    if (error) {
        console.error("Error fetching reservations:", error);
        throw new Error("Failed to fetch reservations");
    }

    return data || [];
}

export async function getReservationById(reservationId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("reservations")
        .select("*")
        .eq("id", reservationId)
        .maybeSingle()

    if (error) {
        return {
            error: handleSupabaseError(error)
        }
    }

    return {
        success: true,
        data: data as Tables<"reservations">,
    }
}