import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { DeletePropertyButton } from '@/components/delete-property';

export default async function Page({ params }: { params: { propertyId: string } }) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user) {
        redirect('/auth/login');
    }

    const { data: property, error: propertyError } = await supabase
        .from('properties')
        .select('*')
        .eq('id', params.propertyId)
        .single();
    if (propertyError) {
        console.error('Error fetching property:', propertyError);
    }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-2xl font-bold mb-4">Delete Property</h1>
      <p className="text-lg mb-6">Are you sure you want to delete this property?</p>
        <div className="mb-4">
            <p className="text-lg font-semibold">{property?.name}</p>
            <p>{property?.address}</p>
        </div>
      <div className="flex gap-4">
        <Button variant="outline">
            <Link href="/protected/properties">Go Back</Link>
        </Button>
        <DeletePropertyButton propertyId={params.propertyId} />
      </div>
    </div>
  );
}