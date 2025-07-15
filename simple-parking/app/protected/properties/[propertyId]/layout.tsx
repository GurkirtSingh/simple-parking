import { createClient } from "@/lib/supabase/server";
import React from "react";

type PropertiesLayoutProps = {
    propertyId: string;
}

export default async function PropertiesLayout({children, params}: {children: React.ReactNode; params: Promise<PropertiesLayoutProps>}){
    const { propertyId } = await params
    let propertyName: string = '';
    const supabase =  await createClient()
    const {data, error} = await supabase.from('properties').select('name').eq('id', propertyId).maybeSingle()
    if(error){
        return <div>Could Not Found Property</div>
    }
    if(data){
        propertyName = data.name
    }

    return (
        <div className="flex flex-col gap-5 items-center justify-start">
            <h1 className="text-2xl font-bold">{propertyName}</h1>
            {children}
        </div>
    )
}