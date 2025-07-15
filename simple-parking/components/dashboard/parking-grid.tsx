"use client"

import { createClient } from "@/lib/supabase/client";
import { Tables } from "@/lib/supabase/database.types";
import { useEffect, useState } from "react";

import { AddReservationCard, ReservationGridCard } from "./reservation-grid-card";
import { Skeleton } from "../ui/skeleton";

type ParkingGridProps = {
    propertyId: string;
}
export function ParkingGrid({ propertyId }: ParkingGridProps) {
    const [reservations, setReservations] = useState<Tables<'current_reservation_status'>[]>([])
    const [propertyStalls, setPropertyStalls] = useState<Tables<"property_stalls">[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const supabase = createClient()

    // fetch reservations with status
    useEffect(() => {
        const fetchReservationStatus = async () => {
            setLoading(true)
            const { data } = await supabase.from('current_reservation_status').select('*').eq('property_id', propertyId)
            if (data) {
                setReservations(data)
            }
            setLoading(false)
        }
        const channel = supabase.channel('table_db_changes').on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'reservations' },
            (paylod) => {
                fetchReservationStatus()
            }
        ).subscribe()

        fetchReservationStatus()
        return () => { channel.unsubscribe() }
    }, [propertyId])

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
                setError('Error loading stalls');
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
    return (
        <div className="flex flex-col gap-4 md:flex-row md:flex-wrap">
            {loading ? (
                <>
                    {Array.from({ length: 10 }).map((_, i) => (
                        <Skeleton key={i} className="w-full md:w-48 h-48" />
                    ))
                    }
                </>
            ) : (
                <>
                    {propertyStalls.map((stall) => {
                        const activeRes = reservations.find(res => res.stall_id === stall.id);
                        if (activeRes) {
                            return <ReservationGridCard key={stall.id} stall={stall} reservation={activeRes} />
                        }
                        else {
                            return <AddReservationCard key={stall.id} stall={stall} propertyId={propertyId} />
                        }
                    })}
                </>
            )}
            {error && <span className="text-red-400">{error}</span>}
        </div>
    )
}