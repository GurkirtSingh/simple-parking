import { Tables } from "@/lib/supabase/database.types"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { PlusCircle } from "lucide-react";

export enum StallStatusColor {
    arriving = 'dark:text-background bg-green-100',
    checking_out = 'dark:text-background bg-amber-100',
    stayover = 'bg-stayover',
    default = '',
}


type ReservationGridCardProps = {
    stall: Tables<'property_stalls'>
    reservation: Tables<'current_reservation_status'>
}
export function ReservationGridCard({ stall, reservation }: ReservationGridCardProps) {
    type ValidStatus = keyof typeof StallStatusColor;
    let status: ValidStatus = 'default'
    if (reservation.status) {
        status = (reservation.status in StallStatusColor ? reservation.status : 'default') as ValidStatus;

    }
    return (
        <Link href={`/protected/properties/${reservation.property_id}/reservations/${reservation.reservation_id}/detail`}>
            <Card className={`w-full md:w-52 h-48 overflow-hidden flex flex-col hover:shadow-xl ${StallStatusColor[status]}`}>
                <CardHeader className="flex items-end gap-2">
                    <CardTitle className="text-2xl">{stall.name}</CardTitle>
                    <CardDescription>Stall</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col">
                    <div className="flex flex-col gap-0.5 text-sm overflow-y-auto leading-tight h-full">
                        {reservation.is_staff && <span className="truncate">Staff: {reservation.staff_name}</span>}
                        {reservation.hotel_room_number && <span className="truncate">Room: {reservation.hotel_room_number}</span>}
                        {reservation.hotel_reservation_number && <span className="truncate">Res ID: {reservation.hotel_reservation_number}</span>}
                        {reservation.license_plate && <span className="truncate">License: {reservation.license_plate}</span>}
                        {reservation.notes && <span className="truncate">Notes: {reservation.notes}</span>}
                    </div>
                </CardContent>
            </Card>
        </Link>
    )
}

type AddReservationCardProps = {
    stall: Tables<'property_stalls'>
    propertyId: string
}
export function AddReservationCard({ stall, propertyId }: AddReservationCardProps) {
    return (
        <Link href={`/protected/properties/${propertyId}/reservations/add?stallId=${stall.id}`}>
            <Card className="w-full md:w-52 h-48 hover:border-dashed border-spacing-4 border">
                <CardHeader className="flex items-end gap-2">
                    <CardTitle className="text-2xl">{stall.name}</CardTitle>
                    <CardDescription>Stall</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-4">
                    <PlusCircle className="text-gray-400 hover:text-green-500 w-10 h-10" />
                </CardContent>
            </Card>
        </Link>
    )
}
