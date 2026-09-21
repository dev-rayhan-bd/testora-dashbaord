"use client";

import { useMemo } from "react";
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export type BarPoint = {
  label: string;
  value: number;
  color?: string;
  fullName?: string;
};

type DashboardHorizontalBarChartProps = {
  data: BarPoint[];
  height?: number;
  showXAxisTicks?: boolean;
  unitLabel?: string;
  valueFormatter?: (value: number) => string;
  yAxisWidth?: number;
};

export default function DashboardHorizontalBarChart({
  data,
  height = 240,
  showXAxisTicks = false,
  unitLabel = "users",
  valueFormatter,
  yAxisWidth = 110,
}: DashboardHorizontalBarChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value), 0);

  const domainMax = useMemo(() => {
    if (unitLabel === "%") return 100;
    if (maxValue <= 4) return Math.max(maxValue, 4);
    if (maxValue <= 10) return 10;
    if (maxValue <= 25) return 25;
    if (maxValue <= 50) return Math.ceil(maxValue / 10) * 10;
    if (maxValue <= 100) return Math.ceil(maxValue / 20) * 20;
    if (maxValue <= 500) return Math.ceil(maxValue / 50) * 50;
    return Math.ceil(maxValue / 100) * 100;
  }, [maxValue, unitLabel]);

  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 6, right: 14, left: 6, bottom: showXAxisTicks ? 16 : 6 }}
        >
          <XAxis
            type="number"
            hide={!showXAxisTicks}
            domain={[0, domainMax]}
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 10, fill: "#94a3b8" }}
            tickFormatter={(value) => (value >= 1000 ? `${(value / 1000).toFixed(1)}k` : `${value}`)}
          />
          <YAxis
            dataKey="label"
            type="category"
            width={yAxisWidth}
            tick={{ fontSize: 11, fill: "#475569" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              border: "1px solid #cbd5e1",
              borderRadius: "8px",
              background: "#ffffff",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
              fontSize: "12px",
            }}
            labelStyle={{ color: "#1e293b", fontWeight: 600 }}
            labelFormatter={(label, payload) => (payload?.[0]?.payload as BarPoint | undefined)?.fullName || label}
            formatter={(value) => [
              valueFormatter
                ? valueFormatter(Number(value))
                : `${Number(value).toLocaleString()} ${unitLabel}`,
              unitLabel === "%" ? "Percentage" : "Volume",
            ]}
          />
          <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={showXAxisTicks ? 22 : 14}>
            {data.map((item, idx) => (
              <Cell
                key={`${item.label}-${idx}`}
                fill={item.color ?? (idx === 0 ? "#2f86d8" : "#94a3b8")}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
