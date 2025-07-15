import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Tables } from "@/lib/supabase/database.types";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PropertyLevelForm } from "@/components/property/levels/level-form";

type PropertyLevelPageParams = {
  propertyId: string;
  levelId: string;
};

export default async function Page({ params }: { params: Promise<PropertyLevelPageParams> }) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/auth/login");
  }
  const { propertyId, levelId } = await params;
  const { data: property, error: propertyError } = await supabase
        .from("properties")
        .select("*")
        .eq("id", propertyId)
        .maybeSingle();

  const { data: propertyLevel, error: propertyLevelError } = await supabase
    .from("property_levels")
    .select("*")
    .eq("id", levelId)
    .maybeSingle();

    return (
    <div className="flex w-full items-center justify-center p-10 md:p-10">
        <div className="w-full max-w-sm">
            {property? (
                <div className="flex w-full items-center justify-center p-10 md:p-10">
                    <div className="w-full max-w-sm">
                        <h1 className="text-2xl mb-4">Edit Property Level for</h1>
                        <h1 className="text-2xl font-bold mb-4">
                            {property.name}
                        </h1>
                        {propertyLevel ? (
                            <PropertyLevelForm property={property} propertyLevel={propertyLevel} />
                        ):(
                            <p>Property level not found.</p>
                        )}
                        
                    </div>
                </div>
            ) : (
            <p>Property not found.</p>
            )}
            </div>
    </div>)
}