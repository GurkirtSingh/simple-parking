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
import React, { useState } from "react";
import { PostgrestError } from "@supabase/supabase-js";
import { handleSupabaseError } from "@/lib/supabaseError";
import { Database, Tables } from "@/lib/supabase/database.types";


type PropertyFormProps ={ 
  property?: Tables<"properties"> | null;
};

export function PropertyForm({property}: PropertyFormProps) {
  const [name, setName] = useState(property?.name || "");
  const [address, setAddress] = useState(property?.address || "");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handlePropertyForm = async (e: React.FormEvent) => {
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
        // If a property is provided, update it instead of inserting a new one
        if (property) {
            const { data: updatedProperty, error: updateError } = await supabase
              .from("properties")
              .update({ name, address })
              .eq("id", property.id)
              .select()
              .single();

            // Handle any error that occurred during the update operation
            const errorMessage = handleSupabaseError(updateError as PostgrestError | null);
            if (errorMessage) {
                setError(errorMessage);
                setIsLoading(false);
                return;
            }
        } else{
            // insert the new property
        const { data: insertedProperty, error: insertError} = await supabase
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
        if (insertedProperty) {
          const { error: userPropertyError } = await supabase
            .from("user_properties")
            .insert([{ user_id: user.id, property_id: insertedProperty.id, role: "admin" }]);

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
    <div className={cn("flex flex-col gap-6")}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{property ? "Update Property" : "Add Property"}</CardTitle>
          <CardDescription>{property ? "Edit existing Property" : "Create new property"}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePropertyForm}>
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
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button type="submit" className="w-full" disabled={isLoading || !name || !address}>
                {isLoading ? "Adding a property..." : "Add Property"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
