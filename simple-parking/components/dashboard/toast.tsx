'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { toast } from 'sonner'


export default function DashboardToast() {
    const searchParams = useSearchParams()
    const router = useRouter()

    useEffect(() => {
        const checkout = searchParams.get('checkout')
        if (checkout === '1') {
            toast.success('Checked out successfully')
        }
        if (checkout === '0') {
            toast.error('Could Not Check out')
        }
        if (checkout) {
            const newParams = new URLSearchParams(searchParams)
            newParams.delete('checkout')
            router.replace(`/protected/dashboard?${newParams.toString()}`)
        }

    }, [searchParams, router])
    return null
}