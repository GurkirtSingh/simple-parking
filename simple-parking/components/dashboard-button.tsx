"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function DashboardButton() {
  const router = useRouter();

  const goToDashboard = async () => {
    router.push("/protected/dashboard");
  };

  return <Button variant='outline' onClick={goToDashboard}>Dashboard</Button>;
}
