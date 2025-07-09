"use client"

import { useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { toast } from "sonner"

export function ReservationDeletedToast() {
  const searchParams = useSearchParams()
  const deleted = searchParams.get("deleted")

  useEffect(() => {
    if (deleted === "1") {
      toast.success("Reservation deleted successfully")
    }
  }, [deleted])

  return null
}

export function ReservationCreatedToast() {
  const searchParams = useSearchParams()
  const created = searchParams.get("created")

  useEffect(() => {
    if (created === "1") {
      toast.success("Reservation created successfully")
    }
  }, [created])

  return null
}