import Link from "next/link";
import { Button } from "./ui/button";
import { Building } from "lucide-react";

export default async function ManagePropertiesButton() {
      return (
    <Link href="/protected/properties" >
      
      <Button variant="outline">
        <Building/>
        Properties
        </Button>
    </Link>
  )
}