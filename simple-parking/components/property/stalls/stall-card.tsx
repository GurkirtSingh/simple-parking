import { Button } from "@/components/ui/button";
import { Tables } from "@/lib/supabase/database.types";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

type PropertyStallCardProps = {
    className?: string;
    propertyStall: Tables<"property_stalls">;
};
export default async function PropertyStallCard({propertyStall}: PropertyStallCardProps) {
    const supabase = await createClient();
    let propertyLevel: Tables<"property_levels"> | null = null;

    if (propertyStall.property_level_id){
        const { data: levelData, error: levelError } = await supabase
        .from("property_levels")
        .select("*")
        .eq("id", propertyStall.property_level_id)
        .single();

        if (levelError) {
            console.error("Error fetching property level:", levelError);
            return (<div>Error fetching property level</div>);
        }
        if (levelData){
            propertyLevel = levelData;
        }
    }
    return (
        <div className="flex flex-col gap-4 w-full max-w-sm">
            <Card className="shadow-md hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold">{propertyStall.name}{propertyLevel ? <span className="font-light">{ ` | ${propertyLevel.name}`}</span> : ""}</CardTitle>
                    <CardDescription className="flex text-sm text-gray-500 gap-1">
                        {propertyStall.is_accessible && <p>Accessible</p>}
                        {propertyStall.is_electric && <p>Electric</p>}
                        {propertyStall.is_compact && <p>Small</p>}
                        {propertyStall.is_large && <p>Large</p>}
                        </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-between items-center">
                    <div className="flex gap-2">
                        <Button variant="outline">
                            <Link href={`/protected/properties/${propertyStall.property_id}/stalls/${propertyStall.id}/edit`}>
                                Edit
                            </Link>
                        </Button>
                        <Button variant="destructive">
                            <Link href={`/protected/properties/${propertyStall.property_id}/stalls/${propertyStall.id}/delete`}>
                                Delete
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}   