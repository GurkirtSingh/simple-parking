import BreadcrumbClient from "@/components/breadcrumb";

export default async function PropertiesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="space-y-4 p-4">
            <BreadcrumbClient/>
            {children}
        </div>
    )
}