import { Tables } from "@/lib/supabase/database.types";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardAction,
    CardContent,
    CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Textarea } from "@/components/ui/textarea";
import CheckoutReservationButton from "./checkout-button";
import { Check } from "lucide-react";

function formatDateTime(date: string) {
    const d = new Date(date);
    return d.toLocaleDateString('en-CA') + ' ' + d.toLocaleTimeString('en-CA', { hour: '2-digit', minute: '2-digit' });
}

function EditReservationRouteString(propertyId: string, reservationId: string) {
    return `/protected/properties/${propertyId}/reservations/${reservationId}/edit`
}

type ReservationDetailCardProps = {
    className?: string;
    propertyId: string;
    reservation: Tables<"reservations">;
    stall: Tables<'property_stalls'>
}

export function ReservationDetailCard({ propertyId, reservation, stall }: ReservationDetailCardProps) {
    return (
        <Card className="w-full max-w-2xl">
            <CardHeader>
                <CardTitle className="text-xl">Details</CardTitle>
                <CardDescription>Showing all details of reservation</CardDescription>
                <CardAction className="flex gap-2">
                    <Link href={EditReservationRouteString(propertyId, reservation.id)}>Edit</Link>
                </CardAction>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-4 text-sm">
                    <div className="flex items-center justify-center border rounded p-4">
                        <span className="text-muted-foreground">
                            {stall.name}
                        </span>
                    </div>
                    <div className="flex items-center justify-between border rounded p-4">
                        <span>Check In</span>
                        <span className="text-muted-foreground">
                            {formatDateTime(reservation.check_in)}
                        </span>
                    </div>
                    <div className="flex items-center justify-between border rounded p-4">
                        <span>Check Out</span>
                        <span className="text-muted-foreground">
                            {formatDateTime(reservation.check_out)}
                        </span>
                    </div>
                    <div className="flex items-center justify-between border rounded p-4">
                        <span>License Plate</span>
                        <span className="text-muted-foreground">
                            {reservation.license_plate}
                        </span>
                    </div>
                    {reservation.is_staff ? (
                        <div className="flex items-center justify-between border rounded p-4">
                            <span>Staff Name</span>
                            <span className="text-muted-foreground">
                                {reservation.staff_name}
                            </span>
                        </div>
                    ) : (
                        <>
                            <div className="flex items-center justify-between border rounded p-4">
                                <span>Room Number</span>
                                <span className="text-muted-foreground">
                                    {reservation.hotel_room_number}
                                </span>
                            </div>
                            <div className="flex items-center justify-between border rounded p-4">
                                <span>Reservation Number</span>
                                <span className="text-muted-foreground">
                                    {reservation.hotel_reservation_number}
                                </span>
                            </div>
                        </>
                    )}
                    <Textarea
                        readOnly
                        rows={4}
                        value={reservation.notes ?? "No Notes"}
                    >
                    </Textarea>
                    <div className="flex items-center justify-between border rounded p-4">
                        <span>ID</span>
                        <span className="text-muted-foreground">
                            {reservation.id}
                        </span>
                    </div>
                    {reservation.checked_out ? (
                        <div className="flex items-center justify-between border rounded p-4">
                            <span>Checked Out</span>
                            <Check/>
                        </div>
                    ) : (<CheckoutReservationButton propertyId={propertyId} reservationId={reservation.id} />)}
                </div>
            </CardContent>
            <CardFooter>

            </CardFooter>
        </Card>
    )
}