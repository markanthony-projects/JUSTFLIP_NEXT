"use client";

import { useMemo, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, } from "recharts";

import CustomDropdown from "./CustomDropdown";
import CustomTooltip from "./CustomTooltip";
import { getCurrencySymbol, calculateAverage } from "./utils";

export default function PriceTrend({ data = [] }) {
    const [selectedRange, setSelectedRange] = useState(5);
    const currentYear = new Date().getFullYear();

    const filteredData = useMemo(() => {
        return data.filter((item) => {
            const year = Number(item.year);
            return year >= currentYear - (selectedRange - 1) && year <= currentYear;
        });
    }, [data, selectedRange, currentYear]);

    const averagePrice = useMemo(() => calculateAverage(data), [data]);
    const currency = filteredData.at(-1)?.currency || "INR";
    const currencySymbol = getCurrencySymbol(currency);

    const formatYAxis = (value) => `${currencySymbol}${Math.round(value)}`;

    return (
        <div className="w-full  bg-white  rounded-xl">
            <h2 className="md:text-lg font-medium">Price Trends Graph</h2>

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
                                    <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                                </linearGradient>
                            </defs>

                            <XAxis dataKey="year" />

                            <YAxis width={50} tick={{ fontSize: 14, fill: "#585858" }} tickFormatter={formatYAxis} axisLine={false} tickMargin={5} />

                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <Tooltip content={<CustomTooltip />} />
                            <Area type="monotone" dataKey="price" stroke="#82ca9d" fillOpacity={1} fill="url(#colorPrice)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
                </div>
            </div>
            );
}