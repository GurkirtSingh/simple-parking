import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import DashboardToast from "@/components/dashboard/toast";
import PropertyTabs from "@/components/dashboard/property-tabs";
import { Suspense } from "react";
import {LoadingPropertyStalls} from "./loading";

export default async function Page() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/auth/login");
  }

  // Fetch user profile data to greet the user
  // If no profile is found, redirect to setup profile page
  if (data.user) {
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('id', data.user.id)
      .maybeSingle();
    if (error) {
      console.error("Error fetching user data:", error);
      redirect("/auth/login");
    }
    if (!profile) {
      redirect("/protected/setup-profile");
    }
  }
  return (
    <div className="flex w-full flex-col gap-12">
      <DashboardToast />
      <Suspense fallback={<LoadingPropertyStalls/>}>
      <PropertyTabs userId={data.user.id} />
      </Suspense>
    </div>
  );
}
