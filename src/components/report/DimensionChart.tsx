"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface Props {
  dimensions: { name: string; score: number }[];
  color: string;
}

export default function DimensionChart({ dimensions, color }: Props) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={dimensions} barCategoryGap="25%">
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" vertical={false} />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 11, fill: "#6B6B6B" }}
          axisLine={{ stroke: "#E5E5E5" }}
          tickLine={false}
        />
        <YAxis
          domain={[0, 5]}
          tick={{ fontSize: 12, fill: "#6B6B6B" }}
          axisLine={false}
          tickLine={false}
          width={25}
        />
        <Tooltip
          contentStyle={{
            borderRadius: 8,
            border: "1px solid #E5E5E5",
            fontSize: 13,
          }}
          formatter={(value) => [`${value}/5`, "得分"]}
        />
        <Bar dataKey="score" radius={[4, 4, 0, 0]}>
          {dimensions.map((_, index) => (
            <Cell key={index} fill={color} fillOpacity={0.8 + index * 0.05} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
