import { Skeleton } from "@/components/ui/skeleton";
import {
    Table,
    TableHead,
    TableHeader,
    TableCaption,
    TableBody,
    TableCell,
    TableRow
} from "@/components/ui/table";

export default function Loading() {
    return (
        <Table>
            <TableCaption><Skeleton className="w-1/4 h-2" /></TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[12.5%]"><Skeleton className="w-full h-6" /></TableHead>
                    <TableHead className="w-[12.5%]"><Skeleton className="w-full h-6" /></TableHead>
                    <TableHead className="w-[12.5%]"><Skeleton className="w-full h-6" /></TableHead>
                    <TableHead className="w-[12.5%]"><Skeleton className="w-full h-6" /></TableHead>
                    <TableHead className="w-[12.5%]"><Skeleton className="w-full h-6" /></TableHead>
                    <TableHead className="w-[12.5%]"><Skeleton className="w-full h-6" /></TableHead>
                    <TableHead className="w-[12.5%]"><Skeleton className="w-full h-6" /></TableHead>
                    <TableHead className="w-[12.5%]"><Skeleton className="w-full h-6" /></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {Array.from({ length: 3 }).map((_, index) => (
                    <TableRow key={index}>
                        <TableCell><Skeleton className="w-full h-6" /></TableCell>
                        <TableCell><Skeleton className="w-full h-6" /></TableCell>
                        <TableCell><Skeleton className="w-full h-6" /></TableCell>
                        <TableCell><Skeleton className="w-full h-6" /></TableCell>
                        <TableCell><Skeleton className="w-full h-6" /></TableCell>
                        <TableCell><Skeleton className="w-full h-6" /></TableCell>
                        <TableCell><Skeleton className="w-full h-6" /></TableCell>
                        <TableCell><Skeleton className="w-full h-6" /></TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}