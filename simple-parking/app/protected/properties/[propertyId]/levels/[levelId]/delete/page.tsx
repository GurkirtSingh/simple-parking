import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
type PropertyLevelPageProps = {
    params: { 
        propertyId: string;
        levelId: string 
    };
}

export default async function Page({params}: PropertyLevelPageProps) {
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
    if (propertyError) {
        console.error("Error fetching property:", propertyError);
        return <p>Error fetching property.</p>;
    }
    const { data: propertyLevel, error: propertyLevelError } = await supabase
        .from("property_levels")
        .select("*")
        .eq("id", levelId)
        .maybeSingle();
    if (propertyLevelError) {
        console.error("Error fetching property level:", propertyLevelError);
        return <p>Error fetching property level.</p>;
    }
    if (!property || !propertyLevel) {
        return <p>Property or property level not found.</p>;
    }
    // Delete the property level
    const { error: deleteError } = await supabase
        .from("property_levels")
        .delete()
        .eq("id", levelId)
        .eq("property_id", propertyId);
    if (deleteError) {
        console.error("Error deleting property level:", deleteError);
        return <p>Error deleting property level.</p>;
    } 
    return (
        <div className="flex w-full items-center justify-center p-10 md:p-10">
            <div className="w-full max-w-sm">
                <h1 className="text-2xl text-red-400 mb-4">Property Level Deleted</h1>
                <p>The <b>{propertyLevel.name}</b> has been delete from <b>{property.name}</b> property.</p>
            </div>
        </div>
        );
}