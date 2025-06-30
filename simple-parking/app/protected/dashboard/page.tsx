import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

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
  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <div className="w-full">
        Hello {first_name} welcome to your dashboard!
      </div>
    </div>
  );
}
