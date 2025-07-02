import { Button } from "@/components/ui/button";
import { Tables } from "@/lib/supabase/database.types";

type PropertyLevelCardProps = {
    className?: string;
    propertyLevel: Tables<"property_levels">;
};
export function PropertyLevelCard({propertyLevel}: PropertyLevelCardProps) {
    return (
        <div className="flex items-center justify-between p-4 border rounded-lg shadow-md">
            <h2 className="text-lg font-semibold">{propertyLevel.name}</h2>
            <div className="mt-2 flex space-x-2">
                <Button variant="outline" className="mr-2">
                    <a href={`/protected/properties/${propertyLevel.property_id}/levels/${propertyLevel.id}/edit`}>Edit</a>
                </Button>
                <Button variant="outline" className="mr-2">
                    <a href={`/protected/properties/${propertyLevel.property_id}/levels/${propertyLevel.id}/delete`}>Delete</a>
                </Button>
            </div>
        </div>
    )
}