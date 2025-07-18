"use client"

import { createClient } from "@/lib/supabase/client";
import { Tables } from "@/lib/supabase/database.types";
import { useEffect, useState } from "react";

import { StallsByLevels } from "./stalls-by-levels";

type ParkingGridProps = {
    propertyId: string;
}
export function ParkingGrid({ propertyId }: ParkingGridProps) {
    const [reservations, setReservations] = useState<Tables<'current_reservation_status'>[]>([])
    const [propertyStalls, setPropertyStalls] = useState<Tables<"property_stalls">[]>([])
    const [propertyLevels, setPropertyLevels] = useState<Tables<"property_levels">[]>([])
    const supabase = createClient()

    // fetch reservations with status
    useEffect(() => {
        const fetchReservationStatus = async () => {
            const { data } = await supabase.from('current_reservation_status').select('*').eq('property_id', propertyId)
            if (data) {
                setReservations(data)
            }
        }
        const channel = supabase.channel('table_db_changes').on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'reservations' },
            () => {
                fetchReservationStatus()
            }
        ).subscribe()

        fetchReservationStatus()
        return () => { channel.unsubscribe() }
    }, [propertyId, supabase])

    // fetch property's all stalls
    useEffect(() => {
        const fetchStalls = async () => {
            const supabase = createClient();
            const { data, error } = await supabase
                .from('property_stalls')
                .select('*')
                .eq('property_id', propertyId).order('name');

            if (error) {
                console.error("Supabase error:", error);
                return;
            }

            if (data) {
                setPropertyStalls(data);
                localStorage.setItem(`stalls:${propertyId}`, JSON.stringify(data));
            }
        };

        try {
            const cached = localStorage.getItem(`stalls:${propertyId}`);
            if (cached) {
                const parsed = JSON.parse(cached);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    setPropertyStalls(parsed);
                }
            }
        } catch (err) {
            console.error("Error parsing cached stalls:", err);
        }

        fetchStalls();
    }, [propertyId]);

    // fetch property's levels
    useEffect(() => {
        const fetchLevels = async () => {
            const supabase = createClient();
            const { data, error } = await supabase
                .from('property_levels')
                .select('*')
                .eq('property_id', propertyId)
                .order('name', { ascending: true });

            if (error) {
                console.error("Supabase error:", error);
                return;
            }

            if (data) {
                setPropertyLevels(data);
            }
        };

        fetchLevels();
    }, [propertyId]);
    return (
        <div className="flex flex-col gap-6 md:flex-row md:flex-wrap">
            <StallsByLevels stalls={propertyStalls} levels={propertyLevels} currentReservations={reservations} />
        </div>
    )
}