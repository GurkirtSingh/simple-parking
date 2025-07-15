import { ReservationFrom } from "@/components/property/reservations/reservation-form";
import { getReservationById } from '@/app/protected/properties/[propertyId]/reservations/actions';

type PropertyReservationEditPageProps = Promise<{
    params: {
        propertyId: string;
        reservationId: string;
    };
}>;

export default async function Page({ params }: {params:PropertyReservationEditPageProps}) {
    const { propertyId, reservationId } = (await params).params
    const { data: reservation, error } = await getReservationById(reservationId);
    if (error) {
        return (
            <div className="flex flex-col w-full items-center justify-center text-gray-400">
                {error}
            </div>
        )
    }
    if (!reservation) {
        return (
            <div className="flex flex-col w-full items-center justify-center text-gray-400">
                Could Not Found Reservation
            </div>
        )
    }
    return (
        <div className="flex w-full items-center justify-center">
            <div className="w-full max-w-sm">
                <ReservationFrom propertyId={propertyId} stallId={reservation.stall_id} reservation={reservation} />
            </div>
        </div>
    );
}