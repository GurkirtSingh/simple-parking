"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

type DeletePropertyButtonProps = {
  propertyId: string;
};

export function DeletePropertyButton({ propertyId }: DeletePropertyButtonProps) {
  const router = useRouter();

  const deleteProperty = async () => {
    const supabase = createClient();

    const { error } = await supabase.from("properties").delete().eq("id", propertyId);
    if (error) {
      let errorMessage = encodeURIComponent(error.message)
      if (error?.code === '23503') {
        errorMessage = "This property is in use and can't be deleted."
      }
      router.push(`/protected/properties?error=${errorMessage}`)
      return
    }
    router.push('/proptected/properties?delete=1')
  };

  return <Button variant="destructive" onClick={deleteProperty}>Delete</Button>;
}