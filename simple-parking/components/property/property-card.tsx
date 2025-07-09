import { Button } from "@/components/ui/button";
import { Tables } from "@/lib/supabase/database.types";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import Link from "next/link";

type PropertyCardProps = {
    className?: string;
    property: Tables<"properties">;
};
export default async function PropertyCard({property}: PropertyCardProps) {

    return (
        <div className="flex flex-col gap-4 w-full max-w-sm">
            <Card className="shadow-md hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold">{property.name}</CardTitle>
                    <CardDescription className="flex text-sm text-gray-500 gap-1">
                        {property.address}
                        </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-between items-center">
                    <div className="flex flex-wrap gap-2">
                        <Button variant="outline">
                            <Link href={`/protected/properties/${property.id}/reservations`}>Reservations</Link>
                        </Button>
                        <Button variant="outline">
                            <Link href={`/protected/properties/${property.id}/stalls`}>Stalls</Link>
                        </Button>
                        <Button variant="outline">
                            <Link href={`/protected/properties/${property.id}/levels`}>Levels</Link>
                        </Button>
                        <Button variant="outline">
                            <Link href={`/protected/properties/${property.id}/edit`}>Edit</Link>
                        </Button>
                        <Button variant="destructive">
                            <Link href={`/protected/properties/${property.id}/delete`}>Delete</Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}   