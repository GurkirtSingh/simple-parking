"use client";
import { Button } from "@/components/ui/button";
import { LayoutDashboard } from "lucide-react";
import Link from "next/link";

export function DashboardButton() {

  return (
    <Link href="/protected/dashboard" >
      
      <Button variant="outline">
        <LayoutDashboard />
        Dashboard
        </Button>
    </Link>
  )
}
