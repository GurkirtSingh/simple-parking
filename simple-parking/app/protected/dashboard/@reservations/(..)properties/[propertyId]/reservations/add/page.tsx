import { ReservationFrom } from "@/components/property/reservations/reservation-form";
import SlideOverModal from "@/components/ui/slide-over-modal";

type PropertyReservationAddPageProps = Promise<{
  params: {
    propertyId: string;
  };
}>;

export default async function Page({ params }: {params:PropertyReservationAddPageProps}) {

  const { propertyId } = (await params).params;
  return (
      <SlideOverModal>
        <ReservationFrom propertyId={propertyId} />
      </SlideOverModal>
  );
}