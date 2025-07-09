"use client";
import { Tables } from '@/lib/supabase/database.types';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
type ReservationListProps = {
  className?: string;
  propertyId: string;
  reservations: Tables<'reservations'>[];
}
export function ReservationList({ propertyId, reservations }: ReservationListProps) {
  const [stalls, setStalls] = useState<Tables<"property_stalls">[]>([])
  const [stallMap, setStallMap] = useState<Record<string, string>>({});
useEffect(() => {
  const key = `stalls:${propertyId}`;

  const loadFromCache = () => {
    const cached = localStorage.getItem(key);
    if (!cached) return null;
    try {
      const parsed = JSON.parse(cached) as Tables<"property_stalls">[];
      if (Array.isArray(parsed)) {
        setStalls(parsed);
        const map = Object.fromEntries(parsed.map(stall => [stall.id, stall.name || stall.id]));
        setStallMap(map);
        return parsed;
      }
    } catch (err) {
      console.error("Error parsing cached stalls:", err);
    }
    return null;
  };

  const fetchFresh = async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("property_stalls")
      .select("*")
      .eq("property_id", propertyId);

    if (error) {
      console.error("Error fetching stalls", error);
      return;
    }

    if (data) {
      // If data differs from cache, update state + cache
      const cached = loadFromCache();
      const isDifferent = JSON.stringify(cached) !== JSON.stringify(data);
      if (isDifferent) {
        setStalls(data);
        const map = Object.fromEntries(data.map(stall => [stall.id, stall.name || stall.id]));
        setStallMap(map);
        localStorage.setItem(key, JSON.stringify(data));
      }
    }
  };

  loadFromCache();
  fetchFresh();
}, [propertyId]);
  const handleRowClick = (reservationId: string) => {
    // Navigate to the reservation detail page
    window.location.href = `/protected/properties/${propertyId}/reservations/${reservationId}/detail`;
  };
  return (
      <Table>
        <TableCaption>Total reservations showing {reservations.length}</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className='w-[12.5%]'>Stall</TableHead>
            <TableHead className='w-[12.5%]'>Check In</TableHead>
            <TableHead className='w-[12.5%]'>Check Out</TableHead>
            <TableHead className='w-[12.5%]'>License Plate</TableHead>
            <TableHead className='w-[12.5%]'>Room Number</TableHead>
            <TableHead className='w-[12.5%]'>Reservation Number</TableHead>
            <TableHead className='w-[12.5%]'>Staff Name</TableHead>
            <TableHead className='w-[12.5%]'>Notes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className=''>
          {reservations.map((reservation) => (
            <TableRow key={reservation.id} onClick={() => handleRowClick(reservation.id)} className="cursor-pointer transition-colors">
              <TableCell className='w-[12.5%] truncate' title={stallMap[reservation.stall_id]}>{stallMap[reservation.stall_id] || <Skeleton className="w-full h-4"/>}</TableCell>
              <TableCell className='w-[12.5%] truncate'>{new Date(reservation.check_in).toLocaleDateString('en-CA')}</TableCell>
              <TableCell className='w-[12.5%] truncate'>{new Date(reservation.check_out).toLocaleDateString('en-CA')}</TableCell>
              <TableCell className='w-[12.5%] truncate'>{reservation.license_plate}</TableCell>
              <TableCell className='w-[12.5%] truncate'>{reservation.hotel_room_number}</TableCell>
              <TableCell className='w-[12.5%] truncate'>{reservation.hotel_reservation_number}</TableCell>
              <TableCell className='w-[12.5%] truncate'>{reservation.is_staff ? reservation.staff_name : 'N/A'}</TableCell>
              <TableCell className='w-[12.5%] truncate' title={reservation.notes ? reservation.notes : ''}>{reservation.notes}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
  )
}