import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function getUserProperties(userId: string){
    const supabase = await createClient()

    const {data: userProperties, error} = await supabase.from('user_properties').select('property_id').eq('user_id', userId)
    if(error){
        return {
            error
        }
    }
    return {
        userProperties
    }
}

export async function getProperty(propertyId: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', propertyId)
        .maybeSingle();

    if (error) {
        console.error('Error fetching property:', error);
        throw new Error('Failed to fetch property');
    }
    return data || null;
}

export async function getUser(){
    const supabase = await createClient();

    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user) {
        redirect('/auth/login');
    }
    return data.user;
}