"use server";
import { createClient } from '@/lib/supabase/server';
import { SupabaseClient } from '@supabase/supabase-js'
import { Tables, Database } from "@/lib/supabase/database.types";
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// Shared validation: check-out must be after check-in
function validateCheckOutAfterCheckIn(check_in: string, check_out: string) {
    if (new Date(check_out) <= new Date(check_in)) {
        return "Check-out date must be after check-in date.";
    }
    return null;
}

function validateCheckInCheckOutNotPast(check_in: string, check_out: string) {
    const nowWithBuffer = new Date(Date.now() - 2 * 60 * 60 * 1000);
    if (new Date(check_in) < nowWithBuffer) {
        return "Check-in date cannot be in the past.";
    }
    if (new Date(check_out) < new Date()) {
        return "Check-out date cannot be in the past.";
    }
}

type OverlapProps = {
    supabase: SupabaseClient<Database>;
    stall_id: string; // Stall ID to check for overlaps
    check_in: string; // Check-in date
    check_out: string; // Check-out date
    excludeId?: string; // Optional ID to exclude from overlap check (for updates)
};
// Shared overlap check
async function hasOverlap({ supabase, stall_id, check_in, check_out, excludeId }: OverlapProps) {
    let query = supabase
        .from('reservations')
        .select('id')
        .eq('stall_id', stall_id)
        .lt('check_in', check_out)
        .gt('check_out', check_in)
        .limit(1);

    if (excludeId) {
        query = query.not('id', 'eq', excludeId);
    }
    const { data: existing } = await query;
    if (existing && existing.length > 0) {
        return true
    } else return false
}

type NewReservation = Omit<Tables<"reservations">, 'id' | 'created_by' | 'created_at'>;
export async function insertReservations(reservation: NewReservation) {
    const supabase = await createClient();

    const checkInAfterCheckoutError = validateCheckOutAfterCheckIn(reservation.check_in, reservation.check_out);
    if (checkInAfterCheckoutError) return { error: checkInAfterCheckoutError };
    const dateInPastError = validateCheckInCheckOutNotPast(reservation.check_in, reservation.check_out);
    if (dateInPastError) return { error: dateInPastError };

    const conflict = await hasOverlap({
        supabase,
        stall_id: reservation.stall_id,
        check_in: reservation.check_in,
        check_out: reservation.check_out,
    });
    if (conflict) {
        return {
            error: "This stall is already reserved for the selected dates.",
        };
    }

    const { data, error } = await supabase
        .from('reservations')
        .insert(reservation)
        .single();

    if (error) {
        return {
            error: error.message || "Failed to insert reservation",
        };
    } else {
        revalidatePath(`/protected/properties/${reservation.property_id}/reservations`)
        return {
            success: data
        }
    }
}

type UpdateReservation = Omit<Tables<"reservations">, 'created_by' | 'created_at'>;
export async function updateReservations(reservation: UpdateReservation) {
    const supabase = await createClient();

    const dateError = validateCheckOutAfterCheckIn(reservation.check_in, reservation.check_out);
    if (dateError) return { error: dateError };

    const conflict = await hasOverlap({
        supabase,
        stall_id: reservation.stall_id,
        check_in: reservation.check_in,
        check_out: reservation.check_out,
        excludeId: reservation.id, // Exclude current reservation from overlap check
    });
    if (conflict) {
        return {
            error: "This stall is already reserved for the selected dates.",
        };
    }

    const { data, error } = await supabase
        .from('reservations')
        .update(reservation)
        .eq('id', reservation.id)
        .single();

    if (error) {
        console.error(error)
        return {
            error: error.message || "Failed to update reservation",
        };
    }else {
        revalidatePath(`/protected/properties/${reservation.property_id}/reservations`)
        return {
            success: data
        }
    }
}

type DeleteReservation = {
    propertyId: string;
    reservationId: string;
}
export async function deleteReservation({ propertyId, reservationId }: DeleteReservation) {
    const supabse = await createClient()
    const { error } = await supabse.from('reservations').delete().eq('id', reservationId)
    if (error) {
        redirect(`/protected/properties/${propertyId}/reservations?delete=0`)
    } else {
        revalidatePath(`/protected/properties/${propertyId}/reservations`)
        redirect(`/protected/properties/${propertyId}/reservations?deleted=1`)
    }
}

type CheckoutReservationProps = {
    reservationId: string;
}
export async function checkoutReservation({ reservationId }: CheckoutReservationProps) {
    const supabse = await createClient()
    const { error } = await supabse.from('reservations').update({checked_out : true, check_out : new Date().toISOString()}).eq('id', reservationId)
    if (error) {
        return {
            error: error.message
        }
    } else {
        return {
            success: true
        }
    }
}