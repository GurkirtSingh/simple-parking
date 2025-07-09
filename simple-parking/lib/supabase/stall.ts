"use server"
import { createClient } from "@/lib/supabase/server";

export async function getStallById(stallId: string) {
    const supabase = await createClient();
    const { data: stall, error } = await supabase
        .from('property_stalls')
        .select('*')
        .eq('id', stallId)
        .single();

    if (error) {
        console.error("Error fetching stall:", error);
        return {
            error: error.message || "Failed to fetch stall",
        };
    }

    return {
        success: true,
        data: stall,
    };
}

export async function getStallsByPropertyId(propertyId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("property_stalls")
        .select("*")
        .eq("property_id",propertyId);
    if(error){
        console.error(error)
        return{
            error: error.message || "Failed to fetch stalls"
        }
    }
    return {
        success: true,
        data: data
    }
};