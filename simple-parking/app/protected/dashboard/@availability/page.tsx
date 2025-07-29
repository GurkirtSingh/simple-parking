import PropertyAvailabilityChart from "@/components/availability/availability-chart";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function Page() {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user) {
        redirect("/auth/login");
    }

    const { data: userProperties } = await supabase
        .from("user_properties")
        .select("*, properties(name)")
        .eq("user_id", data.user.id)
    return (
        <div className="flex xl:flex-col gap-4 xl:justify-center xl:items-center w-full">
            {userProperties && userProperties.map((up) => {
                return <PropertyAvailabilityChart key={up.property_id} propertyId={up.property_id} propertyName={up.properties.name}/>
            })}

        </div>
    )
}