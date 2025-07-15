import { getReservationById } from '@/app/protected/properties/[propertyId]/reservations/actions';
import { ReservationDetailCard } from '@/components/property/reservations/reservation-detail-card';
import SlideOverModal from '@/components/ui/slide-over-modal';
import { getStallById } from '@/lib/supabase/stall';
type DetailPageProps = Promise<{
    params: {
        propertyId: string;
        reservationId: string;
    }
}>
export default async function Page({params}:{params: DetailPageProps}){
    const {propertyId, reservationId} = (await params).params
    const { data: reservation, error: reservationeError } = await getReservationById(reservationId);
    if (reservationeError) {
        return <p className='text-muted-foreground'>{reservationeError}</p>;
    }
    if (!reservation) {
        return <p className='text-muted-foreground'>Could Not Found Reservations</p>
    }
    const {data: stall, error: stallError} = await getStallById(reservation.stall_id)
    if(stallError){
        return <p className='text-muted-foreground'>{stallError}</p>;
    }
    if(!stall){
        return <p className='text-muted-foreground'>Could Not Found Stall</p>;
    }

    return (
    <SlideOverModal>
    <ReservationDetailCard propertyId={propertyId} reservation={reservation} stall={stall}/>
    </SlideOverModal> )
}