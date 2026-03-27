"use client";

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";

interface Props {
  data: { skill: string; skillZh: string; accuracy: number }[];
  color: string;
}

export default function SkillRadarChart({ data, color }: Props) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <RadarChart data={data} cx="50%" cy="50%" outerRadius="70%">
        <PolarGrid stroke="#E5E5E5" />
        <PolarAngleAxis
          dataKey="skillZh"
          tick={{ fontSize: 13, fill: "#6B6B6B" }}
        />
        <Radar
          dataKey="accuracy"
          stroke={color}
          fill={color}
          fillOpacity={0.2}
          strokeWidth={2}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
