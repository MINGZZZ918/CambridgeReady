"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Props {
  data: { date: string; score: number }[];
  color: string;
  label: string;
}

export default function ScoreTrendChart({ data, color, label }: Props) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" vertical={false} />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 12, fill: "#6B6B6B" }}
          axisLine={{ stroke: "#E5E5E5" }}
          tickLine={false}
        />
        <YAxis
          domain={[0, 20]}
          tick={{ fontSize: 12, fill: "#6B6B6B" }}
          axisLine={false}
          tickLine={false}
          width={30}
        />
        <Tooltip
          contentStyle={{
            borderRadius: 8,
            border: "1px solid #E5E5E5",
            fontSize: 13,
          }}
          formatter={(value) => [`${value}/20`, label]}
        />
        <Line
          type="monotone"
          dataKey="score"
          stroke={color}
          strokeWidth={2}
          dot={{ r: 4, fill: color }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
