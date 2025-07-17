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
    arriving = 'bg-sky-300 border-sky-500 dark:text-sky-800',
    checking_out = 'bg-lime-300 border-lime-500 dark:text-lime-800',
    stayover = 'bg-zinc-300 border-zinc-500 dark:text-zinc-800',
    staff = 'bg-purple-300 border-purple-500 dark:text-purple-800',
    default = '',
}


type ReservationGridCardProps = {
    stall: Tables<'property_stalls'>
    reservation: Tables<'current_reservation_status'>
}
export function ReservationGridCard({ stall, reservation }: ReservationGridCardProps) {
    type ValidStatus = keyof typeof StallStatusColor;
    let status: ValidStatus = 'default'

    if(reservation.is_staff){
        status = "staff"
    }else if(reservation.status){
        status = (reservation.status in StallStatusColor ? reservation.status : 'default') as ValidStatus;
    }
    return (
        <Link href={`/protected/properties/${reservation.property_id}/reservations/${reservation.reservation_id}/detail`}>
            <Card className={`w-full md:w-52 h-48 overflow-hidden hover:border-black border-2 ${StallStatusColor[status]}`}>
                <CardHeader>
                    <CardTitle className="text-2xl">{stall.name}</CardTitle>
                    <CardDescription></CardDescription>
                </CardHeader>
                <CardContent>
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
            <Card className="w-full md:w-52 h-48 hover:border-dashed border-2">
                <CardHeader className="flex">
                    <CardTitle className="text-2xl">{stall.name}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-4">
                    <PlusCircle className="text-gray-400 hover:text-foreground w-10 h-10" />
                </CardContent>
            </Card>
        </Link>
    )
}
