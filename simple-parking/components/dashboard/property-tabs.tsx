import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { Tables } from "@/lib/supabase/database.types"
import { ParkingGrid } from "./parking-grid";

type PropertyTabsProps = {
  userProperties: (Tables<"user_properties"> & {
    properties: Pick<Tables<"properties">, "name">
  })[];
}
export default async function PropertyTabs({ userProperties }: PropertyTabsProps) {
    return (
        <div className="flex w-full flex-col gap-6">
            <Tabs defaultValue={userProperties[0]?.property_id}>
                <TabsList>
                    {userProperties.map((property) => (
                    <TabsTrigger key={property.property_id} value={property.property_id}>
                      {property.properties.name}
                    </TabsTrigger>
                    ))}
                    
                </TabsList>
                {userProperties.map((property) => (
                    <TabsContent key={property.property_id} value={property.property_id}>
                    <ParkingGrid propertyId={property.property_id}/>
                </TabsContent>
                    ))}
            </Tabs>
        </div>
    )
}