import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
type PropertyStallDeletePageParams = {
    propertyId: string;
    stallId: string;
  };

export default async function Page({ params }: { params: Promise<PropertyStallDeletePageParams> }) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user) {
        redirect("/auth/login");
    }
    const { propertyId, stallId } = await params;
    // Delete the property level
    const { error: deleteError } = await supabase
        .from("property_stalls")
        .delete()
        .eq("id", stallId)

    if (deleteError) {
        if (deleteError?.code === '23503') {
            return "This stall is in use and can't be deleted."
        }
        return <div>Error deleting property level.</div>;
    }

    return (
        <div className="flex w-full items-center justify-center p-10 md:p-10">
            <div className="w-full max-w-sm">
                <h1 className="text-2xl text-red-400 mb-4">Property Stall Deleted</h1>
                <p>The stall has been deleted successfully.</p>
            </div>
        </div>
    )
}