import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Tables } from "@/lib/supabase/database.types";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PropertyLevelCard } from "@/components/property/levels/level-card";


export default async function Page({ params }: { params: Promise<{ propertyId: string }> }) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/auth/login");
  }
  const { propertyId } = await params;
  const { data: property, error: propertyError } = await supabase
    .from("properties")
    .select("*")
    .eq("id", propertyId)
    .maybeSingle();
    if (propertyError) {
        console.error("Error fetching property:", propertyError);
        if (propertyError.code === "22P02") {
            // Handle invalid UUID format error
            return <p>{`Invalid property ID ${propertyError.code} format.`}</p>;
        }
        return <p>{`Error fetching property. ${propertyError.code} format.`}</p>;
    }
    let propertyLevels: Tables<"property_levels">[] = [];
    const { data: levels, error: levelsError } = await supabase
        .from("property_levels")
        .select("*")
        .eq("property_id", propertyId);
    if (levelsError) {
        console.error("Error fetching property levels:", levelsError);
    } else if (levels && levels.length > 0) {
        propertyLevels = levels;
    }

    return (
    <div className="flex w-full items-center justify-center p-10 md:p-10">
      <div className="w-full max-w-sm">
        {property? (
            <div className="flex w-full items-center justify-center p-10 md:p-10">
                <div className="w-full max-w-sm">
                <h1 className="text-2xl font-bold mb-4">Property Levels for {property.name}</h1>
                {propertyLevels.length > 0 ? (
                    <ul className="mt-4">
                    {propertyLevels.map((level) => (
                        <PropertyLevelCard key={level.id} propertyLevel={level}/>
                    ))}
                    </ul>
                ) : (
                    <p>No levels found for this property.</p>
                )}
                </div>
            </div>
        ) : (
          <p>Property not found.</p>
        )}
        <div className="text-center text-gray-500">
        <div>
          <Button variant="outline" className="mt-4">
            <Link href={`/protected/properties/${property?.id}/levels/add`}>Add Property Level</Link>
          </Button>
        </div>
      </div>
      </div>
    </div>)
}