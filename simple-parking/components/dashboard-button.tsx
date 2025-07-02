"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function DashboardButton() {
  const router = useRouter();

  const goToDashboard = async () => {
    router.push("/protected/dashboard");
  };

  return <Button className="bg-green-500" onClick={goToDashboard}>Dashboard</Button>;
}
