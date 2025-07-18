'use client'

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { usePathname } from "next/navigation"
import Link from "next/link"

export default function BreadcrumbClient(){
    const pathname = usePathname()

    const segments = pathname.split("/").filter(Boolean).slice(1) // remove 'protected'
    const breadcrumbItems = segments.map((segment, index) => {
        const href = "/" + segments.slice(0, index + 1).join("/")
        const isLast = index === segments.length - 1
        const label = decodeURIComponent(segment).replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())
        return (
            <span key={href} className="flex items-center">
                {index > 0 && <BreadcrumbSeparator />}
                <BreadcrumbItem>
                    {isLast ? (
                        <span className="text-muted-foreground">{label}</span>
                    ) : (
                        <BreadcrumbLink asChild>
                            <Link href={href}>{label}</Link>
                        </BreadcrumbLink>
                    )}
                </BreadcrumbItem>
            </span>
        )
    })

        return  (
            <Breadcrumb>
            <BreadcrumbList>{breadcrumbItems}</BreadcrumbList>
            </Breadcrumb>
        )
}