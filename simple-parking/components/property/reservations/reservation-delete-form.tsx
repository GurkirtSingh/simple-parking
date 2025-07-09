// app/protected/.../delete/ConfirmForm.tsx
"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { deleteReservation } from "@/lib/supabase/reservation"

type ReservationDeleteFormProps = {
    propertyId: string;
    reservationId: string;
}

export default function ReservationDeleteForm({ propertyId, reservationId }: ReservationDeleteFormProps) {
    const router = useRouter()
    const handleDeleteReservation = async (e: React.FormEvent) => {
        e.preventDefault()
        await deleteReservation({ propertyId, reservationId })
    }
    return (
        <form onSubmit={handleDeleteReservation} className="space-x-2">
            <Button variant="destructive" type="submit">Delete</Button>
            <Button
                variant="outline"
                type="button"
                onClick={() => router.push(`/protected/properties/${propertyId}/reservations/${reservationId}/detail`)}
            >
                Cancel
            </Button>
        </form>
    )
}