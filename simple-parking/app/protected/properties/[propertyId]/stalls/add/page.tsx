import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { PropertyStallForm } from "@/components/property/stalls/stall-form";

type PropertyLevelPageParams = {
  propertyId: string;
};
export default async function Page({ params }: { params: Promise<PropertyLevelPageParams> }) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/auth/login");
  }
  const { propertyId } = await params;
    return (
    <div className="flex w-full items-start justify-center">
        {propertyId ? (
            <PropertyStallForm propertyId={propertyId}/>
            ):(
            <p>Property level not found.</p>
        )}
    </div>)
}