"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

type DeletePropertyButtonProps = {
  propertyId: string;
};

export function DeletePropertyButton({propertyId}: DeletePropertyButtonProps) {
  const router = useRouter();

  const deleteProperty = async () => {
    const supabase = createClient();

    const { error} = await supabase.from("properties").delete().eq("id", propertyId);
    if (error) {
      console.error("Error deleting property:", error);
      return;
    }
    router.push("/protected/properties");
  };

  return <Button variant="destructive" onClick={deleteProperty}>Delete</Button>;
}