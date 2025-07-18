import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { ParkingGrid } from "./parking-grid";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

export default async function PropertyTabs({ userId }: { userId: string }) {

    const supabase = await createClient();
    const { data: userProperties } = await supabase
        .from("user_properties")
        .select("*, properties(name)")
        .eq("user_id", userId)

    if (!userProperties?.length) {
        return (
            <div className="text-center text-gray-500">
                You have no properties yet. Start by adding a property.
                <div className="text-center text-gray-500">
                    <div>
                        <Link href="/protected/properties/add">
                            <Button variant="outline" className="mt-4">
                                Add Property
                            </Button>
                        </Link>

                    </div>
                </div>
            </div>
        )
    }
    return (
        <div>
            <Tabs defaultValue={userProperties[0]?.property_id}>
                <TabsList>
                    {userProperties.map((property) => (
                        <TabsTrigger key={property.property_id} value={property.property_id}>
                            {property.properties.name}
                        </TabsTrigger>
                    ))}
                </TabsList>
                <Separator/>
                {userProperties.map((property) => (
                    <TabsContent key={property.property_id} value={property.property_id}>
                        <ParkingGrid propertyId={property.property_id} />
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    )
}