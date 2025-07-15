import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Tables } from "@/lib/supabase/database.types";
import { PropertyStallForm } from "@/components/property/stalls/stall-form";

type PropertyStallEditPageParams = {
  propertyId: string;
  stallId: string;
};

export default async function Page({ params }: { params: Promise<PropertyStallEditPageParams> }) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/auth/login");
  }
  const { propertyId, stallId } = await params;
  let propertyStall: Tables<"property_stalls"> | null = null;


  const { data: result, error: propertyLevelError } = await supabase
    .from("property_stalls")
    .select("*")
    .eq("id", stallId)
    .maybeSingle();

    if (propertyLevelError) {
        console.error("Error fetching property stall:", propertyLevelError);
        return (<div>Error fetching property stall</div>);
    }
    if (result) {
        propertyStall = result;
    }

    return (
    <div className="flex w-full items-start justify-center">
        {propertyStall ? (
            <PropertyStallForm propertyId={propertyId} propertyStall={propertyStall} />
            ):(
            <p>Property level not found.</p>
        )}
    </div>)
}