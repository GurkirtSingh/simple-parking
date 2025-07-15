export default function DashboardLayout({
    children,
    reservations,
}: {
    children: React.ReactNode;
    reservations: React.ReactNode;
}) {
    return (
        <div>
            {reservations && (
                <div className="fixed h-full right-0 m-auto">
                    {reservations}
                </div>
            )}
            <div>{children}</div>

        </div>
    );
}