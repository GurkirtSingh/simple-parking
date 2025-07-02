import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Tables } from "@/lib/supabase/database.types";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Bold } from "lucide-react";

export default async function Page() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/auth/login");
  }

  let properties: Tables<"properties">[] = [];

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
    <div className="flex-1 w-full flex flex-col gap-12">
      <div className="w-full">
        Welcome to your propterties!
      </div>
      {properties.length > 0 ? (
        <div className="flex flex-col gap-4">
          {properties.map((property) => (
            <div key={property.id} className="p-4 border rounded-md">
              <h2 className="text-lg font-semibold">{property.name}</h2>
              <p>{property.address}</p>
              <div className="mt-2 p-6">
                <Button variant="outline" className="mr-2">
                  <Link href={`/protected/properties/${property.id}/edit`}>Edit</Link>
                </Button>
                </div>
            </div>
          ))}
        </div>
      ):(
        <div className="text-center text-gray-500">
          You have no properties yet. Please add a property to get started.
          <div>
            <Button variant="outline" className="mt-4">
                <Link href="/protected/properties/add">Add Property</Link>
            </Button>
          </div>
        
        </div>
        
      )}
    </div>
  );
}
