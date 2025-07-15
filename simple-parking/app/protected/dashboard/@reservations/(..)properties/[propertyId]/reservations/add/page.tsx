import { ReservationFrom } from "@/components/property/reservations/reservation-form";
import SlideOverModal from "@/components/ui/slide-over-modal";

type PropertyReservationAddPageParams = {
  propertyId: string;
};

export default async function Page({ params }: { params: Promise<PropertyReservationAddPageParams> }) {

  const { propertyId } = await params;
  return (
      <SlideOverModal>
        <ReservationFrom propertyId={propertyId} />
      </SlideOverModal>
  );
}