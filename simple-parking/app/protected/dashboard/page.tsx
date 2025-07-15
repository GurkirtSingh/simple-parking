import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import DashboardToast from "@/components/dashboard/toast";
import PropertyTabs from "@/components/dashboard/property-tabs";

export default async function Page() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/auth/login");
  }

  // Fetch user profile data to greet the user
  // If no profile is found, redirect to setup profile page
  let first_name = "";
  if (data.user) {
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', data.user.id)
      .maybeSingle();
    if (error) {
      console.error("Error fetching user data:", error);
      redirect("/auth/login");
    }
    if (!profile) {
      redirect("/protected/setup-profile");
    }
    first_name = profile?.first_name || "";
  }
  // fetch user assigned properties
  const { data: userProperties, error:userPropertieserror } = await supabase
    .from("user_properties")
    .select("*, properties(name)")
    .eq("user_id", data.user.id)

  if (userPropertieserror) {
    console.error(userProperties)
  }
  return (
    <div className="flex w-full flex-col gap-12">
      <DashboardToast/>
      {userProperties && userProperties.length > 0 ? (
        <PropertyTabs userProperties={userProperties ?? []}/>
      ) : (
        <div className="text-center text-gray-500">
          You have no properties yet. Start by adding a property.
          <div className="text-center text-gray-500">
            <div>
              <Button variant="outline" className="mt-4">
                <Link href="/protected/properties/add">Add Property</Link>
              </Button>
            </div>
          </div>
        </div>


      )}
    </div>
  );
}
