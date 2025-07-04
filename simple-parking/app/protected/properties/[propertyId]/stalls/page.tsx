import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Tables } from "@/lib/supabase/database.types";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import PropertyStallCard from "@/components/property/stalls/stall-card";
type PropertyStallsPageProps = {
    params: {
        propertyId: string;
    };
};
export default async function Page({params}: PropertyStallsPageProps) {
    const { propertyId } = await params;
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user) {
        redirect("/auth/login");
    }

    let property: Tables<"properties"> | null = null;
    let propertyStalls: Tables<"property_stalls">[] = [];

    const {data: result, error: selectPropertyError} = await supabase
            .from("properties")
            .select("*")
            .eq("id", propertyId)
            .maybeSingle();
    if (selectPropertyError) {
        console.error("Error fetching property:", selectPropertyError);
        return (<div>Error fetching property</div>);
    }
    if (result) {
        property = result;
    } else {
        console.error("Property not found");
        return (<div>Property not found</div>);
    }   

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
                <h1 className="flex items-center justify-center text-2xl font-bold mb-4">{property.name}</h1>
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