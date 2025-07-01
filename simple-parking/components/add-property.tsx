"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { PostgrestError } from "@supabase/supabase-js";
import { handleSupabaseError } from "@/lib/supabaseError";

export function AddProperty({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleAddProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
        // Get the current user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            setError("You must be logged in to add a property.");
            setIsLoading(false);
            return;
        }
        // insert the new property
        const { data: property, error: insertError} = await supabase
          .from("properties")
          .insert([{ name, address }])
          .select()
          .single();

        // Handle any error that occurred during the insert or read operation
        const errorMessage = handleSupabaseError(insertError as PostgrestError | null);
        if (errorMessage) {
            setError(errorMessage);
            setIsLoading(false);
            return;
        }

        // If the property was successfully inserted, insert the user-property relationship
        if (property) {
          const { error: userPropertyError } = await supabase
            .from("user_properties")
            .insert([{ user_id: user.id, property_id: property.id, role: "admin" }]);

            // Handle any error that occurred during the user-property insert
            if (userPropertyError){
                const userPropertyErrorMessage = handleSupabaseError(userPropertyError as PostgrestError | null);
                if (userPropertyErrorMessage) {
                    setError(userPropertyErrorMessage);
                    setIsLoading(false);
                    return;
                }
            } 
        }
        router.push("/protected/properties");
          
    } catch (error: unknown) {
        console.error("Error adding property:", error );
        setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Add Property</CardTitle>
          <CardDescription>Create new property</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddProperty}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="My Awesome Property"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="address">Address</Label>
                </div>
                <Input
                  id="address"
                  type="textfield"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Adding a property..." : "Add Property"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
