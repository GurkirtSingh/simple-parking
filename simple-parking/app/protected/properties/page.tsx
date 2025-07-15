import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Tables } from "@/lib/supabase/database.types";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import PropertyCard from "@/components/property/property-card";
import PropertiesToast from "@/components/property/toast";

export default async function Page() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/auth/login");
  }
  let userPropfile: Tables<"user_profiles"> | null = null;

  const {data: propfile, error: profileError} = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", data.user.id)
    .maybeSingle();

  if (profileError) {
    console.error("Error fetching user profile:", profileError);
  }else if (propfile) {
    userPropfile = propfile;
  }

  const properties: Tables<"properties">[] = [];

  const { data: userProperties, error: propertiesError } = await supabase
    .from("user_properties")
    .select("*")
    .eq("user_id", data.user.id)

    if (propertiesError) {
        console.error("Error fetching user properties:", propertiesError);
    }
    if (userProperties && userProperties.length > 0) {
        for (const userProperty of userProperties) {
            const { data: property, error: propertyError } = await supabase
                .from("properties")
                .select("*")
                .eq("id", userProperty.property_id)
                .maybeSingle();

            if (propertyError) {
                console.error("Error fetching property:", propertyError);
            } else if (property) {
                properties.push(property);
            }
        }
    }


  return (
    <div className="flex-1 w-full flex flex-col items-center justify-start gap-12">
      <PropertiesToast/>
      <h1 className="text-2xl font-bold mb-4">{userPropfile ? `Hello ${userPropfile.first_name}, ` : ""}Welcome to your properties!</h1>
        
      {properties.length > 0 ? (
        <div className="flex flex-col gap-4">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      ):(
        <div className="text-center text-gray-500">
          You have no properties yet. Please add a property to get started.
        </div>
        
      )}
      <div className="text-center text-gray-500">
        <div>
          <Button variant="outline" className="mt-4">
            <Link href="/protected/properties/add">Add Property</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
