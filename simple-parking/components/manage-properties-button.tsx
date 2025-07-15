import Link from "next/link";
import { Button } from "./ui/button";
import { getUser, getUserProperties } from "@/lib/supabase/property";

type ManagePropertiesButtonProps = {
    className?: string
}
export default async function ManagePropertiesButton({ className }: ManagePropertiesButtonProps) {
    const user = await getUser()
    if(user){
        const {userProperties} = await getUserProperties(user.id)
        if(userProperties){
            const adminProperty = userProperties.find((userProperty) => (userProperty.role === 'admin'))
            if(!adminProperty){
                return null
            }
        }
    }
    return (
        <div>
            <Link href={`/protected/properties`}>
                <Button variant="outline">Manage Properties</Button>
            </Link>
        </div>
    )
}