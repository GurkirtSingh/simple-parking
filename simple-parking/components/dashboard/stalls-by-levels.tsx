import { Tables } from "@/lib/supabase/database.types"
import { AddReservationCard, ReservationGridCard } from "./reservation-grid-card";

type StallsByLevels = {
    stalls: Tables<"property_stalls">[];
    levels: Tables<"property_levels">[];
    currentReservations: Tables<"current_reservation_status">[];
}
export function StallsByLevels({ stalls, levels, currentReservations }: StallsByLevels) {
    return (
        <>
            {levels &&
                levels.map((level) => {
                    const levelStalls = stalls.filter((stall) => stall.property_level_id === level.id)
                    if (!levelStalls.length) return null
                    return (
                        <div key={level.id} className="w-full flex flex-col items-start gap-4">
                            {levels.length > 1 && <p className="border-2 text-gray-500 rounded-md px-2">{level.name}</p>}
                            <div className=" w-full flex flex-col gap-4 md:flex-row md:flex-wrap">
                                {
                                    levelStalls.map((stall) => {
                                        const activeRes = currentReservations.find(res => res.stall_id === stall.id);
                                        if (activeRes) {
                                            return <ReservationGridCard key={stall.id} stall={stall} reservation={activeRes} />
                                        }
                                        else {
                                            return <AddReservationCard key={stall.id} stall={stall} propertyId={stall.property_id} />
                                        }
                                    })}
                            </div>

                        </div>
                    )
                })}
        </>
    )
}