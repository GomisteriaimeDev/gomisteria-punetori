import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const data = [
  { name: "Janar", Goma: 80, BusKamion: 50, Aksesor: 30 },
  { name: "Shkurt", Goma: 100, BusKamion: 60, Aksesor: 35 },
  { name: "Mars", Goma: 120, BusKamion: 80, Aksesor: 40 },
  { name: "Prill", Goma: 150, BusKamion: 100, Aksesor: 60 },
  { name: "Maj", Goma: 200, BusKamion: 150, Aksesor: 80 },
  { name: "Qershor", Goma: 220, BusKamion: 170, Aksesor: 100 },
  { name: "Korrik", Goma: 240, BusKamion: 180, Aksesor: 120 },
  { name: "Gusht", Goma: 240, BusKamion: 180, Aksesor: 120 },
  { name: "Shtator", Goma: 240, BusKamion: 180, Aksesor: 120 },
  { name: "Tetor", Goma: 240, BusKamion: 180, Aksesor: 120 },
  { name: "Nëntor", Goma: 240, BusKamion: 180, Aksesor: 120 },
  { name: "Dhjetor", Goma: 240, BusKamion: 180, Aksesor: 120 },
];

const CustomTooltipLine = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          backgroundColor: "#2a3f54",
          borderRadius: "8px",
          padding: "10px",
          color: "white",
          fontSize: "14px",
        }}
      >
        <p className="customToolTipLineLabel">{`${label} `}</p>
        {payload.map((entry: any, index: number) => (
          <p key={`tooltip-${index}`} className="customToolTipLineText">
            {" "}
            {`${entry.name}:`} <span>{`${entry.value.toLocaleString()}€`}</span>
          </p>
        ))}
      </div>
    );
  }

  return null;
};
const CustomDot = (props: any) => {
  const { cx, cy, stroke, value, fill } = props;
  if (value) {
    return (
      <circle
        cx={cx}
        cy={cy}
        r={6}
        stroke={stroke}
        fill={fill}
        strokeWidth={10}
      />
    );
  }
  return null;
};
const renderCustomLegend = (value: string, entry: any) => {
  const { color } = entry;
  return (
    <span style={{ color, fontSize: "16px", marginRight: "20px" }}>
      {value}
    </span>
  );
};
const LineChartComponent: React.FC = () => {
  return (
    <ResponsiveContainer width="100%" height={360}>
      <LineChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 0 }}
      >
        <CartesianGrid stroke="#f5f5f5" />
        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip content={<CustomTooltipLine />} />
        <Line
          type="monotone"
          dataKey="Goma"
          stroke="#017EFA"
          strokeWidth={3}
          activeDot={<CustomDot stroke={"#017EFA"} />}
        />
        <Line
          type="monotone"
          dataKey="BusKamion"
          stroke="#30D987"
          strokeWidth={3}
          activeDot={<CustomDot stroke={"#30D987"} />}
        />
        <Line
          type="monotone"
          dataKey="Aksesor"
          stroke="#FD1F9B"
          strokeWidth={3}
          activeDot={<CustomDot stroke={"#FD1F9B"} />}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default LineChartComponent;
