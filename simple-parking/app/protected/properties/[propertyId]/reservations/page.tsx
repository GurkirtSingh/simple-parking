import { getPropertyReservations } from '@/app/protected/properties/[propertyId]/reservations/actions';
import { ReservationList } from '@/components/property/reservations/reservation-list';
import { Tables } from '@/lib/supabase/database.types';
import { getUser } from '@/lib/supabase/property';
import { ReservationDeletedToast, ReservationCreatedToast } from '@/components/property/reservations/reservation-toast';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

type PropertyReservationsPageProps = Promise<{
    params: {
        propertyId: string;
    };
}>;

export default async function Page({ params }: {params:PropertyReservationsPageProps}) {

    const { propertyId } = (await params).params;
    let property: Tables<'properties'> | null = null;
    let reservations: Tables<'reservations'>[] = [];
    try {
        const user = await getUser();
        reservations = await getPropertyReservations({ property_id: propertyId });
    } catch (error) {
        console.error("Error fetching property or reservations:", error);
        return <p>Error fetching property or reservations.</p>;
    }
    return (
        <div className="flex-1 w-full flex flex-col items-center justify-start">
            <ReservationDeletedToast />
            <ReservationCreatedToast />
            {reservations.length > 0 ? (
                <ReservationList propertyId={propertyId} reservations={reservations} />
            ) :
                <div className='flex w-full flex-col items-center justify-center'>
                    There are no reservation for this property yet.
                </div>}
            <div className="text-center text-gray-500">
                <div>
                    <Button variant="outline" className="mt-4">
                        <Link href={`/protected/properties/${propertyId}/reservations/add`}>Add Reservation</Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}