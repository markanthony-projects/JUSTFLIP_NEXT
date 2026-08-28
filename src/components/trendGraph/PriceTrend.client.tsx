"use client";

import { useMemo, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, } from "recharts";

import CustomDropdown from "./CustomDropdown";
import CustomTooltip from "./CustomTooltip";
import { getCurrencySymbol, calculateAverage } from "./utils";

export interface PriceTrendProps {
    data?: any[];
}

export default function PriceTrend({ data = [] }: PriceTrendProps) {
    const [selectedRange, setSelectedRange] = useState(5);
    const currentYear = new Date().getFullYear();

    const filteredData = useMemo(() => {
        return data.filter((item: any) => {
            const year = Number(item.year);
            return year >= currentYear - (selectedRange - 1) && year <= currentYear;
        });
    }, [data, selectedRange, currentYear]);

    const averagePrice = useMemo(() => calculateAverage(filteredData), [filteredData]);
    const currency = filteredData.at(-1)?.currency || "INR";
    const currencySymbol = getCurrencySymbol(currency);

    const formatYAxis = (value: number) => `${currencySymbol}${Math.round(value)}`;

    return (
        <div className="w-full  bg-white  rounded-xl">
            <h2 className="text-sm font-semibold md:text-lg  pt-2">Price Trends Graph</h2>

            <div className="flex justify-between items-center py-2">
                <h2 className="text-xs font-normal flex items-center gap-2">
                    Avg Price
                    <span className="text-xs md:text-sm font-semibold">
                        {currencySymbol} {averagePrice.toLocaleString()} / Sq. Ft
                    </span>
                </h2>

                <CustomDropdown selectedRange={selectedRange} setSelectedRange={setSelectedRange} />
            </div>

            <div className="flex flex-col h-[350px] md:h-[400px]">
                <div className="flex-1 min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={filteredData}>
                            <defs>
                                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                            </defs>

                            <XAxis dataKey="year" />

                            <YAxis width={50} tick={{ fontSize: 14, fill: "#585858" }} tickFormatter={formatYAxis} axisLine={false} tickMargin={10} />

                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <Tooltip content={<CustomTooltip />} />
                            <Area type="monotone" dataKey="price" stroke="#3b82f6" fillOpacity={0.3} fill="url(#colorPrice)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
                </div>
            </div>
            );
}