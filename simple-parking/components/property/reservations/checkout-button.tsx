"use client"

import { Button } from "@/components/ui/button";
import { checkoutReservation } from "@/lib/supabase/reservation";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

type CheckoutbuttonProps = {
    className?: string;
    propertyId: string;
    reservationId: string;
}
export default function CheckoutReservationButton({ className, reservationId, ...props}: CheckoutbuttonProps){
    const router = useRouter()
    const handleCheckout = async ()=>{
        const {error} = await checkoutReservation({reservationId})
        if(error){
            router.push(`/protected/dashboard?checkout=0`)
            return
        }
        router.push(`/protected/dashboard?checkout=1`)
    }
    return (
        <div className={cn( "flex items-center justify-center",className)} {...props}>
            <Button onClick={handleCheckout} className="w-full">Checkout</Button>
        </div>
    )
}