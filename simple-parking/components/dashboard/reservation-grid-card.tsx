import { Tables } from "@/lib/supabase/database.types"
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Accessibility, Cable, PlusCircle } from "lucide-react";
import { Badge } from "../ui/badge";

export enum StallStatusColor {
    arriving = 'bg-[--arriving] border-[--arriving-border]',
    checking_out = 'bg-[--checkout] border-[--checkout-border]',
    stayover = 'bg-[--stayover] border-[--stayover-border]',
    staff = 'bg-[--staff] border-[--staff-border]',
    default = '',
}


type ReservationGridCardProps = {
    stall: Tables<'property_stalls'>
    reservation: Tables<'current_reservation_status'>
}
export function ReservationGridCard({ stall, reservation }: ReservationGridCardProps) {
    type ValidStatus = keyof typeof StallStatusColor;
    let status: ValidStatus = 'default'

    if (reservation.is_staff) {
        status = "staff"
    } else if (reservation.status) {
        status = (reservation.status in StallStatusColor ? reservation.status : 'default') as ValidStatus;
    }
    return (
        <Link href={`/protected/properties/${reservation.property_id}/reservations/${reservation.reservation_id}/detail`}>
            <Card className={`w-full md:w-52 h-44 flex flex-col gap-2 overflow-hidden hover:border-foreground border-2 ${StallStatusColor[status]} text-[--card-text] py-4`}>
                <CardHeader className="flex justify-between items-center">
                    <CardTitle className="text-2xl max-w-48 truncate ">{stall.name}</CardTitle>
                    {reservation.is_akia_paid && <Badge>Akia</Badge>}
                </CardHeader>
                <CardContent className="h-full">
                    <div className="flex flex-col gap-0.5 text-sm overflow-y-auto leading-tight ">
                        {reservation.is_staff && <span className="truncate">Staff: {reservation.staff_name}</span>}
                        {reservation.hotel_room_number && <span className="truncate">Room: {reservation.hotel_room_number}</span>}
                        {reservation.hotel_reservation_number && <span className="truncate">Res ID: {reservation.hotel_reservation_number}</span>}
                        {reservation.license_plate && <span className="truncate">License: {reservation.license_plate}</span>}
                        {reservation.notes && <span className="truncate">Notes: {reservation.notes}</span>}
                    </div>
                </CardContent>
                <CardFooter>
                    {reservation.is_akia_paid && <p className=" text-[10px] truncate">* This reservation is paid on Akia</p>}
                </CardFooter>
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
            <Card className="w-full md:w-52 h-44 hover:border-dashed border-2 py-4">
                <CardHeader className="flex items-center justify-between">
                    <CardTitle className="text-2xl max-w-48 truncate">{stall.name}</CardTitle>
                    <div className="flex gap-2">
                        {stall.is_accessible &&
                            <Accessibility className="text-blue-500" />}
                        {stall.is_electric &&
                            <Cable className="text-green-500" />}
                        {stall.is_large &&
                            <Badge variant="outline" className="bg-sky-500">L</Badge>}
                        {stall.is_compact &&
                            <Badge variant="outline" className="bg-amber-500">S</Badge>}
                    </div>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-4">
                    <PlusCircle className="text-gray-400 hover:text-foreground w-10 h-10" />
                </CardContent>
            </Card>
        </Link>
    )
}
