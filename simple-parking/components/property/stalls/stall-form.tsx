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
import { Checkbox } from "@/components/ui/checkbox";
import {DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Tables } from "@/lib/supabase/database.types";

type PropertyStallFormProps ={
    className?: string; 
    propertyId: string;
    propertyStall?: Tables<"property_stalls"> | null;
};

export function PropertyStallForm({
    className, 
    propertyId, 
    propertyStall, 
    ...props}: PropertyStallFormProps) {
  const [stallName, setStallName] = useState( propertyStall?.name || "");
  const [isAccessible, setIsAccessible] = useState(propertyStall?.is_accessible || false);
  const [isElectric, setIsElectric] = useState(propertyStall?.is_electric || false);
  const [isCompact, setIsCompact] = useState(propertyStall?.is_compact || false);
  const [isLarge, setIsLarge] = useState(propertyStall?.is_large || false);
  const [propertyLevelId, setPropertyLevelId] = useState(propertyStall?.property_level_id || "");
  const [propertyLevels, setPropertyLevels] = useState<Tables<"property_levels">[]>([]);

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

    // Fetch property levels on component mount
    useEffect(() => {
        const fetchPropertyLevels = async () => {
            const supabase = createClient();
            try {
                const { data: levels, error: levelsError } = await supabase
                    .from("property_levels")
                    .select("*")
                    .eq("property_id", propertyId);
                if (levelsError) {
                    console.error("Error fetching property levels:", levelsError);
                    setError("Failed to fetch property levels");
                } else {
                    setPropertyLevels(levels || []);
                }
            } catch (error) {
                console.error("Error fetching property levels:", error);
                setError("An error occurred while fetching property levels");
            }
        };
        fetchPropertyLevels();
    },[propertyId]);


  const handlePropertyStallForm = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    // Validate required fields
    if(propertyLevelId === "") {
      setError("Please select a property level.");
      setIsLoading(false);
      return;
    }

    try {
        if (propertyStall){
        // Update existing property level
        const { error: updateError } = await supabase
          .from("property_stalls")
          .update({ name: stallName,
                   is_accessible: isAccessible,
                   is_electric: isElectric,
                   is_compact: isCompact,
                   is_large: isLarge,
                   property_level_id: propertyLevelId })
          .eq("id", propertyStall.id)
        if (updateError) {
          setError(updateError.message);
          return;
        }
        } else {
        // Create new property level
        const { error: insertError } = await supabase
          .from("property_stalls")
          .insert({
            name: stallName,
            property_id: propertyId,
            is_accessible: isAccessible,
            is_electric: isElectric,
            is_compact: isCompact,
            is_large: isLarge,
            property_level_id: propertyLevelId,
          });
        if (insertError) {
          setError(insertError.message);
          return;
        }
    }
    // Redirect to property levels page
    router.push(`/protected/properties/${propertyId}/stalls`);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleIsLargeChange = (checked: boolean) => {
    if (checked) {
      setIsCompact(false);
      setIsLarge(true);
    }else {
      setIsLarge(false);
    }
  }
  const handleIsCompactChange = (checked: boolean) => {
    if (checked) {
        setIsLarge(false);
        setIsCompact(true);
    }else {
        setIsCompact(false);
    }
  }
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{propertyStall ? "Update Existing Stall" : "Add New Stall"}</CardTitle>
          <CardDescription>
            Enter {propertyStall? "updated" : ""}{" "}stall details below to {propertyStall? "update" : "add"} property stall.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePropertyStallForm}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="stallName">Stall Display Name</Label>
                <Input
                  id="stallName"
                  type="text"
                  placeholder="Stall 118"
                  required
                  value={stallName}
                  onChange={(e) => setStallName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                    <Label htmlFor="propertyLevelId">Select Property Level</Label>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="w-full">
                                {propertyLevelId ? 
                                    propertyLevels.find(level => level.id === propertyLevelId)?.name || "Select Level" : 
                                    "Select Level"}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-64">
                            {propertyLevels.map((level) => (
                                <DropdownMenuItem
                                    key={level.id}
                                    onClick={() => setPropertyLevelId(level.id)}
                                >
                                    {level.name}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
              <div className="flex items-center justify-between gap-2">
                <Label htmlFor="isAccessible">Stall Is Accessible</Label>
                <Checkbox
                  id="isAccessible"
                  checked={isAccessible}
                  onCheckedChange={(checked) => setIsAccessible(!!checked)}
                />
              </div>
                <div className="flex items-center justify-between gap-2">
                    <Label htmlFor="isElectric">Stall Is Electric</Label>
                    <Checkbox
                    id="isElectric"
                    checked={isElectric}
                    onCheckedChange={(checked) => setIsElectric(!!checked)}
                    />
                </div>
                <div className="flex items-center justify-between gap-2">
                    <Label htmlFor="isCompact">Stall Is Compact</Label>
                    <Checkbox
                    id="isCompact"
                    checked={isCompact}
                    onCheckedChange={(checked) => handleIsCompactChange(!!checked)}
                    />
                </div>
                <div className="flex items-center justify-between gap-2">
                    <Label htmlFor="isLarge">Stall Is Large</Label>
                    <Checkbox
                    id="isLarge"
                    checked={isLarge}
                    onCheckedChange={(checked) => handleIsLargeChange(!!checked)}
                    />
                </div>
            </div>
              {error && <div className="text-sm text-red-500 mt-4">{error}</div>}
              <Button type="submit" className="w-full my-4" disabled={isLoading || !propertyLevelId || stallName === ""}>
                {isLoading ? 
                propertyStall ? "Updateing Stall..." : "Adding Stall..." : 
                propertyStall ? "Update Stall" : "Add Stall"}
              </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
