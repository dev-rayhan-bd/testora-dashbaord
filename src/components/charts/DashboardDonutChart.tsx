"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

type DonutPoint = {
  label: string;
  value: number;
  color: string;
};

type DashboardDonutChartProps = {
  data: DonutPoint[];
  centerLabel?: string;
};

export default function DashboardDonutChart({ data, centerLabel = "total items" }: DashboardDonutChartProps) {
  const total = data.reduce((acc, item) => acc + item.value, 0);

  return (
    <div className="space-y-4">
      <div className="relative mx-auto size-44 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="label"
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={72}
              paddingAngle={3}
            >
              {data.map((item) => (
                <Cell key={item.label} fill={item.color} stroke="#ffffff" strokeWidth={2} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                border: "1px solid #cbd5e1",
                borderRadius: "8px",
                background: "#ffffff",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                fontSize: "12px",
              }}
              formatter={(value) => [`${Number(value).toLocaleString()} count`, "Usage"]}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-[#1e293b]">{total.toLocaleString()}</span>
          <span className="text-[10px] uppercase font-medium text-[#64748b] tracking-wider">{centerLabel}</span>
        </div>
      </div>

      <div className="space-y-2 divide-y divide-slate-100">
        {data.map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between pt-1.5 text-xs text-[#475569]"
          >
            <div className="flex items-center gap-2 min-w-0 pr-2">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="truncate font-medium text-[#334155]" title={item.label}>
                {item.label}
              </span>
            </div>
            <div className="flex items-center gap-2.5 shrink-0">
              <span className="font-semibold text-[#1e293b]">{item.value.toLocaleString()}</span>
              <span className="inline-block w-11 text-right text-[11px] font-medium text-[#64748b]">
                {total > 0 ? ((item.value / total) * 100).toFixed(1) : 0}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
