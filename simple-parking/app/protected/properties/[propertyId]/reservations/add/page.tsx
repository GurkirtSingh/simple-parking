import { ReservationFrom } from "@/components/property/reservations/reservation-form";

type PropertyReservationAddPageParams = {
  propertyId: string;
};

export default async function Page({ params }: { params: Promise<PropertyReservationAddPageParams> }) {
  const { propertyId } = await params;
  return (
    <div className="flex w-full items-center justify-center">
      <div className="w-full max-w-sm">
        <ReservationFrom propertyId={propertyId}/>
      </div>
    </div>
  );
}