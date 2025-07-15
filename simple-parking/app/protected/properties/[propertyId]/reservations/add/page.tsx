import { ReservationFrom } from "@/components/property/reservations/reservation-form";

type PropertyReservationAddPageProps = Promise<{
  params: {
    propertyId: string;
  };
}>

export default async function Page({ params }: {params:PropertyReservationAddPageProps}) {
  const { propertyId } = (await params).params
  return (
    <div className="flex w-full items-center justify-center">
      <div className="w-full max-w-sm">
        <ReservationFrom propertyId={propertyId}/>
      </div>
    </div>
  );
}