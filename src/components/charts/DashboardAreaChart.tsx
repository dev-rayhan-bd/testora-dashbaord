"use client";

import { useMemo } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type AreaPoint = {
  month: string;
  users: number;
};

type DashboardAreaChartProps = {
  data: AreaPoint[];
};

export default function DashboardAreaChart({ data }: DashboardAreaChartProps) {
  const { domain, ticks } = useMemo(() => {
    const maxVal = Math.max(...data.map((d) => d.users), 0);
    if (maxVal <= 4) {
      return { domain: [0, 4], ticks: [0, 1, 2, 3, 4] };
    }
    if (maxVal <= 10) {
      return { domain: [0, 10], ticks: [0, 2, 4, 6, 8, 10] };
    }
    if (maxVal <= 25) {
      return { domain: [0, 25], ticks: [0, 5, 10, 15, 20, 25] };
    }
    if (maxVal <= 50) {
      return { domain: [0, 50], ticks: [0, 10, 20, 30, 40, 50] };
    }
    const ceiling = Math.ceil(maxVal / 20) * 20;
    const step = ceiling / 5;
    return {
      domain: [0, ceiling],
      ticks: Array.from({ length: 6 }, (_, i) => i * step),
    };
  }, [data]);

  return (
    <div className="h-76 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 12, left: -14, bottom: 0 }}>
          <defs>
            <linearGradient id="dashboardGrowth" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2f86d8" stopOpacity={0.4} />
              <stop offset="60%" stopColor="#5aa3dc" stopOpacity={0.15} />
              <stop offset="100%" stopColor="#dbeafe" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: "#64748b" }}
            axisLine={{ stroke: "#e2e8f0" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#64748b" }}
            axisLine={false}
            tickLine={false}
            domain={domain}
            ticks={ticks}
            allowDecimals={false}
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
            formatter={(value) => [`${value} new student(s)`, "Registrations"]}
          />
          <Area
            type="monotone"
            dataKey="users"
            stroke="#2f86d8"
            strokeWidth={2.5}
            fill="url(#dashboardGrowth)"
            fillOpacity={1}
            dot={(props) => {
              const { cx, cy, payload } = props;
              if (payload.users > 0) {
                return (
                  <circle
                    key={`dot-${payload.month}`}
                    cx={cx}
                    cy={cy}
                    r={4}
                    fill="#2f86d8"
                    stroke="#ffffff"
                    strokeWidth={2}
                  />
                );
              }
              return <circle key={`dot-${payload.month}`} cx={cx} cy={cy} r={0} />;
            }}
            activeDot={{ r: 5, fill: "#2f86d8", stroke: "#ffffff", strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
