export default function DashboardLayout({
    children,
    reservations,
    availability,
}: {
    children: React.ReactNode;
    reservations: React.ReactNode;
    availability: React.ReactNode;
}) {
    return (
        <div className="flex flex-col gap-2">
            {reservations && (
                <div className="fixed h-full right-0 m-auto">
                    {reservations}
                </div>
            )}
            <div className="max-w-xl flex xl:fixed xl:left-4 px-4">{availability}</div>
            <div>{children}</div>

        </div>
    );
}