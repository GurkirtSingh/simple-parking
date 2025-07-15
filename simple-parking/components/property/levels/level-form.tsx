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
import { Tables } from "@/lib/supabase/database.types";

type PropertyLevelFormProps ={
    className?: string; 
    property: Tables<"properties">;
    propertyLevel?: Tables<"property_levels"> | null;
};

export function PropertyLevelForm({
    className, 
    property, 
    propertyLevel, 
    ...props}: PropertyLevelFormProps) {
  const [propertyLevelName, setPropertyLevelName] = useState( propertyLevel?.name ||"");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handlePropertyLevelForm = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
        if (propertyLevel){
        // Update existing property level
        const { error: updateError } = await supabase
          .from("property_levels")
          .update({ name: propertyLevelName })
          .eq("id", propertyLevel.id)
          .eq("property_id", property.id);
        if (updateError) {
          setError(updateError.message);
          return;
        }
        } else {
        // Create new property level
        const { error: insertError } = await supabase
          .from("property_levels")
          .insert({
            name: propertyLevelName,
            property_id: property.id,
          });
        if (insertError) {
          setError(insertError.message);
          return;
        }
    }
    // Redirect to property levels page
    router.push(`/protected/properties/${property.id}/levels`);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{propertyLevel ? "Update Property Level" : "Add New Level"}</CardTitle>
          <CardDescription>
            Enter {propertyLevel? "updated" : ""}{" "}level name below to {propertyLevel? "update" : "add"} property level.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePropertyLevelForm}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Level Name</Label>
                <Input
                  id="propertyLevelName"
                  type="text"
                  placeholder="Level 2"
                  required
                  value={propertyLevelName}
                  onChange={(e) => setPropertyLevelName(e.target.value)}
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 
                propertyLevel ? "Updateing Level..." : "Adding Level..." : 
                propertyLevel ? "Update Level" : "Add Level"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
