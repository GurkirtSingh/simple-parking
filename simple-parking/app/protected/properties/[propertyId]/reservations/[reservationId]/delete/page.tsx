import { getReservationById } from '@/app/protected/properties/[propertyId]/reservations/actions'
import ReservationDeleteForm from "@/components/property/reservations/reservation-delete-form"

type DeletePageParams = {
    propertyId: string;
    reservationId: string;
};

export default async function Page({ params }: { params: Promise<DeletePageParams> }) {
    const { propertyId, reservationId } = await params;
    const { data: reservation } = await getReservationById(reservationId)
    if (!reservation) {
        return <>Could Not Found Reservation</>
    }

    return (
        <div className="max-w-md mx-auto mt-20 space-y-4 text-center">
            <h2 className="text-xl font-semibold">Confirm Delete</h2>
            <p>Are you sure you want to delete the reservation for <strong>{reservation.id}</strong> ?</p>
            <ReservationDeleteForm propertyId={propertyId} reservationId={reservationId}/>
        </div>
    )
}