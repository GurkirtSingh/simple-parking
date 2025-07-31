"use client"

import { createClient } from "@/lib/supabase/client";
import { Tables } from "@/lib/supabase/database.types";
import { useEffect, useState } from "react";
import { AddReservationCard, ReservationGridCard } from "./reservation-grid-card";
import { AnimatePresence, motion } from 'framer-motion'


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
        const reservations_changes = async () => {
            await supabase.realtime.setAuth()
            const channel = supabase
                .channel(`reservations:changes`, {
                    config: { private: true },
                })
                .on('broadcast', { event: '*' }, () => {
                    fetchReservationStatus()
                })
                .subscribe()

            return () => {
                supabase.removeChannel(channel)
            }
        }
        reservations_changes()

        fetchReservationStatus()
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
            {propertyLevels &&
                propertyLevels.map((level) => {
                    const levelStalls = propertyStalls.filter((stall) => stall.property_level_id === level.id)
                    if (!levelStalls.length) return null
                    return (
                        <div key={level.id} className="w-full flex flex-col items-start gap-4">
                            {propertyLevels.length > 1 && <p className="border-2 text-gray-500 rounded-md px-2">{level.name}</p>}
                            <div className=" w-full flex flex-col gap-4 md:flex-row md:flex-wrap">
                                {levelStalls.map((stall) => {
                                    const activeRes = reservations.find(res => res.stall_id === stall.id);
                                    return (
                                        <div key={stall.id} className="relative flex-shrink-0 w-full md:w-52 h-44">
                                            <AnimatePresence mode="wait">
                                                {activeRes ? (
                                                    <motion.div
                                                        key={`res-${activeRes.stall_id}`}
                                                        layout
                                                        initial={{ opacity: 0, scale: 0.95 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        exit={{ opacity: 0, scale: 1.1 }}
                                                        transition={{ duration: 0.25 }}
                                                        className="absolute inset-0"
                                                    >
                                                        <ReservationGridCard stall={stall} reservation={activeRes} />
                                                    </motion.div>
                                                ) : (
                                                    <motion.div
                                                        key={`empty-${stall.id}`}
                                                        layout
                                                        initial={{ opacity: 0, scale: 0.95 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        exit={{ opacity: 0, scale: 1.1 }}
                                                        transition={{ duration: 0.25 }}
                                                        className="absolute inset-0"
                                                    >
                                                        <AddReservationCard stall={stall} propertyId={stall.property_id} />
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    );
                                })}
                                
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}