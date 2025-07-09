"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronDownIcon } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Tables } from "@/lib/supabase/database.types";
import { insertReservations, updateReservations } from "@/lib/supabase/reservation";
import { createClient } from "@/lib/supabase/client";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

type ReservationFormProps = {
    className?: string;
    propertyId: string;
    stallId?: string;
    reservation?: Tables<"reservations"> | null;
};

export function ReservationFrom({
    className,
    propertyId,
    stallId,
    reservation = null,
    ...props }: ReservationFormProps) {
    const [stalls, setStalls] = useState<Tables<"property_stalls">[]>([]);
    const [selectedStall, setSelectedStall] = useState<Tables<"property_stalls">>()
    const [isStaff, setIsStaff] = useState<boolean | null>(reservation?.is_staff || false);
    const [staffName, setStaffName] = useState<string>(reservation?.staff_name || "");
    const [roomNumber, setRoomNumber] = useState<string>(reservation?.hotel_room_number || "");
    const [hotelRservationNumber, setHotelRservationNumber] = useState<string>(reservation?.hotel_reservation_number || "");
    const [licensePlate, setLicensePlate] = useState<string>(reservation?.license_plate || "");
    const [checkInDate, setCheckInDate] = useState<string>(reservation?.check_in ? new Date(reservation.check_in).toLocaleDateString('en-CA') : new Date().toLocaleDateString('en-CA'));
    const [checkInTime, setCheckInTime] = useState<string>(reservation?.check_in ? new Date(reservation.check_in).toLocaleTimeString('en-CA', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }) : new Date().toLocaleTimeString('en-CA', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }));
    const [checkOutDate, setCheckOutDate] = useState<string>(reservation?.check_out ? new Date(reservation.check_out).toLocaleDateString('en-CA') : new Date(Date.now() + 86400000).toLocaleDateString('en-CA'));
    const [checkOutTime, setCheckOutTime] = useState<string>(reservation?.check_out ? new Date(reservation.check_out).toLocaleTimeString('en-CA', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }) : "13:00:00");
    const [notes, setNotes] = useState<string>(reservation?.notes || "");
    const [openCheckIn, setOpenCheckIn] = useState(false);
    const [openCheckOut, setOpenCheckOut] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchStalls = async () => {
            const supabase = createClient();
            const { data, error } = await supabase
                .from('property_stalls')
                .select('*')
                .eq('property_id', propertyId);

            if (error) {
                console.error("Supabase error:", error);
                setError('Error loading stalls');
                return;
            }

            if (data) {
                setStalls(data);
                localStorage.setItem(`stalls:${propertyId}`, JSON.stringify(data));
            }
        };

        try {
            const cached = localStorage.getItem(`stalls:${propertyId}`);
            if (cached) {
                const parsed = JSON.parse(cached);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    setStalls(parsed);
                    return;
                }
            }
        } catch (err) {
            console.error("Error parsing cached stalls:", err);
        }

        fetchStalls();
    }, [propertyId]);

    useEffect(() => {
        if (stallId) {
            setSelectedStall(stalls.find(stall => stall.id === stallId))
        }
    }, [stallId, stalls])

    const handleReservationForm = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        if (!selectedStall) {
            setError("Please select a stall number");
            setIsLoading(false);
            return;
        }

        try {
            const combinedCheckIn = new Date(`${checkInDate}T${checkInTime}`).toISOString();
            const combinedCheckOut = new Date(`${checkOutDate}T${checkOutTime}`).toISOString();
            if (!combinedCheckIn || !combinedCheckOut) {
                setError("Please select both check-in and check-out dates and times.");
                setIsLoading(false);
                return;
            }
            if (reservation) {
                // Update existing property level
                const { error: updateError } = await updateReservations({
                    id: reservation.id,
                    property_id: propertyId,
                    stall_id: selectedStall.id,
                    is_staff: isStaff,
                    staff_name: staffName,
                    hotel_room_number: roomNumber,
                    hotel_reservation_number: hotelRservationNumber,
                    license_plate: licensePlate,
                    check_in: combinedCheckIn,
                    check_out: combinedCheckOut,
                    notes: notes
                });
                if (updateError) {
                    setError(updateError);
                    return;
                }
            } else {
                // Create new property level
                const { error: insertError } = await insertReservations({
                    property_id: propertyId,
                    stall_id: selectedStall.id,
                    is_staff: isStaff,
                    staff_name: staffName,
                    hotel_room_number: roomNumber,
                    hotel_reservation_number: hotelRservationNumber,
                    license_plate: licensePlate,
                    check_in: combinedCheckIn,
                    check_out: combinedCheckOut,
                    notes: notes,
                });
                if (insertError) {
                    setError(insertError);
                    return;
                }
            }
            // Redirect to property levels page
            router.push(`/protected/properties/${propertyId}/reservations`);
        } catch (error: unknown) {
            setError(error instanceof Error ? error.message : "An error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className="w-full">
                <CardHeader>
                    <CardTitle className="text-xl">{reservation ? "Update Reservation" : "New Reservation"}</CardTitle>
                    <CardDescription>
                        Enter {reservation ? "updated" : ""}{" "}reservation details below to {reservation ? "update" : "create new"} reservation for selected stall.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleReservationForm}>
                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col gap-5">
                                <Label htmlFor="selectedSatll" >Stall</Label>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <div className="flex flex-col">
                                            {stalls.length > 0 ? (
                                                <Button variant="outline">
                                                    {selectedStall ? stalls.find(stall => stall.id === selectedStall.id)?.name : 'Select Stall'}
                                                </Button>
                                            ) : (<Skeleton className="h-[35px] w-full rounded" />)}


                                        </div>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        {stalls.map((stall) => (
                                            <DropdownMenuItem
                                                key={stall.id}
                                                onClick={() => setSelectedStall(stall)}
                                            >
                                                {stall.name}
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                            <div className="flex items-center gap-5">
                                <div className="flex flex-1 flex-col gap-5">
                                    <Label htmlFor="checkIn">Check In Date</Label>
                                    <Popover open={openCheckIn} onOpenChange={setOpenCheckIn}>
                                        <PopoverTrigger asChild>
                                            <div className="w-[140px]">
                                                <Button type="button" variant="outline" id="checkInDate" className="w-full justify-between">
                                                    {checkInDate}
                                                    <ChevronDownIcon className="ml-2 h-4 w-4" />
                                                </Button>
                                            </div>
                                        </PopoverTrigger>
                                        <PopoverContent className="flex w-full p-4" align="end">
                                            <Calendar
                                                mode="single"
                                                selected={new Date(checkInDate + 'T00:00')}
                                                captionLayout="dropdown"
                                                startMonth={new Date()}
                                                endMonth={new Date(new Date().setFullYear(new Date().getFullYear() + 2))}
                                                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                                                onSelect={(date) => {
                                                    setOpenCheckIn(false)
                                                    setCheckInDate(date ? date.toLocaleDateString('en-CA') : "");
                                                }}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                                <div className="flex  flex-1 flex-col gap-5">
                                    <Label htmlFor="checkInTime" className="px-1">Time</Label>
                                    <Input
                                        type="time"
                                        id="checkInTime"
                                        value={checkInTime}
                                        onChange={(e) => setCheckInTime(e.target.value)}
                                        step="1"
                                        className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                                    />
                                </div>
                            </div>
                            <div className="flex iems-center gap-5">
                                <div className="flex flex-1 flex-col gap-5">
                                    <Label htmlFor="checkIn">Check Out Date</Label>
                                    <Popover open={openCheckOut} onOpenChange={setOpenCheckOut}>
                                        <PopoverTrigger asChild>
                                            <div className="w-[140px]">
                                                <Button type="button" variant="outline" id="checkOutDate" className="w-full justify-between">
                                                    {checkOutDate}
                                                    <ChevronDownIcon className="ml-2 h-4 w-4" />
                                                </Button>
                                            </div>
                                        </PopoverTrigger>
                                        <PopoverContent className="flex w-full p-4" align="end">
                                            <Calendar
                                                mode="single"
                                                selected={checkOutDate ? new Date(checkOutDate + "T00:00") : undefined}
                                                captionLayout="dropdown"
                                                startMonth={new Date()}
                                                endMonth={new Date(new Date().setFullYear(new Date().getFullYear() + 2))}
                                                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                                                onSelect={(date) => {
                                                    setOpenCheckOut(false)
                                                    setCheckOutDate(date ? date.toLocaleDateString('en-CA') : "");
                                                }}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                                <div className="flex flex-1 flex-col gap-5">
                                    <Label htmlFor="checkOutTime" className="px-1">Time</Label>
                                    <Input
                                        type="time"
                                        id="checkOutTime"
                                        value={checkOutTime}
                                        onChange={(e) => setCheckOutTime(e.target.value)}
                                        step="1"
                                        className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center w-full gap-4">
                                <Separator className="flex-1" />
                                <span className="text-sm text-muted-foreground">Optionals</span>
                                <Separator className="flex-1" />
                            </div>
                            <Label htmlFor="licensePlate">License Plate</Label>
                            <Input
                                id="licensePlate"
                                type="text"
                                placeholder="ABC-1234"
                                value={licensePlate}
                                onChange={(e) => setLicensePlate(e.target.value)}
                            />
                            <div className="flex gap-2">
                                <Label htmlFor="isStaff">Staff Parking</Label>
                                <Checkbox
                                    id="isStaff"
                                    checked={!!isStaff}
                                    onCheckedChange={(checked) => setIsStaff(!!checked)}
                                />
                            </div>
                            {isStaff ?
                                // Staff reservation fields
                                <div className="flex flex-col gap-5">
                                    <Label htmlFor="staffName">Staff Name</Label>
                                    <Input
                                        id="staffName"
                                        type="text"
                                        placeholder="John Doe"
                                        required
                                        value={staffName}
                                        onChange={(e) => setStaffName(e.target.value)}
                                    />
                                </div> :
                                // Guest reservation fields
                                <div className="flex flex-col gap-5">
                                    <Label htmlFor="roomNumber">Room Number</Label>
                                    <Input
                                        id="roomNumber"
                                        type="text"
                                        placeholder="201"
                                        value={roomNumber}
                                        onChange={(e) => setRoomNumber(e.target.value)}
                                    />
                                    <Label htmlFor="hotelReservationNumber">Reservation Number</Label>
                                    <Input
                                        id="hotelReservationNumber"
                                        type="text"
                                        placeholder="123456"
                                        value={hotelRservationNumber}
                                        onChange={(e) => setHotelRservationNumber(e.target.value)}
                                    />
                                </div>
                            }
                            <div className="flex flex-col gap-5">
                                <Label htmlFor="notes">Notes</Label>
                                <Textarea
                                    id="notes"
                                    placeholder="Any additional notes"
                                    rows={3}
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                />
                            </div>
                            {error && <p className="text-sm text-red-500">{error}</p>}
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ?
                                    reservation ? "Updateing Reservation..." : "Adding Reservation..." :
                                    reservation ? "Update Reservation" : "Add Reservation"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
