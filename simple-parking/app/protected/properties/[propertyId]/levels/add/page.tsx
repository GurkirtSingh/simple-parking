import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { PropertyLevelForm } from "@/components/property/levels/level-form";
export default async function Page({ params }: { params: { propertyId: string } }) {
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
        return <p>Error fetching property.</p>;
    }
    return (
    <div className="flex w-full items-center justify-center p-10 md:p-10">
      <div className="w-full max-w-sm">
        {property? (
            <div className="flex w-full items-center justify-center p-10 md:p-10">
                <div className="w-full max-w-sm">
                    <PropertyLevelForm property={property} />
                </div>
            </div>
        ) : (
          <p>Property not found.</p>
        )}
      </div>
    </div>)
}