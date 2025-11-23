"use client";

import { useState } from "react";
import { PieChart, Pie, Sector, Cell, Tooltip, Legend } from "recharts";

const COLORS = ["#4ade80", "#facc15", "#f87171"];
// Easy – green, Medium – yellow, Hard – red

// ✅ This is the active highlighted slice renderer
const renderActiveShape = (props: any) => {
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
  } = props;

  const RADIAN = Math.PI / 180;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);

  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;

  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;

  const ex = mx + (cos > 0 ? 1 : -1) * 22;
  const ey = my;

  const textAnchor = cos > 0 ? "start" : "end";

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.name}
      </text>

      {/* Main slice */}
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />

      {/* Highlight ring */}
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />

      {/* Callout line */}
      <path
        d={`M${sx},${sy} L${mx},${my} L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />

      {/* Callout dot */}
      <circle cx={ex} cy={ey} r={3} fill={fill} stroke="none" />

      {/* Value text */}
      <text
        x={ex + (cos > 0 ? 12 : -12)}
        y={ey}
        textAnchor={textAnchor}
        fill="#333"
      >
        {value} problems
      </text>

      {/* Percentage */}
      <text
        x={ex + (cos > 0 ? 12 : -12)}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill="#888"
      >
        {(percent * 100).toFixed(1)}%
      </text>
    </g>
  );
};

export default function CustomPieChart({ data }: { data: any[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const onPieEnter = (_: any, index: number) => setActiveIndex(index);

  return (
    <PieChart width={500} height={350}>
      <Pie
        activeShape={renderActiveShape}
        data={data}
        cx="50%"
        cy="50%"
        innerRadius={70}
        outerRadius={100}
        dataKey="value"
        onMouseEnter={onPieEnter}
      >
        {data.map((_, index) => (
          <Cell key={index} fill={COLORS[index]} />
        ))}
      </Pie>

      <Tooltip />

      {/* ✅ Legend added */}
      <Legend
        verticalAlign="bottom"
        height={36}
        formatter={(value: any) => <span className="text-sm">{value}</span>}
      />
    </PieChart>
  );
}
