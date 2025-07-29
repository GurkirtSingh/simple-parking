"use client"

import { createClient } from "@/lib/supabase/client"
import { useCallback, useEffect, useState } from "react"
import { Pie, PieChart, Label } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "An stall availability chart"

const defaultChartData = [
    { status: "arriving", stalls: 0, fill: "var(--color-arriving)" },
    { status: "checkout", stalls: 0, fill: "var(--color-checkout)" },
    { status: "staff", stalls: 0, fill: "var(--color-staff)" },
    { status: "stayover", stalls: 0, fill: "var(--color-stayover)" },
    { status: "available", stalls: 0, fill: "var(--color-available)" },
]

const chartConfig = {
    stalls: {
        label: "Stalls",
    },
    arriving: {
        label: "Arriving",
        color: "var(--arriving)",
    },
    checkout: {
        label: "Checkout",
        color: "var(--checkout)",
    },
    staff: {
        label: "Staff",
        color: "var(--staff)",
    },
    stayover: {
        label: "Stayover",
        color: "var(--stayover)",
    },
    available: {
        label: "Available",
        color: "var(--available)",
    },
} satisfies ChartConfig


export default function PropertyAvailabilityChart({ propertyId, propertyName }: { propertyId: string, propertyName: string }) {
    const [totalStalls, setTotalStalls] = useState<number | null>(null)
    const [totalReservedStalls, setTotalReservedStalls] = useState<number | null>(null)
    const [chartData, setChartData] = useState(defaultChartData)
    const supabase = createClient()
    const fetchStatusCount = useCallback(async () => {
        const { data } = await supabase.from('current_reservation_status').select('status, is_staff').eq('property_id', propertyId)
        if (data) {
            const statusCount = data.reduce((acc, row) => {
                if (row.is_staff) {
                    acc['staff'] = (acc['staff'] || 0) + 1
                }
                else if (row.status) {
                    acc[row.status] = (acc[row.status] || 0) + 1
                }
                return acc
            }, {} as Record<string, number>)
            const available = totalStalls !== null ? totalStalls - data.length : 0
            setChartData([
                { status: 'arriving', stalls: statusCount['arriving'] || 0, fill: 'var(--color-arriving)' },
                { status: 'checkout', stalls: statusCount['checking_out'] || 0, fill: 'var(--color-checkout)' },
                { status: 'staff', stalls: statusCount['staff'] || 0, fill: 'var(--color-staff)' },
                { status: 'stayover', stalls: statusCount['stayover'] || 0, fill: 'var(--color-stayover)' },
                { status: 'available', stalls: available, fill: 'var(--color-available)' },
            ])
            setTotalReservedStalls(data.length)

        }
    }, [supabase, propertyId, totalStalls])

    const fetchTotalStalls = useCallback(async () => {
        const { data: stalls } = await supabase.from('property_stalls').select('is_active').eq('property_id', propertyId)
        if (stalls) {
            setTotalStalls(stalls.length)
        }
    }, [supabase, propertyId])

    useEffect(() => {
        fetchTotalStalls()
        fetchStatusCount()
        const reservations_changes = async ()=> {
            await supabase.realtime.setAuth()
            const channel = supabase
            .channel(`reservations:changes`, {
                config: {private: true},
            })
            .on('broadcast', { event: '*' }, () => {
                fetchStatusCount()
                fetchTotalStalls()
            })
            .subscribe()

            return ()=>{
                supabase.removeChannel(channel)
            }
        }
        reservations_changes()
    }, [supabase, fetchStatusCount, fetchTotalStalls, propertyId])
    if (totalReservedStalls === null || totalStalls === null) return null
    return (
        <Card className="flex flex-col min-w-52">
            <CardHeader className="items-center pb-0">
                <CardTitle>{propertyName}</CardTitle>
                <CardDescription>{new Date().toLocaleDateString('en-CA')}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[250px]"
                >
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie
                            data={chartData}
                            dataKey="stalls"
                            nameKey="status"
                            innerRadius={50}
                            strokeWidth={5}
                        >
                            <Label
                                content={({ viewBox }) => {
                                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                        return (
                                            <text
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                            >
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    className="fill-foreground text-3xl font-bold"
                                                >
                                                    {totalStalls - totalReservedStalls}
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 24}
                                                    className="fill-muted-foreground"
                                                >
                                                    Available
                                                </tspan>
                                            </text>
                                        )
                                    }
                                }}
                            />
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </Card>

    )
}
