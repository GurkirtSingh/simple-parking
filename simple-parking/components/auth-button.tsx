import Link from "next/link";
import { Button } from "./ui/button";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "./logout-button";

export async function AuthButton() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let first_name = "";

  if(user){
    const {data: profile} = await supabase
    .from("user_profiles")
    .select("first_name")
    .eq("id", user.id)
    .single();

    if (profile) {
      first_name = profile.first_name;
    }
  }
  

  return user ? (
    <div className="flex items-center gap-4">
      Hey, {first_name}!
      <LogoutButton />
    </div>
  ) : (
    <div className="flex gap-2">
      <Button asChild size="sm" variant={"outline"}>
        <Link href="/auth/login">Sign in</Link>
      </Button>
      <Button asChild size="sm" variant={"default"}>
        <Link href="/auth/sign-up">Sign up</Link>
      </Button>
    </div>
  );
}
