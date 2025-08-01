import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Tables } from "@/lib/supabase/database.types";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import PropertyStallCard from "@/components/property/stalls/stall-card";
type PropertyStallsPageProps = {
        propertyId: string;
};
export default async function Page({ params }: { params: Promise<PropertyStallsPageProps> }) {
    const { propertyId } = await params;
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user) {
        redirect("/auth/login");
    }

    let propertyStalls: Tables<"property_stalls">[] = []; 

    const { data: stalls, error: stallError } = await supabase
        .from("property_stalls")
        .select("*")
        .eq("property_id", propertyId)
    if (stallError) {
        console.error("Error fetching property stalls:", stallError);
        return (<div>Error fetching property stalls</div>);
    }
    if (stalls) {
        propertyStalls = stalls;
    }
    return (
        <div className="flex flex-col items-center justify-center gap-10">
            <div>
                <p className="mb-6">Manage the stalls for your property.</p>
            </div>
            <div className=" flex flex-col items-center justify-center w-full gap-4">
                {propertyStalls.length > 0 ? (
                <div className="flex flex-wrap items-start justify-around gap-4">
                    {propertyStalls.map((stall) => (
                        <PropertyStallCard key={stall.id} propertyStall={stall} />
                    ))}
                </div>) : (
                <div className="p-4 border rounded-md">
                    <p>No stalls found for this property.</p> 
                    </div>  
                )}
            </div>
            <div>
                <Button variant="outline" className="mt-4">
                    <Link href={`/protected/properties/${propertyId}/stalls/add`}>
                        Add New Stall
                    </Link>
                </Button>
            </div>
        </div>
        
    );
}