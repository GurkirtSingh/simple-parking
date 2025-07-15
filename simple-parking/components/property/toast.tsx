'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { toast } from 'sonner'


export default function PropertiesToast() {
    const searchParams = useSearchParams()
    const router = useRouter()

    useEffect(() => {
    const error = searchParams.get('error')
    const deleted = searchParams.get('delete')

    if (error) {
        toast.error(
            <div>
                <h2>Error</h2>
                <p>{error}</p>
            </div>
        )
    } else if (deleted === '1') {
        toast.success('Property Deleted!')
    }

    if (error || deleted) {
        const newParams = new URLSearchParams(searchParams)
        newParams.delete('error')
        newParams.delete('delete')
        router.replace(`/protected/properties?${newParams.toString()}`)
    }
}, [searchParams, router])
    return null
}