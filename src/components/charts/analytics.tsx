"use client";
import { useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import { ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/primitives";
import { revenueData } from "@/data/messages";
import { money } from "@/lib/utils";
const tooltipStyle = {
  border: "1px solid #e6ecef",
  borderRadius: 10,
  boxShadow: "0 4px 20px #152c3410",
  fontSize: 12,
};
export function RevenueChart({ compact = false }: { compact?: boolean }) {
  const [period, setPeriod] = useState("Month");
  const data =
    period === "Year"
      ? revenueData
      : period === "Week"
        ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((name, i) => ({
            name,
            revenue: [3200, 4100, 3800, 5600, 4900, 3200][i],
            expenses: [1700, 1600, 2000, 2100, 1900, 1300][i],
          }))
        : Array.from({ length: 12 }, (_, i) => ({
            name: `Oct ${i * 2 + 1}`,
            revenue: [
              2400, 3200, 2900, 3800, 3500, 4800, 4400, 5200, 4700, 5900, 5600,
              6500,
            ][i],
            expenses: [
              1700, 2100, 1600, 2200, 2100, 2800, 2500, 3100, 2600, 3400, 3100,
              3600,
            ][i],
          }));
  const revenue =
    period === "Month" ? 51200 : data.reduce((s, d) => s + d.revenue, 0);
  const expenses =
    period === "Month" ? 22140 : data.reduce((s, d) => s + d.expenses, 0);
  return (
    <Card
      title="Revenue overview"
      description={
        compact
          ? undefined
          : "A clearer picture of your clinic’s financial health"
      }
      action={
        <div className="segmented">
          {["Week", "Month", "Year"].map((p) => (
            <button
              className={period === p ? "active" : ""}
              onClick={() => setPeriod(p)}
              key={p}
            >
              {p}
            </button>
          ))}
        </div>
      }
    >
      <div className="revenue-stats">
        <div>
          <span>
            <i className="legend-dot teal" />
            Revenue
          </span>
          <strong>
            {money(revenue)}{" "}
            <small>
              <ArrowUpRight size={12} />
              12.8%
            </small>
          </strong>
        </div>
        <div>
          <span>
            <i className="legend-dot light-teal" />
            Expenses
          </span>
          <strong>{money(expenses)}</strong>
        </div>
        <div>
          <span>
            <i className="legend-dot slate" />
            Net income
          </span>
          <strong>{money(revenue - expenses)}</strong>
        </div>
      </div>
      <div className="chart-container" style={{ height: compact ? 230 : 250 }}>
        <ResponsiveContainer
          width="100%"
          height="100%"
          minWidth={0}
          initialDimension={{ width: 700, height: 250 }}
        >
          <AreaChart
            data={data}
            margin={{ top: 15, right: 22, left: -10, bottom: 0 }}
          >
            <defs>
              <linearGradient id="revenue-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0f9fa8" stopOpacity={0.16} />
                <stop offset="100%" stopColor="#0f9fa8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 5"
              vertical={false}
              stroke="#e9eef0"
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#8b969f", fontSize: 11 }}
              minTickGap={20}
              dy={9}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#8b969f", fontSize: 11 }}
              tickFormatter={(v) => `$${v / 1000}k`}
            />
            <Tooltip
              contentStyle={tooltipStyle}
              formatter={(v) => money(Number(v))}
            />
            <Area
              name="Revenue"
              type="monotone"
              dataKey="revenue"
              stroke="#139b99"
              strokeWidth={2.5}
              fill="url(#revenue-fill)"
              isAnimationActive={false}
            />
            <Area
              name="Expenses"
              type="monotone"
              dataKey="expenses"
              stroke="#b2c9cb"
              strokeWidth={1.8}
              strokeDasharray="5 4"
              fill="transparent"
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="chart-footnote">
        <span className="status-dot" />{" "}
        {period === "Month"
          ? "October 2026 operating forecast"
          : "Illustrative performance data"}
        <span>USD</span>
      </div>
    </Card>
  );
}
export function DistributionChart({ payment = false }: { payment?: boolean }) {
  const data = payment
    ? [
        { name: "Card", value: 58, color: "#139b99" },
        { name: "Insurance", value: 24, color: "#9bc4c3" },
        { name: "Cash", value: 12, color: "#c8dcda" },
        { name: "Bank transfer", value: 6, color: "#e5eeee" },
      ]
    : [
        { name: "Confirmed", value: 10, color: "#119c9a" },
        { name: "Scheduled", value: 3, color: "#bdcedb" },
        { name: "Checked In", value: 2, color: "#b4afd3" },
        { name: "In Treatment", value: 1, color: "#e9c580" },
        { name: "Completed", value: 6, color: "#a4d1bd" },
        { name: "Cancelled", value: 1, color: "#eabdb6" },
      ];
  return (
    <Card
      title={payment ? "Payment methods" : "Appointment status"}
      description={payment ? "How patients pay" : "Your day, at a glance"}
    >
      <div className="donut-wrap">
        <ResponsiveContainer
          width="100%"
          height={190}
          minWidth={0}
          initialDimension={{ width: 300, height: 190 }}
        >
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              innerRadius={65}
              outerRadius={82}
              paddingAngle={4}
              cornerRadius={4}
              stroke="none"
              startAngle={90}
              endAngle={-270}
              isAnimationActive={false}
            >
              {data.map((d) => (
                <Cell key={d.name} fill={d.color} />
              ))}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} />
          </PieChart>
        </ResponsiveContainer>
        <div className="donut-center">
          <strong>{payment ? "100%" : "23"}</strong>
          <span>{payment ? "collected" : "appointments"}</span>
        </div>
      </div>
      <div className="distribution-legend">
        {data.map((d) => (
          <div key={d.name}>
            <span>
              <i style={{ background: d.color }} />
              {d.name}
            </span>
            <strong>
              {d.value}
              {payment ? "%" : ""}
            </strong>
          </div>
        ))}
      </div>
    </Card>
  );
}
export function SimpleBarChart({
  data,
  dataKey = "value",
  height = 240,
}: {
  data: { name: string; value: number }[];
  dataKey?: string;
  height?: number;
}) {
  return (
    <div style={{ height, width: "100%", minWidth: 0 }}>
      <ResponsiveContainer
        width="100%"
        height="100%"
        minWidth={0}
        initialDimension={{ width: 700, height: 250 }}
      >
        <BarChart data={data} margin={{ left: -22, right: 15, top: 15 }}>
          <CartesianGrid
            vertical={false}
            strokeDasharray="3 5"
            stroke="#e9eef0"
          />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11, fill: "#8b969f" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#8b969f" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip contentStyle={tooltipStyle} />
          <Bar
            dataKey={dataKey}
            fill="#55aaa6"
            radius={[5, 5, 0, 0]}
            maxBarSize={36}
            isAnimationActive={false}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
